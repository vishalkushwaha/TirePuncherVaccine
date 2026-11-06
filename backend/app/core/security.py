from datetime import datetime, timedelta, timezone
from typing import Optional, Any, Union
import jwt
import bcrypt
from app.core.config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_BYTES = 72  # bcrypt ignores anything beyond 72 bytes


def password_policy_error(password: str) -> Optional[str]:
    """Return a user-facing error if the password breaks the policy, else None."""
    if len(password) < PASSWORD_MIN_LENGTH:
        return f"New password must be at least {PASSWORD_MIN_LENGTH} characters"
    if len(password.encode("utf-8")) > PASSWORD_MAX_BYTES:
        return f"New password must be at most {PASSWORD_MAX_BYTES} characters"
    return None


def get_password_hash(password: str) -> str:
    # Truncate to 72 bytes for bcrypt safety
    pw_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode('utf-8')

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return decoded
    except jwt.PyJWTError:
        return None
