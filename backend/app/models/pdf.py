from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, BigInteger
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

# Association table for PDF-to-Tag many-to-many relationship
pdf_tags = Table(
    "pdf_tags",
    Base.metadata,
    Column("pdf_id", Integer, ForeignKey("pdfs.id")),
    Column("tag_id", Integer, ForeignKey("tags.id"))
)

class PDF(Base):
    __tablename__ = "pdfs"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    path = Column(String)
    tags = Column(String, nullable=True)  # Comma-separated tags (legacy)
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
#    size = Column(BigInteger, nullable=True)  # File size in bytes
    
    folder = relationship("Folder", back_populates="pdfs")
    tag_objects = relationship("Tag", secondary=pdf_tags, back_populates="pdfs")
    
    def __repr__(self):
        return f"<PDF {self.filename}>"