from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Test API is working"}

@app.get("/api/pdfs")
def get_pdfs():
    # Adjust this structure to match what your frontend expects
    return [
        {
            "id": 1, 
            "filename": "Test PDF 1.pdf", 
            "size": 12345,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "tags": [],
            "folder_id": 1,
            "folder_name": "Test Folder"
        },
        {
            "id": 2, 
            "filename": "Test PDF 2.pdf", 
            "size": 67890,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "tags": [],
            "folder_id": None,
            "folder_name": None
        }
    ]

@app.get("/api/folders")
def get_folders():
    # Adjust this structure to match what your frontend expects
    return {
        "folders": [
            {"id": 1, "name": "Test Folder"},
            {"id": 2, "name": "Another Folder"}
        ],
        "unfiled_count": 1
    }

@app.get("/api/tags")
def get_tags():
    return [
        {"id": 1, "name": "Important"},
        {"id": 2, "name": "Homework"}
    ]

@app.get("/ping")
def ping():
    return {"status": "ok", "message": "Test API server is running"}

if __name__ == "__main__":
    import uvicorn
    print("Starting test server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)