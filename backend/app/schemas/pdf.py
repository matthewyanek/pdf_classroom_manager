from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PDFBase(BaseModel):
    filename: str

class PDFCreate(PDFBase):
    folder_id: Optional[int] = None
    tags: Optional[str] = None

class PDFUpdate(BaseModel):
    filename: Optional[str] = None
    folder_id: Optional[int] = None
    tags: Optional[str] = None

class PDF(PDFBase):
    id: int
    path: str
    tags: List[str] = []
    folder_id: Optional[int] = None
    folder_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class PDFBulkOperation(BaseModel):
    pdf_ids: List[int]
    folder_id: Optional[int] = None