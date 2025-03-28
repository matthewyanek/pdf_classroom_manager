# app/schemas/folder.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FolderBase(BaseModel):
    name: str

class FolderCreate(FolderBase):
    pass

class FolderUpdate(FolderBase):
    pass

class Folder(FolderBase):
    id: int
    created_at: datetime
    pdf_count: Optional[int] = 0
    
    class Config:
        orm_mode = True

class FolderList(BaseModel):
    folders: List[Folder]
    unfiled_count: int