# update_pdf_sizes.py
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.pdf import PDF

def update_pdf_sizes():
    """Update size for existing PDFs"""
    # Create database connection
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Get all PDFs
        pdfs = db.query(PDF).all()
        print(f"Found {len(pdfs)} PDFs to update")
        
        updated_count = 0
        error_count = 0
        
        for pdf in pdfs:
            try:
                # Get the file path
                if pdf.path.startswith("uploads/"):
                    file_name = os.path.basename(pdf.path)
                    file_path = os.path.join(settings.UPLOAD_DIR, file_name)
                else:
                    file_path = pdf.path
                
                # Check if file exists
                if os.path.exists(file_path):
                    # Get file size
                    size = os.path.getsize(file_path)
                    
                    # Update PDF record
                    pdf.size = size
                    updated_count += 1
                    
                    print(f"Updated PDF {pdf.id}: {pdf.filename} - Size: {size} bytes")
                else:
                    print(f"File not found for PDF {pdf.id}: {pdf.filename} at {file_path}")
                    error_count += 1
            except Exception as e:
                print(f"Error updating PDF {pdf.id}: {str(e)}")
                error_count += 1
        
        # Commit changes
        db.commit()
        print(f"Update complete. Updated {updated_count} PDFs. Errors: {error_count}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting PDF size update script...")
    update_pdf_sizes()
    print("Script completed.")