# app/api/endpoints/folders.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.core.database import get_db
from app.models.folder import Folder
from app.models.pdf import PDF
from app.schemas.folder import FolderCreate, FolderUpdate, Folder as FolderSchema, FolderList

router = APIRouter()

@router.get("/", response_model=FolderList)
async def get_folders(db: Session = Depends(get_db)):
    """Get all folders with PDF counts and unfiled count"""
    print("Getting all folders")
    folders = db.query(Folder).all()
    
    # Count PDFs in each folder
    result = []
    for folder in folders:
        pdf_count = db.query(PDF).filter(PDF.folder_id == folder.id).count()
        print(f"Folder {folder.id}: {folder.name} has {pdf_count} PDFs")
        result.append(FolderSchema(
            id=folder.id,
            name=folder.name,
            created_at=folder.created_at,
            pdf_count=pdf_count
        ))
    
    # Count unfiled PDFs
    unfiled_count = db.query(PDF).filter(PDF.folder_id.is_(None)).count()
    print(f"Unfiled PDFs count: {unfiled_count}")
    
    return FolderList(folders=result, unfiled_count=unfiled_count)

@router.post("/", response_model=FolderSchema, status_code=201)
async def create_folder(data: FolderCreate, db: Session = Depends(get_db)):
    """Create a new folder"""
    print(f"Creating folder with name: {data.name}")
    
    # Check if folder with this name already exists
    existing = db.query(Folder).filter(Folder.name == data.name).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Folder with name '{data.name}' already exists"
        )
    
    # Create new folder
    folder = Folder(name=data.name)
    db.add(folder)
    db.commit()
    db.refresh(folder)
    
    print(f"Created folder with ID: {folder.id}")
    
    return FolderSchema(
        id=folder.id,
        name=folder.name,
        created_at=folder.created_at,
        pdf_count=0
    )

@router.get("/{folder_id}", response_model=FolderSchema)
async def get_folder(folder_id: int, db: Session = Depends(get_db)):
    """Get a specific folder"""
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    if not folder:
        raise HTTPException(
            status_code=404,
            detail=f"Folder with ID {folder_id} not found"
        )
    
    pdf_count = db.query(PDF).filter(PDF.folder_id == folder.id).count()
    
    return FolderSchema(
        id=folder.id,
        name=folder.name,
        created_at=folder.created_at,
        pdf_count=pdf_count
    )

@router.put("/{folder_id}", response_model=FolderSchema)
async def update_folder(
    folder_id: int, 
    data: FolderUpdate, 
    db: Session = Depends(get_db)
):
    """Update a folder"""
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    if not folder:
        raise HTTPException(
            status_code=404,
            detail=f"Folder with ID {folder_id} not found"
        )
    
    # Check if name is already taken by another folder
    if data.name != folder.name:
        existing = db.query(Folder).filter(Folder.name == data.name).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Folder with name '{data.name}' already exists"
            )
    
    # Update folder
    folder.name = data.name
    db.commit()
    db.refresh(folder)
    
    pdf_count = db.query(PDF).filter(PDF.folder_id == folder.id).count()
    
    return FolderSchema(
        id=folder.id,
        name=folder.name,
        created_at=folder.created_at,
        pdf_count=pdf_count
    )

@router.delete("/{folder_id}", status_code=204)
async def delete_folder(folder_id: int, db: Session = Depends(get_db)):
    """Delete a folder and move its PDFs to unfiled"""
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    if not folder:
        raise HTTPException(
            status_code=404,
            detail=f"Folder with ID {folder_id} not found"
        )
    
    # Move PDFs to unfiled
    db.query(PDF).filter(PDF.folder_id == folder_id).update({"folder_id": None})
    
    # Delete the folder
    db.delete(folder)
    db.commit()
    
    return None