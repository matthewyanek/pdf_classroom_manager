from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

from app.core.config import settings

# Get database URL
db_url = settings.DATABASE_URL
print(f"Using database URL: {db_url}")

# Create engine with appropriate settings
if db_url.startswith("sqlite"):
    # SQLite-specific settings
    db_path = db_url.replace("sqlite:///", "")
    # Make sure the directory exists for the SQLite file
    db_dir = os.path.dirname(os.path.abspath(db_path))
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)
    engine = create_engine(
        db_url, 
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL or other database engines
    engine = create_engine(db_url)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create all tables
def create_tables():
    print(f"Creating tables with database: {db_url}")
    Base.metadata.create_all(bind=engine)
    print("Database tables created")