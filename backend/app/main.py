# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.database import create_tables, engine
from app.api.router import api_router

# Create the FastAPI app
app = FastAPI(title="PDF Manager API")

# Configure CORS - Using the same config that worked in our test server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, use ["http://localhost:3000"] for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
print(f"Upload directory: {settings.UPLOAD_DIR}")

# Mount static files
uploads_dir = str(settings.UPLOAD_DIR)
print(f"Mounting uploads directory: {uploads_dir}")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Create tables
create_tables()

@app.get("/")
def read_root():
    return {"message": "PDF Manager API"}

# Debug endpoint to check connectivity
@app.get("/ping")
def ping():
    return {"status": "ok", "message": "API server is running"}

if __name__ == "__main__":
    import uvicorn
    print(f"Starting FastAPI server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)