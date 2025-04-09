# app/api/endpoints/tags.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import logging
import os
import PyPDF2

from app.core.database import get_db
from app.models.tag import Tag
from app.models.pdf import PDF
from app.schemas.tag import Tag as TagSchema, TagCreate

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[TagSchema])
async def get_tags(db: Session = Depends(get_db)):
    """Get all tags"""
    tags = db.query(Tag).all()
    
    # Count PDFs for each tag (using the many-to-many relationship)
    result = []
    for tag in tags:
        result.append(TagSchema(
            id=tag.id,
            name=tag.name
        ))
    
    return result

@router.post("/", response_model=TagSchema, status_code=201)
async def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    """Create a new tag"""
    # Check if tag already exists
    existing = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Tag with name '{tag.name}' already exists"
        )
    
    # Create new tag
    db_tag = Tag(name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    
    return TagSchema(
        id=db_tag.id,
        name=db_tag.name
    )

@router.delete("/{tag_id}", status_code=204)
async def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """Delete a tag"""
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(
            status_code=404,
            detail=f"Tag with ID {tag_id} not found"
        )
    
    # Delete the tag
    db.delete(tag)
    db.commit()
    
    return None

@router.post("/generate", response_model=Dict[str, List[str]])
async def generate_tags(data: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """Generate tags for a PDF using simple text analysis."""
    pdf_id = data.get("pdf_id")
    if not pdf_id:
        logger.error("No PDF ID provided")
        raise HTTPException(status_code=400, detail="PDF ID is required")
    
    # Get the filename from the request data (optional)
    filename = data.get("filename")
    
    logger.info(f"Generating tags for PDF ID: {pdf_id}, Filename: {filename}")
    
    # Get the PDF from the database
    pdf = db.query(PDF).filter(PDF.id == pdf_id).first()
    if not pdf:
        logger.error(f"PDF with ID {pdf_id} not found in database")
        raise HTTPException(status_code=404, detail="PDF not found in database")
    
    # Current working directory for debugging
    current_dir = os.getcwd()
    logger.info(f"Current working directory: {current_dir}")
    
    try:
        # Get the PDF file path
        pdf_path = os.path.join("uploads", str(pdf.id), pdf.filename)
        logger.info(f"PDF path: {pdf_path}")
        full_path = os.path.join(current_dir, pdf_path)
        logger.info(f"Full PDF path: {full_path}")
        
        if not os.path.exists(pdf_path):
            logger.warning(f"PDF file not found at path: {pdf_path}")
            # Try alternative paths
            alt_paths = [
                os.path.join("uploads", pdf.filename),
                os.path.join("uploads", f"{pdf.id}_{pdf.filename}"),
                os.path.join(".", "uploads", str(pdf.id), pdf.filename),
                os.path.join(".", "uploads", pdf.filename),
                # Add more potential paths based on your file structure
            ]
            
            found = False
            for alt_path in alt_paths:
                logger.info(f"Trying alternative path: {alt_path}")
                if os.path.exists(alt_path):
                    pdf_path = alt_path
                    found = True
                    logger.info(f"Found PDF at alternative path: {alt_path}")
                    break
            
            if not found:
                logger.error("PDF file not found in any of the expected locations")
                
                # If we have a filename, generate tags from it as fallback
                if filename:
                    logger.info(f"Generating tags from filename: {filename}")
                    filename_tags = generate_tags_from_filename(filename)
                    if filename_tags:
                        return {"tags": filename_tags}
                
                raise HTTPException(status_code=404, detail="PDF file not found on server")
        
        # Extract text from the PDF
        text = ""
        try:
            logger.info(f"Extracting text from PDF: {pdf.filename}")
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)
                logger.info(f"PDF has {num_pages} pages")
                
                for page_num in range(num_pages):
                    try:
                        page_text = pdf_reader.pages[page_num].extract_text() or ""
                        text += page_text + "\n"
                    except Exception as e:
                        logger.error(f"Error extracting text from page {page_num}: {str(e)}")
                    
            # Log a preview of the extracted text
            text_length = len(text)
            preview = text[:200] + "..." if text_length > 200 else text
            logger.info(f"Extracted {text_length} characters of text. Preview: {preview}")
            
            if not text.strip():
                logger.warning(f"No text could be extracted from PDF {pdf_id}")
                
                # If we have a filename, generate tags from it as fallback
                if filename:
                    logger.info(f"Generating tags from filename: {filename}")
                    filename_tags = generate_tags_from_filename(filename)
                    if filename_tags:
                        return {"tags": filename_tags}
                
                raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
                
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            
            # If we have a filename, generate tags from it as fallback
            if filename:
                logger.info(f"Generating tags from filename: {filename}")
                filename_tags = generate_tags_from_filename(filename)
                if filename_tags:
                    return {"tags": filename_tags}
            
            raise HTTPException(status_code=500, detail=f"Error extracting text from PDF: {str(e)}")
        
        # Simple tag extraction
        logger.info(f"Generating tags from extracted text")
        tags = extract_tags_from_text(text)
        
        if not tags:
            logger.warning(f"No tags were generated from text for PDF {pdf_id}")
            
            # If we have a filename, generate tags from it as fallback
            if filename:
                logger.info(f"Generating tags from filename: {filename}")
                filename_tags = generate_tags_from_filename(filename)
                if filename_tags:
                    return {"tags": filename_tags}
            
            # Return empty tags list instead of error
            return {"tags": []}
        
        logger.info(f"Generated tags for PDF {pdf_id}: {tags}")
        return {"tags": tags}
    
    except Exception as e:
        logger.error(f"Error generating tags: {str(e)}")
        
        # If we have a filename, generate tags from it as fallback
        if filename:
            logger.info(f"Generating tags from filename as fallback after error: {filename}")
            filename_tags = generate_tags_from_filename(filename)
            if filename_tags:
                return {"tags": filename_tags}
        
        raise HTTPException(status_code=500, detail=f"Failed to generate tags: {str(e)}")

def extract_tags_from_text(text: str, max_tags: int = 5) -> List[str]:
    """
    Extract relevant tags from the text using a simple keyword extraction approach.
    
    Args:
        text: The text to extract tags from
        max_tags: Maximum number of tags to extract
        
    Returns:
        A list of extracted tags
    """
    try:
        # Check if there's enough text to process
        if not text or len(text.strip()) < 50:
            logger.warning("Text is too short for meaningful tag extraction")
            return []
            
        # Clean and normalize the text
        text = text.lower()
        
        # List of common stop words to exclude
        stop_words = set([
            "the", "and", "a", "to", "of", "in", "is", "it", "that", "for", 
            "on", "with", "as", "this", "by", "an", "be", "are", "or", "at",
            "from", "was", "were", "have", "has", "had", "not", "but", "what",
            "all", "when", "who", "which", "can", "their", "will", "would", "could",
            "should", "did", "do", "does", "they", "them", "these", "those", "there",
            "here", "page", "pdf", "document", "also", "may", "one", "two", "three",
            "first", "second", "third", "see", "use", "used", "using", "like", "make",
            "made", "making"
        ])
        
        # Split into words and count frequencies
        words = text.split()
        word_counts = {}
        
        for word in words:
            # Clean the word
            word = word.strip(".,!?;:()[]{}\"'")
            
            # Skip short words, numbers, and stop words
            if len(word) < 3 or word.isdigit() or word in stop_words:
                continue
                
            if word in word_counts:
                word_counts[word] += 1
            else:
                word_counts[word] = 1
        
        # Sort by frequency and take the top words
        sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Take the top words as tags
        tags = [word for word, count in sorted_words[:max_tags]]
        
        logger.info(f"Extracted {len(tags)} tags from text")
        return tags
        
    except Exception as e:
        logger.error(f"Error extracting tags: {str(e)}")
        return []

def generate_tags_from_filename(filename: str, max_tags: int = 5) -> List[str]:
    """
    Generate tags from a filename when text extraction fails.
    
    Args:
        filename: The filename to extract tags from
        max_tags: Maximum number of tags to generate
        
    Returns:
        A list of tags
    """
    try:
        # Remove file extension
        name_without_extension = os.path.splitext(filename)[0]
        
        # Replace separators with spaces
        name_cleaned = name_without_extension.replace('_', ' ').replace('-', ' ').replace('.', ' ')
        
        # Split by spaces and convert to lowercase
        words = name_cleaned.split()
        words = [word.lower() for word in words]
        
        # Remove common stop words and short words
        stop_words = set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'pdf', 'doc', 'file'])
        words = [word for word in words if word not in stop_words and len(word) > 2 and not word.isdigit()]
        
        # Remove duplicates and take up to max_tags
        unique_words = list(dict.fromkeys(words))
        tags = unique_words[:max_tags]
        
        logger.info(f"Generated {len(tags)} tags from filename: {tags}")
        return tags
    except Exception as e:
        logger.error(f"Error generating tags from filename: {str(e)}")
        return []