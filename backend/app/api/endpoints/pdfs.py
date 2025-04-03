# app/api/endpoints/pdfs.py
from fastapi import APIRouter, Depends, HTTPException, File, Form, Body, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Dict, Any, List, Optional
from datetime import datetime
import os
import traceback
from pathlib import Path

from app.core.database import get_db, engine
from app.core.config import settings
from app.models.pdf import PDF
from app.models.folder import Folder
from app.models.tag import Tag
from app.schemas.pdf import PDFCreate, PDFUpdate, PDF as PDFSchema, PDFBulkOperation

router = APIRouter()

@router.get("/")
async def get_pdfs(
    search: Optional[str] = None, 
    folder_id: Optional[str] = None,
    tag: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get PDFs with optional filtering:
    - folder_id: Get PDFs in a specific folder (use -1 for unfiled)
    - search: Search PDFs by filename
    - tag: Filter PDFs by tag
    """
    print(f"Request for PDFs with folder_id: {folder_id}, search: {search}, tag: {tag}")
    
    # Convert folder_id to the right type
    parsed_folder_id = None
    use_unfiled_filter = False
    if folder_id is not None:
        # Check for unfiled filter
        if folder_id == "-1":
            use_unfiled_filter = True
            print("Using unfiled filter")
        # Check for numeric folder ID
        elif folder_id.isdigit():
            parsed_folder_id = int(folder_id)
            print(f"Using folder filter with ID: {parsed_folder_id}")
        else:
            print(f"Invalid folder_id format: {folder_id}")
    
    # Start with a base query
    query = db.query(PDF)
    
    # 1. Apply folder filtering first
    if use_unfiled_filter:
        # Only show PDFs that have NULL folder_id
        print("Filtering for unfiled PDFs only")
        query = query.filter(PDF.folder_id.is_(None))
    elif parsed_folder_id is not None:
        # Only show PDFs that have this specific folder_id
        print(f"Filtering for folder_id: {parsed_folder_id}")
        query = query.filter(PDF.folder_id == parsed_folder_id)
    
    # Debug the query at this point
    folder_filtered_count = query.count()
    print(f"After folder filtering: {folder_filtered_count} PDFs")
    
    # 2. Apply search filter if provided
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        print(f"Filtering by search term: {search_term}")
        query = query.filter(
            or_(
                PDF.filename.ilike(search_term),
                PDF.tags.ilike(search_term)
            )
        )
    
    # 3. Apply tag filter if provided
    if tag and tag.strip():
        print(f"Filtering by tag: {tag}")
        tag_pattern = f"%{tag.strip()}%"
        query = query.filter(PDF.tags.ilike(tag_pattern))
    
    # Execute the query and order by creation date
    pdfs = query.order_by(PDF.created_at.desc()).all()
    
    # Debug the final results
    print(f"Final filtered PDFs count: {len(pdfs)}")
    
    # Format the response
    result = []
    for pdf in pdfs:
        folder_name = None
        if pdf.folder_id:
            folder = db.query(Folder).filter(Folder.id == pdf.folder_id).first()
            folder_name = folder.name if folder else None
        
        # Handle tags properly
        tags_list = []
        if pdf.tags and pdf.tags.strip():
            tags_list = [tag.strip() for tag in pdf.tags.split(",") if tag.strip()]
            
        # This whole file size calculation block should be INSIDE the for loop
        file_size = 0  # Default to 0 instead of None
        try:
            # Get the actual file path
            file_path = pdf.path
            if file_path.startswith("uploads/"):
                # Get just the filename
                filename = os.path.basename(pdf.path)
                # Look in the uploads directory
                file_path = os.path.join(settings.UPLOAD_DIR, filename)
            
            if os.path.exists(file_path):
                file_size = os.path.getsize(file_path)
            else:
                print(f"Warning: File not found at {file_path} for PDF {pdf.id}")
        except Exception as e:
            print(f"Error calculating file size for {pdf.filename}: {str(e)}")

        result.append({
            "id": pdf.id,
            "filename": pdf.filename,
            "path": pdf.path,
            "tags": tags_list,
            "folder_id": pdf.folder_id,
            "folder_name": folder_name,
            "created_at": pdf.created_at,
            "size": file_size  # Use calculated file size
        })
    
    return result  # THIS LINE WAS MISSING

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    tags: str = Form(""),
    folder_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Upload a new PDF file"""
    print(f"Received upload request for file: {file.filename} with tags: {tags}, folder_id: {folder_id}")
    
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            print(f"Invalid file type: {file.filename}")
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Create a unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        
        # Ensure upload directory exists
        upload_dir = settings.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, filename)
        
        print(f"Saving file to: {file_path}")
        
        # Save the file and calculate size
        file_size = 0
        try:
            with open(file_path, "wb") as buffer:
                # Read the file in chunks to handle large files
                chunk_size = 1024 * 1024  # 1MB chunks
                while True:
                    chunk = await file.read(chunk_size)
                    if not chunk:
                        break
                    buffer.write(chunk)
                    file_size += len(chunk)
            
            print(f"File saved successfully to {file_path} with size {file_size} bytes")
        except Exception as e:
            print(f"Error saving file: {str(e)}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
        
        # Create PDF record
        try:
            # Handle folder_id conversion
            parsed_folder_id = None
            if folder_id:
                if folder_id.isdigit():
                    parsed_folder_id = int(folder_id)
                    print(f"Converted folder_id from {folder_id} to {parsed_folder_id}")
            
            # Create the PDF record
            pdf = PDF(
                filename=file.filename,
                path=f"uploads/{filename}",
                tags=tags if tags else None,
                folder_id=parsed_folder_id,
                #size=file_size  # Store the file size
            )
            db.add(pdf)
            db.commit()
            db.refresh(pdf)
            
            print(f"PDF record created with ID: {pdf.id}")
            
            # Update tags table
            if tags:
                tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
                for tag_name in tag_list:
                    existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
                    if not existing_tag:
                        db.add(Tag(name=tag_name))
                db.commit()
                print(f"Tags updated: {tag_list}")
            
            # Get folder name if folder_id is provided
            folder_name = None
            if parsed_folder_id:
                folder = db.query(Folder).filter(Folder.id == parsed_folder_id).first()
                if folder:
                    folder_name = folder.name
            
            # Handle tags properly for response
            tags_list = []
            if tags and tags.strip():
                tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
            
            return {
                "id": pdf.id,
                "filename": pdf.filename,
                "path": pdf.path,
                "tags": tags_list,
                "folder_id": parsed_folder_id,
                "folder_name": folder_name,
                "created_at": pdf.created_at,
                "size": file_size  # Include size in the response
            }
        except Exception as e:
            print(f"Error creating database record: {str(e)}")
            print(traceback.format_exc())
            # If we saved the file but failed to create the DB record, clean up the file
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"Removed file {file_path} due to database error")
            raise HTTPException(status_code=500, detail=f"Error creating database record: {str(e)}")
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Catch any other exceptions
        print(f"Unexpected error during upload: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Unexpected error during upload: {str(e)}")


@router.get("/{pdf_id}")
async def get_pdf(pdf_id: int, db: Session = Depends(get_db)):
    """Get a specific PDF by ID"""
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    folder_name = None
    if pdf.folder_id:
        folder = db.query(Folder).filter(Folder.id == pdf.folder_id).first()
        folder_name = folder.name if folder else None
    
    # Handle tags properly
    tags_list = []
    if pdf.tags and pdf.tags.strip():
        tags_list = [tag.strip() for tag in pdf.tags.split(",") if tag.strip()]
    
    # Calculate file size
    file_size = None
    try:
        # Get the actual file path
        file_path = pdf.path
        if file_path.startswith("uploads/"):
            # Get just the filename
            filename = os.path.basename(pdf.path)
            # Look in the uploads directory
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
    except Exception as e:
        print(f"Error calculating file size for {pdf.filename}: {str(e)}")
    
    return {
        "id": pdf.id,
        "filename": pdf.filename,
        "path": pdf.path,
        "tags": tags_list,
        "folder_id": pdf.folder_id,
        "folder_name": folder_name,
        "created_at": pdf.created_at,
        "size": file_size  # Use calculated file size instead of pdf.size
    }

@router.put("/{pdf_id}/tags")
async def update_pdf_tags(pdf_id: int, data: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """Update tags for a PDF"""
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    tags = data.get("tags", [])
    
    # Convert list of tags to comma-separated string
    if isinstance(tags, list):
        tags_str = ",".join(tags)
    else:
        tags_str = tags
    
    pdf.tags = tags_str
    
    # Update tags table
    if tags:
        tag_list = tags if isinstance(tags, list) else [tag.strip() for tag in tags_str.split(',') if tag.strip()]
        for tag_name in tag_list:
            existing_tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not existing_tag:
                db.add(Tag(name=tag_name))
    
    db.commit()
    
    # Handle tags properly for response
    tags_list = []
    if isinstance(tags, list):
        tags_list = tags
    elif tags_str and tags_str.strip():
        tags_list = [tag.strip() for tag in tags_str.split(",") if tag.strip()]
    
    # Calculate file size
    file_size = None
    try:
        # Get the actual file path
        file_path = pdf.path
        if file_path.startswith("uploads/"):
            # Get just the filename
            filename = os.path.basename(pdf.path)
            # Look in the uploads directory
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
    except Exception as e:
        print(f"Error calculating file size for {pdf.filename}: {str(e)}")
    
    return {
        "id": pdf.id,
        "tags": tags_list,
        "size": file_size  # Use calculated file size instead of pdf.size
    }


@router.delete("/{pdf_id}")
async def delete_pdf(pdf_id: int, db: Session = Depends(get_db)):
    """Delete a single PDF file by ID"""
    print(f"Attempting to delete PDF with ID: {pdf_id}")
    
    # Find the PDF in the database
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        print(f"PDF with ID {pdf_id} not found in database")
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get the uploads directory
    uploads_dir = settings.UPLOAD_DIR
    
    # Get the physical file path
    file_name = os.path.basename(pdf.path)
    file_path = os.path.join(uploads_dir, file_name)
    
    print(f"Looking for file to delete at: {file_path}")
    
    # Try to delete the physical file
    file_deleted = False
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            print(f"Successfully deleted file: {file_path}")
            file_deleted = True
        except Exception as e:
            print(f"Error deleting file {file_path}: {str(e)}")
            # Continue even if file deletion fails
    else:
        print(f"File not found at {file_path}, will still delete database record")
    
    # Delete the database record
    try:
        db.delete(pdf)
        db.commit()
        print(f"Successfully deleted database record for PDF ID: {pdf_id}")
        
        return {
            "status": "success", 
            "id": pdf_id, 
            "file_deleted": file_deleted,
            "db_record_deleted": True
        }
    except Exception as e:
        db.rollback()
        print(f"Error deleting database record: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting PDF: {str(e)}")

@router.post("/delete")
async def delete_pdfs(data: PDFBulkOperation, db: Session = Depends(get_db)):
    """Delete multiple PDFs by IDs"""
    pdf_ids = data.pdf_ids
    if not pdf_ids:
        raise HTTPException(status_code=400, detail="No PDFs specified")
    
    print(f"Attempting to delete PDFs with IDs: {pdf_ids}")
    
    # Get the uploads directory
    uploads_dir = settings.UPLOAD_DIR
    
    # Track results
    deleted_files = []
    failed_files = []
    
    # Get PDFs to delete
    pdfs = db.query(PDF).filter(PDF.id.in_(pdf_ids)).all()
    if not pdfs:
        print("No PDFs found with the specified IDs")
        return {"status": "success", "deleted_count": 0, "message": "No PDFs found with the specified IDs"}
    
    # Process each PDF
    for pdf in pdfs:
        # Get the physical file path
        file_name = os.path.basename(pdf.path)
        file_path = os.path.join(uploads_dir, file_name)
        
        print(f"Looking for file to delete at: {file_path}")
        
        # Try to delete the physical file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                deleted_files.append(file_path)
                print(f"Successfully deleted file: {file_path}")
            except Exception as e:
                failed_files.append({"path": file_path, "error": str(e)})
                print(f"Error deleting file {file_path}: {str(e)}")
                # Continue even if file deletion fails
        else:
            print(f"File not found at {file_path}, will still delete database record")
    
    # Delete all database records in a single transaction
    try:
        db.query(PDF).filter(PDF.id.in_(pdf_ids)).delete(synchronize_session=False)
        db.commit()
        print(f"Successfully deleted {len(pdf_ids)} database records")
        
        return {
            "status": "success", 
            "deleted_count": len(pdf_ids),
            "files_deleted": len(deleted_files),
            "files_failed": len(failed_files)
        }
    except Exception as e:
        db.rollback()
        print(f"Error deleting database records: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting PDFs: {str(e)}")

@router.post("/move")
async def move_pdfs_to_folder(data: PDFBulkOperation, db: Session = Depends(get_db)):
    """Move multiple PDFs to a folder"""
    pdf_ids = data.pdf_ids
    folder_id = data.folder_id  # Can be None to move to "unfiled"
    
    print(f"Moving PDFs {pdf_ids} to folder_id: {folder_id}")
    
    if not pdf_ids:
        raise HTTPException(status_code=400, detail="No PDFs specified")
    
    # If folder_id is provided, verify it exists
    if folder_id is not None:
        folder = db.query(Folder).filter(Folder.id == folder_id).first()
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
    
    # Update PDFs
    db.query(PDF).filter(PDF.id.in_(pdf_ids)).update({"folder_id": folder_id})
    db.commit()
    
    # Verify the update
    updated_pdfs = db.query(PDF).filter(PDF.id.in_(pdf_ids)).all()
    for pdf in updated_pdfs:
        print(f"PDF {pdf.id} now has folder_id: {pdf.folder_id}")
    
    return {"status": "success", "moved_count": len(pdf_ids)}

@router.get("/unfiled-count")
async def get_unfiled_count(db: Session = Depends(get_db)):
    """Get count of PDFs not in any folder"""
    count = db.query(PDF).filter(PDF.folder_id.is_(None)).count()
    return {"count": count}

@router.get("/{pdf_id}/view")
async def view_pdf(pdf_id: int, db: Session = Depends(get_db)):
    """View a PDF file directly"""
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get the uploads directory
    uploads_dir = settings.UPLOAD_DIR
    
    # Get the actual file path
    file_path = pdf.path
    if file_path.startswith("uploads/"):
        # Get just the filename
        filename = os.path.basename(pdf.path)
        # Look in the uploads directory
        file_path = os.path.join(uploads_dir, filename)
    
    print(f"Attempting to serve PDF from: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        # Try alternative path
        alt_path = os.path.join(uploads_dir, os.path.basename(pdf.path))
        print(f"File not found at {file_path}. Trying alternative path: {alt_path}")
        
        if os.path.exists(alt_path):
            file_path = alt_path
        else:
            raise HTTPException(status_code=404, detail=f"PDF file not found on server at {file_path} or {alt_path}")
    
    return FileResponse(
        path=file_path, 
        media_type="application/pdf",
        filename=pdf.filename
    )

@router.get("/{pdf_id}/download")
async def download_pdf(pdf_id: int, db: Session = Depends(get_db)):
    """Download a PDF file"""
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get the uploads directory
    uploads_dir = settings.UPLOAD_DIR
    
    # Get the actual file path
    file_path = pdf.path
    if file_path.startswith("uploads/"):
        # Get just the filename
        filename = os.path.basename(pdf.path)
        # Look in the uploads directory
        file_path = os.path.join(uploads_dir, filename)
    
    print(f"Attempting to download PDF from: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        # Try alternative path
        alt_path = os.path.join(uploads_dir, os.path.basename(pdf.path))
        print(f"File not found at {file_path}. Trying alternative path: {alt_path}")
        
        if os.path.exists(alt_path):
            file_path = alt_path
        else:
            raise HTTPException(status_code=404, detail=f"PDF file not found on server at {file_path} or {alt_path}")
    
    return FileResponse(
        path=file_path, 
        media_type="application/pdf",
        filename=pdf.filename,
        headers={"Content-Disposition": f"attachment; filename={pdf.filename}"}
    )

@router.put("/{pdf_id}/rename")
async def rename_pdf(
    pdf_id: int, 
    data: Dict[str, Any] = Body(...), 
    db: Session = Depends(get_db)
):
    """Rename a PDF file"""
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    new_filename = data.get("filename")
    if not new_filename:
        raise HTTPException(status_code=400, detail="New filename is required")
    
    # Ensure the filename ends with .pdf
    if not new_filename.lower().endswith('.pdf'):
        new_filename += '.pdf'
    
    # Update the filename in the database
    pdf.filename = new_filename
    db.commit()
    
    # Calculate file size
    file_size = 0
    try:
        # Get the actual file path
        file_path = pdf.path
        if file_path.startswith("uploads/"):
            # Get just the filename
            filename = os.path.basename(pdf.path)
            # Look in the uploads directory
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
    except Exception as e:
        print(f"Error calculating file size for {pdf.filename}: {str(e)}")
    
    # Get folder name
    folder_name = None
    if pdf.folder_id:
        folder = db.query(Folder).filter(Folder.id == pdf.folder_id).first()
        folder_name = folder.name if folder else None
    
    # Handle tags properly
    tags_list = []
    if pdf.tags and pdf.tags.strip():
        tags_list = [tag.strip() for tag in pdf.tags.split(",") if tag.strip()]
    
    return {
        "id": pdf.id,
        "filename": pdf.filename,
        "path": pdf.path,
        "tags": tags_list,
        "folder_id": pdf.folder_id,
        "folder_name": folder_name,
        "created_at": pdf.created_at,
        "size": file_size
    }