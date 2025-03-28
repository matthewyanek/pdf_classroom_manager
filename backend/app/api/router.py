# app/api/router.py
from fastapi import APIRouter
from app.api.endpoints import folders, pdfs, tags

api_router = APIRouter()

api_router.include_router(folders.router, prefix="/folders", tags=["folders"])
api_router.include_router(pdfs.router, prefix="/pdfs", tags=["pdfs"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])