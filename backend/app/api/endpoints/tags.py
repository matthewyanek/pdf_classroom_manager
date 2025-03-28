# app/api/endpoints/tags.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.tag import Tag
from app.schemas.tag import Tag as TagSchema, TagCreate

router = APIRouter()

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