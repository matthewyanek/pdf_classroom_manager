# app/api/api.py
from fastapi import APIRouter
from app.api.endpoints import folders, pdfs, tags, debug

api_router = APIRouter()

api_router.include_router(folders.router, prefix="/api/folders", tags=["folders"])
api_router.include_router(pdfs.router, prefix="/api/pdfs", tags=["pdfs"])
api_router.include_router(tags.router, prefix="/api/tags", tags=["tags"])
api_router.include_router(debug.router, prefix="/api/debug", tags=["debug"])