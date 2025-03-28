import os
from pathlib import Path
from pydantic import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "PDF Manager"
    
    # Database - with SQLite fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./pdf_manager.db"
    )
    
    # Security - simple for development
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development_key_for_testing")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Storage
    STORAGE_BUCKET: str = os.getenv("STORAGE_BUCKET", "pdf-classroom-manager")
    
    # Make sure the upload directory is an absolute path
    UPLOAD_DIR: Path = Path(os.path.join(os.getcwd(), "uploads")).resolve()
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

def get_settings():
    return Settings()

settings = get_settings()