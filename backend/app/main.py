from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import shutil
from typing import List, Optional
from sqlalchemy.orm import Session

# Import database and models
from app.database import engine, get_db
from app.models import Base, PDF, Tag

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PDF Classroom Manager")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Create storage directory if it doesn't exist
os.makedirs("storage", exist_ok=True)

# Mount the storage directory to serve files directly
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

@app.post("/api/pdfs/")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Save file
    os.makedirs("storage", exist_ok=True)
    file_path = f"storage/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Generate mock tags (in a real app, this would use AI)
    mock_tags = ["worksheet", "classroom"]
    if "math" in file.filename.lower():
        mock_tags.append("math")
    elif "science" in file.filename.lower():
        mock_tags.append("science")
    elif "history" in file.filename.lower():
        mock_tags.append("history")
    elif "english" in file.filename.lower():
        mock_tags.append("english")
    
    # Create PDF record in database
    db_pdf = PDF(filename=file.filename, path=file_path)
    db.add(db_pdf)
    db.commit()
    db.refresh(db_pdf)
    
    # Add tags
    for tag_name in mock_tags:
        # Check if tag already exists
        db_tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not db_tag:
            # Create new tag
            db_tag = Tag(name=tag_name)
            db.add(db_tag)
            db.commit()
            db.refresh(db_tag)
        
        # Add tag to PDF
        db_pdf.tags.append(db_tag)
    
    db.commit()
    
    # Return PDF data
    return {
        "id": db_pdf.id,
        "filename": db_pdf.filename,
        "path": db_pdf.path,
        "tags": [tag.name for tag in db_pdf.tags],
        "created_at": db_pdf.created_at.isoformat()
    }

@app.get("/api/pdfs/")
async def get_pdfs(search: Optional[str] = None, db: Session = Depends(get_db)):
    # Base query
    query = db.query(PDF)
    
    # Apply search filter if provided
    if search:
        search = search.lower()
        query = query.filter(
            PDF.filename.ilike(f"%{search}%") | 
            PDF.tags.any(Tag.name.ilike(f"%{search}%"))
        )
    
    # Execute query and get results
    db_pdfs = query.all()
    
    # Format results
    results = []
    for pdf in db_pdfs:
        results.append({
            "id": pdf.id,
            "filename": pdf.filename,
            "path": pdf.path,
            "tags": [tag.name for tag in pdf.tags],
            "created_at": pdf.created_at.isoformat()
        })
    
    return results

@app.get("/api/pdfs/{pdf_id}")
async def get_pdf(pdf_id: int, db: Session = Depends(get_db)):
    db_pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not db_pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    return {
        "id": db_pdf.id,
        "filename": db_pdf.filename,
        "path": db_pdf.path,
        "tags": [tag.name for tag in db_pdf.tags],
        "created_at": db_pdf.created_at.isoformat()
    }

@app.put("/api/pdfs/{pdf_id}")
async def update_pdf(
    pdf_id: int, 
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    # Find the PDF
    db_pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not db_pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Update filename if provided
    if "filename" in data and data["filename"]:
        # Update the file path too
        old_path = db_pdf.path
        new_path = f"storage/{data['filename']}"
        
        # Rename the actual file
        if os.path.exists(old_path):
            os.rename(old_path, new_path)
            db_pdf.path = new_path
        
        db_pdf.filename = data["filename"]
    
    # Update tags if provided
    if "tags" in data and isinstance(data["tags"], list):
        # Clear existing tags
        db_pdf.tags = []
        
        # Add new tags
        for tag_name in data["tags"]:
            # Check if tag already exists
            db_tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not db_tag:
                # Create new tag
                db_tag = Tag(name=tag_name)
                db.add(db_tag)
                db.commit()
                db.refresh(db_tag)
            
            # Add tag to PDF
            db_pdf.tags.append(db_tag)
    
    # Commit changes
    db.commit()
    db.refresh(db_pdf)
    
    # Return updated PDF
    return {
        "id": db_pdf.id,
        "filename": db_pdf.filename,
        "path": db_pdf.path,
        "tags": [tag.name for tag in db_pdf.tags],
        "created_at": db_pdf.created_at.isoformat()
    }

@app.post("/api/pdfs/batch")
async def batch_operation(
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    # Extract parameters
    operation = data.get("operation")
    pdf_ids = data.get("pdf_ids", [])
    tags = data.get("tags", [])
    
    # Validate operation
    valid_operations = ["delete", "add_tags", "remove_tags"]
    if operation not in valid_operations:
        raise HTTPException(status_code=400, detail=f"Invalid operation. Must be one of: {valid_operations}")
    
    # Find all PDFs
    db_pdfs = db.query(PDF).filter(PDF.id.in_(pdf_ids)).all()
    if not db_pdfs:
        raise HTTPException(status_code=404, detail="No PDFs found with the provided IDs")
    
    results = []
    
    # Perform operation
    if operation == "delete":
        for pdf in db_pdfs:
            # Delete file from storage
            if os.path.exists(pdf.path):
                os.remove(pdf.path)
            
            # Delete from database
            db.delete(pdf)
            results.append({"id": pdf.id, "status": "deleted"})
        
    elif operation == "add_tags" and tags:
        for pdf in db_pdfs:
            for tag_name in tags:
                # Check if tag already exists
                db_tag = db.query(Tag).filter(Tag.name == tag_name).first()
                if not db_tag:
                    # Create new tag
                    db_tag = Tag(name=tag_name)
                    db.add(db_tag)
                    db.commit()
                    db.refresh(db_tag)
                
                # Add tag if not already present
                if db_tag not in pdf.tags:
                    pdf.tags.append(db_tag)
            
            results.append({
                "id": pdf.id,
                "filename": pdf.filename,
                "tags": [tag.name for tag in pdf.tags]
            })
            
    elif operation == "remove_tags" and tags:
        for pdf in db_pdfs:
            for tag_name in tags:
                # Find tag
                db_tag = db.query(Tag).filter(Tag.name == tag_name).first()
                if db_tag and db_tag in pdf.tags:
                    pdf.tags.remove(db_tag)
            
            results.append({
                "id": pdf.id,
                "filename": pdf.filename,
                "tags": [tag.name for tag in pdf.tags]
            })
    
    # Commit changes
    db.commit()
    
    return {"operation": operation, "results": results}

@app.get("/api/pdfs/{pdf_id}/download")
async def download_pdf(pdf_id: int, db: Session = Depends(get_db)):
    db_pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not db_pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Return the file as a downloadable response
    return FileResponse(
        path=db_pdf.path,
        filename=db_pdf.filename,
        media_type="application/pdf"
    )

@app.get("/api/pdfs/{pdf_id}/view")
async def view_pdf(pdf_id: int, db: Session = Depends(get_db)):
    db_pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not db_pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Return the file for viewing with proper headers
    return FileResponse(
        path=db_pdf.path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=\"{db_pdf.filename}\"",
            "Access-Control-Allow-Origin": "*"
        }
    )