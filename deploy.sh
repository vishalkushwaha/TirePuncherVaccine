#!/usr/bin/env bash
# =============================================================================
#  Tyre Puncture Vaccine — one-command setup & deploy for Debian 13 (trixie)
#
#  Usage (from the project folder, as root):
#      sudo bash deploy.sh
#
#  Optional overrides:
#      sudo DOMAIN=tyrepuncturevaccine.com EMAIL=you@example.com bash deploy.sh
#
#  Safe to re-run any number of times — every run:
#    * git-pulls the latest code (if this folder is a git clone)
#    * mirrors it to /opt (deleted/renamed files are removed, never duplicated)
#    * rebuilds the Python env only when requirements.txt changes
#    * builds the frontend into a fresh folder and swaps it in (no downtime,
#      no leftover old bundles)
#    * overwrites (never appends) every system config: systemd, nginx, SSL
#  Always kept: the database, files uploaded on the server, .env secrets,
#  the admin password, and SSL certificates.
# =============================================================================
set -Eeuo pipefail

# ----------------------------- Configuration ---------------------------------
DOMAIN="${DOMAIN:-tyrepuncturevaccine.com}"   # leave empty ("") for IP-only HTTP
EMAIL="${EMAIL:-}"                             # Let's Encrypt contact (optional)
APP_NAME="tyrepuncturevaccine"
APP_DIR="/opt/${APP_NAME}"
APP_USER="tpv"
DB_NAME="${APP_NAME}"
DB_USER="tpv"
API_PORT="8001"
NODE_MAJOR="22"
CREDS_FILE="/root/${APP_NAME}-credentials.txt"
SRC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ------------------------------- Helpers -------------------------------------
c_info="\033[1;36m"; c_ok="\033[1;32m"; c_warn="\033[1;33m"; c_err="\033[1;31m"; c_off="\033[0m"
step() { echo -e "\n${c_info}==> $*${c_off}"; }
ok()   { echo -e "${c_ok}  ✔ $*${c_off}"; }
warn() { echo -e "${c_warn}  ! $*${c_off}"; }
die()  { echo -e "${c_err}  ✘ $*${c_off}" >&2; exit 1; }
trap 'die "Failed at line $LINENO: $BASH_COMMAND"' ERR

[[ $EUID -eq 0 ]] || die "Run as root:  sudo bash deploy.sh"
[[ -d "$SRC_DIR/backend" && -d "$SRC_DIR/frontend" ]] || die "Run this from the project folder (must contain backend/ and frontend/)."
grep -q 'trixie\|bookworm' /etc/os-release || warn "Tested on Debian 13; continuing anyway."
export DEBIAN_FRONTEND=noninteractive

# Only one deploy at a time (a second run waits instead of colliding)
exec 9>"/var/lock/${APP_NAME}-deploy.lock"
flock -w 600 9 || die "Another deploy is still running."

# Pull the latest code first (when deploying from a git clone), then restart
# this script so the newest version of deploy.sh itself is what runs.
if [[ -d "$SRC_DIR/.git" && -z "${TPV_PULLED:-}" ]] && command -v git >/dev/null; then
  step "Updating source code (git pull)"
  if git -C "$SRC_DIR" pull --ff-only; then
    ok "Source is up to date"
  else
    warn "git pull failed (local changes or no network) — deploying the code as it is"
  fi
  export TPV_PULLED=1
  exec 9>&-
  exec bash "$SRC_DIR/deploy.sh" "$@"
fi

# State markers: "installed" is written only after a fully successful first run,
# so an interrupted first run is completed properly on the next attempt.
INSTALLED_MARK="$APP_DIR/.installed"
SHOW_CREDS=false

# --------------------------- 1. System packages ------------------------------
step "Installing system packages"
apt-get update -qq
apt-get install -y -qq \
  ca-certificates curl gnupg rsync openssl \
  python3 python3-venv python3-pip python3-dev build-essential libpq-dev \
  postgresql postgresql-contrib nginx certbot >/dev/null
ok "Base packages installed"

if ! command -v node >/dev/null || [[ "$(node -v | sed 's/v\([0-9]*\).*/\1/')" -lt "$NODE_MAJOR" ]]; then
  step "Installing Node.js ${NODE_MAJOR}.x"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
ok "Node $(node -v), npm $(npm -v), $(python3 --version)"

# --------------------------- 2. App user & code ------------------------------
step "Syncing code to ${APP_DIR}"
id -u "$APP_USER" >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$APP_DIR/backend/media"

# Code: mirror everything except runtime state, secrets, and local-only artefacts.
# Root-level source images (screenshots/WhatsApp posters) are skipped: their web
# copies already live in frontend/public/assets and backend/media.
if [[ "$SRC_DIR" != "$APP_DIR" ]]; then
  # --delete removes files that no longer exist in the source, so the server
  # copy is always an exact mirror (no stale or duplicate files).
  rsync -a --delete \
    --exclude '/.git/' --exclude 'node_modules/' --exclude '__pycache__/' \
    --exclude '/frontend/dist/' --exclude '/frontend/dist.new/' \
    --exclude '/backend/.venv/' --exclude '/backend/venv/' \
    --exclude '/backend/.env' --exclude '/backend/media/' --exclude '/backend/pg_data/' \
    --exclude '/backend/*.log' --exclude '/.installed' --exclude '/.requirements.sha' \
    --exclude '/_build/' --exclude '/Proposal/' \
    --exclude '/*.png' --exclude '/*.jpeg' --exclude '/*.jpg' --exclude '/verify_all_pages.py' \
    "$SRC_DIR/" "$APP_DIR/"
  # Remove local-only artefacts that an older deploy may have copied over
  rm -rf "$APP_DIR/.git" "$APP_DIR/_build" "$APP_DIR/Proposal" "$APP_DIR/backend/pg_data" \
         "$APP_DIR/backend/venv" "$APP_DIR/verify_all_pages.py"
  find "$APP_DIR" -maxdepth 1 -type f \( -name '*.png' -o -name '*.jpeg' -o -name '*.jpg' \) -delete
fi
# Media: add new files and update changed ones, never delete uploads made on the server
if [[ -d "$SRC_DIR/backend/media" && "$SRC_DIR" != "$APP_DIR" ]]; then
  rsync -a --update "$SRC_DIR/backend/media/" "$APP_DIR/backend/media/"
fi
# Clear stale Python bytecode so removed/renamed modules can't linger
find "$APP_DIR/backend" -path "$APP_DIR/backend/.venv" -prune -o -type d -name '__pycache__' -print0 | xargs -0 -r rm -rf
# Strip Windows line endings from shell/python files if the code came from Windows
find "$APP_DIR" -path "$APP_DIR/frontend/node_modules" -prune -o -path "$APP_DIR/backend/.venv" -prune -o \
  \( -name '*.sh' -o -name '*.py' \) -type f -print0 | xargs -0 -r sed -i 's/\r$//'
ok "Code synced (old files removed, new files updated)"

# --------------------------- 3. PostgreSQL -----------------------------------
step "Configuring PostgreSQL"
systemctl enable --now postgresql >/dev/null
if [[ ! -s "$APP_DIR/backend/.env" ]]; then
  DB_PASS="$(openssl rand -hex 24)"
  SECRET_KEY="$(openssl rand -hex 48)"
  if runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
    runuser -u postgres -- psql -qc "ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';"
  else
    runuser -u postgres -- psql -qc "CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';"
  fi
  runuser -u postgres -- psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
    || runuser -u postgres -- createdb -O "$DB_USER" "$DB_NAME"

  cat > "$APP_DIR/backend/.env" <<EOF
# Generated by deploy.sh on $(date -u +%F) — keep this file private
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}
SECRET_KEY=${SECRET_KEY}
PROJECT_NAME="Tyre Puncture Vaccine API & CMS"
OWNER_EMAIL=ujjalaelectricalsbkn@gmail.com
OWNER_PHONE="+91 74130 59364"
EOF
  ok "Database '${DB_NAME}' and secrets created"
else
  ok "Existing database and .env kept"
fi
chmod 600 "$APP_DIR/backend/.env"

# --------------------------- 4. Backend (FastAPI) ----------------------------
step "Installing backend dependencies"
# Rebuild the virtualenv from scratch whenever requirements.txt or the Python
# version changes, so removed/old packages never pile up.
VENV="$APP_DIR/backend/.venv"
REQ_STAMP="$APP_DIR/.requirements.sha"
REQ_SHA="$(cat "$APP_DIR/backend/requirements.txt" <(python3 --version) | sha256sum | cut -d' ' -f1)"
if [[ ! -x "$VENV/bin/python" || "$(cat "$REQ_STAMP" 2>/dev/null)" != "$REQ_SHA" ]]; then
  systemctl stop "${APP_NAME}-api" 2>/dev/null || true   # don't run on a half-built env
  rm -rf "$VENV"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q --upgrade pip wheel
  "$VENV/bin/pip" install -q -r "$APP_DIR/backend/requirements.txt"
  echo "$REQ_SHA" > "$REQ_STAMP"
  ok "Python environment rebuilt (requirements changed)"
else
  ok "Python packages unchanged — reusing environment"
fi

chown -R "$APP_USER:$APP_USER" "$APP_DIR/backend"

step "Initialising database schema & seed data"
# Importing app.main creates tables and seeds defaults (idempotent)
( cd "$APP_DIR/backend" && runuser -u "$APP_USER" -- .venv/bin/python -c "import app.main" ) >/dev/null
ok "Schema ready"

if [[ ! -s "$CREDS_FILE" ]]; then
  ADMIN_PASSWORD="${ADMIN_PASSWORD:-$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)}"
  DB_PASS="$(sed -n 's#^DATABASE_URL=postgresql://[^:]*:\([^@]*\)@.*#\1#p' "$APP_DIR/backend/.env")"
  ( cd "$APP_DIR/backend" && runuser -u "$APP_USER" -- env ADMIN_PASSWORD="$ADMIN_PASSWORD" .venv/bin/python - <<'PY'
import os
from app.database.session import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash
with SessionLocal() as db:
    u = db.query(User).filter(User.username == "admin").first()
    if u:
        u.hashed_password = get_password_hash(os.environ["ADMIN_PASSWORD"])
        db.commit()
PY
  )
  ( umask 077
    cat > "$CREDS_FILE" <<EOF
Tyre Puncture Vaccine — server credentials (generated $(date -u +%F))
Admin panel : /admin/login
Username    : admin
Password    : ${ADMIN_PASSWORD}
DB name     : ${DB_NAME}
DB user     : ${DB_USER}
DB password : ${DB_PASS}
EOF
  )
  ok "Admin password set (saved to ${CREDS_FILE})"
  SHOW_CREDS=true
fi

step "Creating API service (systemd)"
cat > "/etc/systemd/system/${APP_NAME}-api.service" <<EOF
[Unit]
Description=Tyre Puncture Vaccine API (FastAPI)
After=network.target postgresql.service
Requires=postgresql.service

[Service]
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${APP_DIR}/backend
EnvironmentFile=${APP_DIR}/backend/.env
ExecStart=${APP_DIR}/backend/.venv/bin/uvicorn app.main:app \
  --host 127.0.0.1 --port ${API_PORT} --workers 2 --proxy-headers --forwarded-allow-ips 127.0.0.1
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable "${APP_NAME}-api" >/dev/null
systemctl restart "${APP_NAME}-api"
ok "API service running on 127.0.0.1:${API_PORT}"

# --------------------------- 5. Frontend (Vite) ------------------------------
step "Building frontend"
cd "$APP_DIR/frontend"
# Build into dist.new, then swap it in: the live site keeps serving the old
# build until the new one is complete, and no old hashed files are left behind.
rm -rf dist.new dist.old
build_frontend() { npm run build --silent -- --outDir dist.new --emptyOutDir; }
# npm ci always wipes node_modules and installs exactly what the lockfile says
if ! { npm ci --no-audit --no-fund --loglevel=error && build_frontend; }; then
  warn "Clean install failed (lockfile created on another OS) — retrying with fresh install"
  rm -rf node_modules dist.new
  rm -f package-lock.json   # restored from source on the next sync
  npm install --no-audit --no-fund --loglevel=error
  build_frontend
fi
[[ -s dist.new/index.html ]] || die "Frontend build produced no index.html"
chmod -R a+rX dist.new
[[ -d dist ]] && mv dist dist.old
mv dist.new dist
rm -rf dist.old
ok "Frontend built and swapped in → ${APP_DIR}/frontend/dist"

# --------------------------- 6. Nginx + SSL manager --------------------------
step "Configuring Nginx & SSL manager (tpv-ssl)"
mkdir -p "/etc/${APP_NAME}" /var/www/letsencrypt /etc/letsencrypt/renewal-hooks/deploy /etc/nginx/snippets
cat > "/etc/${APP_NAME}/ssl.conf" <<EOF
DOMAIN="${DOMAIN}"
EMAIL="${EMAIL}"
APP_NAME="${APP_NAME}"
EOF

# Shared app locations, included by both the HTTP and the HTTPS server block
cat > "/etc/nginx/snippets/${APP_NAME}-app.conf" <<EOF
root ${APP_DIR}/frontend/dist;
index index.html;
client_max_body_size 25M;

gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/css application/javascript application/json image/svg+xml text/plain;

add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Block hidden files (.env, .git ...) but keep ACME challenges reachable
location ~ /\.(?!well-known) { return 404; }

location /api/ {
    proxy_pass http://127.0.0.1:${API_PORT};
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 60s;
}

location /media/ {
    alias ${APP_DIR}/backend/media/;
    expires 7d;
    access_log off;
}

location /assets/ {
    expires 30d;
    access_log off;
    try_files \$uri =404;
}

location / {
    try_files \$uri \$uri/ /index.html;
}
EOF

# tpv-ssl — renders the nginx site, obtains and renews Let's Encrypt certificates
cat > /usr/local/bin/tpv-ssl <<'SSL_EOF'
#!/usr/bin/env bash
# Usage: tpv-ssl [auto|obtain|renew|nginx|test|status]
set -uo pipefail
CONF="/etc/__APP_NAME__/ssl.conf"
[[ -r "$CONF" ]] || { echo "tpv-ssl: $CONF not found - run deploy.sh first"; exit 1; }
source "$CONF"
SITE="/etc/nginx/sites-available/${APP_NAME}"
LIVE="/etc/letsencrypt/live/${DOMAIN}"
log() { echo "[tpv-ssl] $*"; }

public_ip()     { curl -fsS -4 --max-time 5 https://api.ipify.org 2>/dev/null; }
resolves_here() { [[ -n "$2" && "$(getent ahostsv4 "$1" | awk 'NR==1{print $1}')" == "$2" ]]; }
has_cert()      { [[ -n "$DOMAIN" && -s "$LIVE/fullchain.pem" && -s "$LIVE/privkey.pem" ]]; }

render_nginx() {
  local names="_"
  [[ -n "$DOMAIN" ]] && names="${DOMAIN} www.${DOMAIN}"
  {
    echo "server {"
    echo "    listen 80 default_server;"
    echo "    server_tokens off;"
    echo "    listen [::]:80 default_server;"
    echo "    server_name ${names};"
    echo "    location ^~ /.well-known/acme-challenge/ { root /var/www/letsencrypt; default_type text/plain; }"
    if has_cert; then
      echo "    location / { return 301 https://\$host\$request_uri; }"
      echo "}"
      echo "server {"
      echo "    listen 443 ssl default_server;"
      echo "    server_tokens off;"
      echo "    listen [::]:443 ssl default_server;"
      echo "    http2 on;"
      echo "    server_name ${names};"
      echo "    ssl_certificate ${LIVE}/fullchain.pem;"
      echo "    ssl_certificate_key ${LIVE}/privkey.pem;"
      echo "    ssl_protocols TLSv1.2 TLSv1.3;"
      echo "    ssl_prefer_server_ciphers off;"
      echo "    ssl_session_cache shared:TPVSSL:10m;"
      echo "    ssl_session_timeout 1d;"
      echo "    add_header Strict-Transport-Security \"max-age=31536000\" always;"
    fi
    echo "    include snippets/${APP_NAME}-app.conf;"
    echo "}"
  } > "$SITE.new"
  mv "$SITE.new" "$SITE"
  ln -sf "$SITE" "/etc/nginx/sites-enabled/${APP_NAME}"
  rm -f /etc/nginx/sites-enabled/default
  if nginx -t -q; then
    systemctl reload nginx 2>/dev/null || systemctl restart nginx
    log "nginx applied ($(has_cert && echo 'HTTPS + HTTP->HTTPS redirect' || echo 'HTTP only'))"
  else
    log "ERROR: nginx config test failed"; return 1
  fi
}

obtain() {
  [[ -n "$DOMAIN" ]] || { log "No DOMAIN configured - serving HTTP only."; return 0; }
  local ip; ip="$(public_ip)"
  local want=(-d "$DOMAIN")
  resolves_here "www.$DOMAIN" "$ip" && want+=(-d "www.$DOMAIN")

  if has_cert; then
    # Expand the certificate if www started resolving after the first issue
    if [[ ${#want[@]} -eq 4 ]] && ! openssl x509 -in "$LIVE/cert.pem" -noout -text 2>/dev/null | grep -q "DNS:www.$DOMAIN"; then
      log "Adding www.$DOMAIN to the certificate"
    else
      return 0
    fi
  elif ! resolves_here "$DOMAIN" "$ip"; then
    log "DNS for $DOMAIN does not point to this server (${ip:-unknown IP}) yet - will retry automatically."
    return 0
  fi

  local mail=(--register-unsafely-without-email)
  [[ -n "$EMAIL" ]] && mail=(-m "$EMAIL")
  if certbot certonly --webroot -w /var/www/letsencrypt --cert-name "$DOMAIN" --expand \
       --non-interactive --agree-tos --keep-until-expiring "${mail[@]}" "${want[@]}"; then
    log "Certificate issued for: ${want[*]}"
    render_nginx
  else
    log "Certificate request failed - will retry automatically."
    return 1
  fi
}

renew() { certbot renew --quiet --no-random-sleep-on-renew; }

case "${1:-auto}" in
  auto)   obtain; renew ;;
  obtain) obtain ;;
  renew)  renew ;;
  nginx)  render_nginx ;;
  test)   certbot renew --dry-run --no-random-sleep-on-renew --cert-name "$DOMAIN" ;;
  status) certbot certificates; systemctl list-timers 'tpv-ssl*' 'certbot*' --no-pager ;;
  *) echo "Usage: tpv-ssl [auto|obtain|renew|nginx|test|status]"; exit 2 ;;
esac
SSL_EOF
sed -i "s#__APP_NAME__#${APP_NAME}#" /usr/local/bin/tpv-ssl
chmod 755 /usr/local/bin/tpv-ssl

# Reload nginx after every successful renewal so the new certificate is served
cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'EOF'
#!/bin/sh
nginx -t -q && systemctl reload nginx
EOF
chmod 755 /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# Timer: twice a day — issues the certificate once DNS is live, then renews it
cat > /etc/systemd/system/tpv-ssl.service <<'EOF'
[Unit]
Description=Tyre Puncture Vaccine - obtain/renew SSL certificate
After=network-online.target nginx.service
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/tpv-ssl auto
EOF
cat > /etc/systemd/system/tpv-ssl.timer <<'EOF'
[Unit]
Description=Run tpv-ssl twice daily (certificate issue + auto-renewal)

[Timer]
OnBootSec=5min
OnCalendar=*-*-* 03,15:17:00
RandomizedDelaySec=30min
Persistent=true

[Install]
WantedBy=timers.target
EOF
systemctl daemon-reload
systemctl enable --now tpv-ssl.timer >/dev/null
systemctl enable --now certbot.timer >/dev/null 2>&1 || true   # Debian's own renew timer, as a backup

chmod o+x "$APP_DIR" "$APP_DIR/backend"
chmod -R o+rX "$APP_DIR/backend/media"
systemctl enable nginx >/dev/null
systemctl start nginx
/usr/local/bin/tpv-ssl nginx
ok "Nginx configured; auto-SSL timer enabled"

# --------------------------- 7. HTTPS ----------------------------------------
PUBLIC_IP="$(curl -fsS -4 --max-time 5 https://api.ipify.org || true)"
HTTPS_READY=false
if [[ -n "$DOMAIN" ]]; then
  step "Obtaining SSL certificate for ${DOMAIN}"
  /usr/local/bin/tpv-ssl obtain || true
  if [[ -s "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
    HTTPS_READY=true
    ok "HTTPS active (HTTP redirects to HTTPS)"
    if /usr/local/bin/tpv-ssl test >/dev/null 2>&1; then
      ok "Auto-renewal dry-run passed"
    else
      warn "Renewal dry-run failed - check with: tpv-ssl test"
    fi
  else
    warn "No certificate yet. Point A records for ${DOMAIN} and www.${DOMAIN} to ${PUBLIC_IP:-this server}."
    warn "The tpv-ssl timer will issue it automatically once DNS is live (or run: tpv-ssl obtain)."
  fi
fi

# --------------------------- 8. Health check ---------------------------------
step "Health check"
for i in {1..15}; do
  if curl -fsS "http://127.0.0.1/api/health" >/dev/null; then break; fi
  sleep 1
done
curl -fsS "http://127.0.0.1/api/health" >/dev/null && ok "API healthy through Nginx" \
  || die "API not responding. Check: journalctl -u ${APP_NAME}-api -n 50"
curl -fsS -o /dev/null "http://127.0.0.1/" && ok "Website responding"

trap - ERR
date -u +%FT%TZ > "$INSTALLED_MARK"   # last successful deploy
echo -e "\n${c_ok}==================== Deployment complete ====================${c_off}"
if $HTTPS_READY; then
  echo "  Website : https://${DOMAIN}/"
else
  echo "  Website : http://${PUBLIC_IP:-<server-ip>}/  ${DOMAIN:+(HTTPS turns on automatically once ${DOMAIN} points here)}"
fi
echo "  Admin   : /admin/login"
echo "  Login   : cat ${CREDS_FILE}$($SHOW_CREDS && echo '   (new admin password generated)')"
echo "  Logs    : journalctl -u ${APP_NAME}-api -f"
echo "  SSL     : tpv-ssl status | tpv-ssl obtain | tpv-ssl renew | tpv-ssl test"
echo "  Update  : upload new code to ${SRC_DIR} and run 'sudo bash deploy.sh' again"
echo -e "${c_ok}=============================================================${c_off}"
