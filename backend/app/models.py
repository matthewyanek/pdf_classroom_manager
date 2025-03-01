from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

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
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship to tags
    tags = relationship("Tag", secondary=pdf_tags, back_populates="pdfs")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    # Relationship to PDFs
    pdfs = relationship("PDF", secondary=pdf_tags, back_populates="tags")