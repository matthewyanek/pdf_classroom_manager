# app/core/config.py
import os
from pathlib import Path
from pydantic import BaseSettings, PostgresDsn, SecretStr

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "PDF Manager"
    
    # Database - with SQLite fallback if PostgreSQL isn't configured
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./pdf_manager.db"
    )
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_fallback_secret_key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Storage
    STORAGE_BUCKET: str = os.getenv("STORAGE_BUCKET", "pdf-classroom-manager")
    
    # File storage - local path
    UPLOAD_DIR: Path = Path("../uploads").resolve()
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

def get_settings():
    return Settings()

settings = get_settings()