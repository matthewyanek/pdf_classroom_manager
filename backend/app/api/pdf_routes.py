# pdf_routes.py

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
import os
import mimetypes
from typing import List, Optional
import logging
import io

# Import your database models and dependencies
# from database import get_db, PDF
# from auth import get_current_user

router = APIRouter(prefix="/api/pdfs", tags=["pdfs"])

# Configure logging
logger = logging.getLogger(__name__)

# Helper function to find a PDF file
def find_pdf_file(pdf_id: int) -> Optional[str]:
    """
    Try multiple locations to find a PDF file
    """
    # Get upload directory from environment or use a default
    upload_dir = os.environ.get("UPLOAD_DIR", "/app/uploads")
    
    # List of possible file paths to check
    possible_paths = [
        os.path.join(upload_dir, "pdfs", f"{pdf_id}.pdf"),
        os.path.join(upload_dir, "pdf", f"{pdf_id}.pdf"),
        os.path.join(upload_dir, f"{pdf_id}.pdf"),
        os.path.join("/app/media/pdfs", f"{pdf_id}.pdf"),
        os.path.join("/app/static/pdfs", f"{pdf_id}.pdf"),
    ]
    
    # Try database lookup first (commented out - uncomment and modify for your DB)
    """
    db = next(get_db())
    pdf_record = db.query(PDF).filter(PDF.id == pdf_id).first()
    if pdf_record and pdf_record.file_path:
        custom_path = os.path.join(upload_dir, pdf_record.file_path)
        possible_paths.insert(0, custom_path)
    """
    
    # Check each path
    for path in possible_paths:
        if os.path.exists(path) and os.path.isfile(path):
            logger.info(f"Found PDF {pdf_id} at path: {path}")
            return path
    
    logger.warning(f"PDF {pdf_id} not found in any of the expected locations")
    return None

# View PDF endpoint - UPDATED for better browser compatibility
@router.get("/{pdf_id}/view")
async def view_pdf(pdf_id: int, request: Request):
    """
    View a PDF file in the browser
    """
    logger.info(f"View request for PDF {pdf_id}")
    
    pdf_path = find_pdf_file(pdf_id)
    if not pdf_path:
        logger.error(f"PDF {pdf_id} not found for viewing")
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get filename from path
    filename = os.path.basename(pdf_path)
    
    logger.info(f"Serving PDF {pdf_id} for viewing from {pdf_path}")
    
    # Use more explicit headers to ensure browser displays the PDF
    return FileResponse(
        path=pdf_path, 
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=\"{filename}\"",
            "Content-Type": "application/pdf"
        }
    )

# Alternative approach using StreamingResponse for viewing PDFs
@router.get("/{pdf_id}/view2")
async def view_pdf_streaming(pdf_id: int, request: Request):
    """
    Alternative method to view a PDF file in the browser using streaming
    """
    logger.info(f"Streaming view request for PDF {pdf_id}")
    
    pdf_path = find_pdf_file(pdf_id)
    if not pdf_path:
        logger.error(f"PDF {pdf_id} not found for streaming view")
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get filename from path
    filename = os.path.basename(pdf_path)
    
    # Read the file
    try:
        with open(pdf_path, "rb") as file:
            file_content = file.read()
        
        # Create an async generator to stream the file
        async def file_stream():
            yield file_content
        
        logger.info(f"Streaming PDF {pdf_id} for viewing from {pdf_path}")
        
        # Return a streaming response
        return StreamingResponse(
            file_stream(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"inline; filename=\"{filename}\"",
                "Content-Type": "application/pdf"
            }
        )
    except Exception as e:
        logger.error(f"Error streaming PDF {pdf_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error streaming PDF: {str(e)}")

# Download PDF endpoint
@router.get("/{pdf_id}/download")
async def download_pdf(pdf_id: int, request: Request):
    """
    Download a PDF file
    """
    logger.info(f"Download request for PDF {pdf_id}")
    
    pdf_path = find_pdf_file(pdf_id)
    if not pdf_path:
        logger.error(f"PDF {pdf_id} not found for download")
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get filename from path or use a default
    filename = os.path.basename(pdf_path)
    if filename == f"{pdf_id}.pdf":
        filename = f"document_{pdf_id}.pdf"
    
    logger.info(f"Serving PDF {pdf_id} for download from {pdf_path}")
    return FileResponse(
        pdf_path, 
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=\"{filename}\""}
    )

# Alternative view endpoint (some frontends might use this format)
@router.get("/view/{pdf_id}")
async def view_pdf_alt(pdf_id: int, request: Request):
    """
    Alternative route for viewing a PDF
    """
    return await view_pdf(pdf_id, request)

# Alternative download endpoint
@router.get("/download/{pdf_id}")
async def download_pdf_alt(pdf_id: int, request: Request):
    """
    Alternative route for downloading a PDF
    """
    return await download_pdf(pdf_id, request)

# PDF info endpoint
@router.get("/{pdf_id}/info")
async def pdf_info(pdf_id: int, request: Request):
    """
    Get information about a PDF file
    """
    logger.info(f"Info request for PDF {pdf_id}")
    
    pdf_path = find_pdf_file(pdf_id)
    if not pdf_path:
        logger.error(f"PDF {pdf_id} not found for info")
        raise HTTPException(status_code=404, detail="PDF not found")
    
    # Get file information
    file_size = os.path.getsize(pdf_path)
    file_modified = os.path.getmtime(pdf_path)
    filename = os.path.basename(pdf_path)
    
    # Generate file URLs
    base_url = str(request.base_url).rstrip('/')
    
    return {
        "id": pdf_id,
        "filename": filename,
        "file_path": pdf_path,
        "file_size": file_size,
        "file_size_formatted": f"{file_size / 1024:.2f} KB",
        "last_modified": file_modified,
        "view_url": f"{base_url}/api/pdfs/{pdf_id}/view",
        "download_url": f"{base_url}/api/pdfs/{pdf_id}/download",
        "file_url": f"{base_url}/api/pdfs/{pdf_id}/view"  # For direct access
    }

# Add this router to your main FastAPI app
# app.include_router(router)