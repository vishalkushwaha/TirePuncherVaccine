import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

def resolve_database_url() -> str:
    # 1. Check environment variable DATABASE_URL
    custom_url = os.getenv("DATABASE_URL")
    if not custom_url:
        env_path = BASE_DIR / ".env"
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith("DATABASE_URL="):
                    custom_url = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break

    if custom_url:
        if custom_url.startswith("postgresql://"):
            return custom_url.replace("postgresql://", "postgresql+psycopg://", 1)
        return custom_url
    
    # 2. Fallback to local PostgreSQL instance on 5433
    return "postgresql+psycopg://postgres@127.0.0.1:5433/postgres"


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tyre Puncture Vaccine API & CMS (PostgreSQL)"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "tpv-super-secret-jwt-key-ujjala-bikaner-2026-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # PostgreSQL Database URL
    DATABASE_URL: str = resolve_database_url()
    
    # Static & Media directories
    MEDIA_DIR: Path = BASE_DIR / "media"
    ROOT_ASSETS_DIR: Path = BASE_DIR.parent
    
    # Owner & Notification Email
    OWNER_EMAIL: str = "ujjalaelectricalsbkn@gmail.com"
    OWNER_PHONE: str = "+91 74130 59364"
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
os.makedirs(settings.MEDIA_DIR, exist_ok=True)
