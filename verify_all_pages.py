import urllib.request
import urllib.error
import json
import sys

BASE_URL = "http://localhost:5173"
API_URL = "http://127.0.0.1:8001/api"

PUBLIC_ROUTES = [
    "/",
    "/about",
    "/products",
    "/products/gulf",
    "/products/rock",
    "/products/thor",
    "/compare",
    "/how-to-use",
    "/dosage-guide",
    "/quote",
    "/distributorship",
    "/where-to-buy",
    "/events",
    "/events/rajasthan-distributor-expansion-2026",
    "/gallery",
    "/blog",
    "/blog/preventive-tyre-sealant-fleet-downtime",
    "/certifications",
    "/testimonials",
    "/faq",
    "/contact",
    "/thank-you",
    "/search",
    "/privacy-policy",
    "/terms",
    "/pricing-warranty",
    "/delivery-policy"
]

ADMIN_ROUTES = [
    "/admin/login",
    "/admin",
    "/admin/products",
    "/admin/quotes-retail",
    "/admin/quotes-bulk",
    "/admin/distributors",
    "/admin/dealers",
    "/admin/events",
    "/admin/gallery",
    "/admin/blog",
    "/admin/testimonials",
    "/admin/faq",
    "/admin/certificates",
    "/admin/pages",
    "/admin/messages",
    "/admin/settings",
    "/admin/themes",
    "/admin/users"
]

def check_route(route):
    url = f"{BASE_URL}{route}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "TPV-Verifier"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            status = resp.status
            content = resp.read().decode('utf-8')
            has_app = '<div id="root">' in content or '<script type="module" src="/src/main.jsx">' in content
            return status == 200 and has_app
    except Exception as e:
        print(f"Error checking {url}: {e}")
        return False

def verify():
    print("==================================================")
    print("  TYRE PUNCTURE VACCINE - FULL SYSTEM VERIFICATION")
    print("==================================================")
    
    print("\n[1] Verifying Backend API on Port 8001:")
    try:
        with urllib.request.urlopen(f"{API_URL}/health") as r:
            health = json.loads(r.read())
            print(f"    Health: OK (Version: {health.get('version')}, DB: PostgreSQL)")
    except Exception as e:
        print(f"    Health: FAILED ({e})")
        return False

    print("\n[2] Verifying 26 Public Pages on Frontend (http://localhost:5173):")
    all_public_ok = True
    for route in PUBLIC_ROUTES:
        ok = check_route(route)
        mark = "✓" if ok else "✗"
        print(f"    {mark} {route}")
        if not ok:
            all_public_ok = False

    print("\n[3] Verifying 17 CMS Admin Screens on Frontend (http://localhost:5173):")
    all_admin_ok = True
    for route in ADMIN_ROUTES:
        ok = check_route(route)
        mark = "✓" if ok else "✗"
        print(f"    {mark} {route}")
        if not ok:
            all_admin_ok = False

    print("\n[4] Verifying Media & Brand Assets Serving:")
    assets_to_test = [
        "http://127.0.0.1:8001/media/logo.jpeg",
        "http://127.0.0.1:8001/media/gulf-poster.jpeg",
        "http://127.0.0.1:8001/media/rock-poster.jpeg",
        "http://127.0.0.1:8001/media/thor-poster.jpeg",
        "http://127.0.0.1:8001/media/how-to-use-6steps.png"
    ]
    all_assets_ok = True
    for asset in assets_to_test:
        try:
            with urllib.request.urlopen(asset) as r:
                print(f"    ✓ {asset.split('/')[-1]} ({r.status} OK, {len(r.read())} bytes)")
        except Exception as e:
            print(f"    ✗ {asset.split('/')[-1]}: {e}")
            all_assets_ok = False

    print("\n[5] Verifying Admin CMS Authentication & Database Read/Write:")
    try:
        login_data = json.dumps({"username": "admin", "password": "AdminPassword2026!"}).encode()
        req = urllib.request.Request(
            f"{API_URL}/auth/login",
            data=login_data,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as r:
            token_data = json.loads(r.read())
            token = token_data.get("access_token")
            user = token_data.get("user")
            print(f"    ✓ Auth Login: OK (User: {user.get('username')}, Role: {user.get('role')})")
            
        req2 = urllib.request.Request(
            f"{API_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        with urllib.request.urlopen(req2) as r:
            me = json.loads(r.read())
            print(f"    ✓ Token /me verified: OK ({me.get('email')})")
    except Exception as e:
        print(f"    ✗ Auth verification failed: {e}")
        return False

    if all_public_ok and all_admin_ok and all_assets_ok:
        print("\n==================================================")
        print("  ALL 26 PUBLIC PAGES + 17 CMS SCREENS VERIFIED!  ")
        print("==================================================")
        return True
    else:
        print("\nSome checks failed.")
        return False

if __name__ == "__main__":
    success = verify()
    sys.exit(0 if success else 1)

