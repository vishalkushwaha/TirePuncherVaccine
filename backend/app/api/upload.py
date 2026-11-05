import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from app.api.deps import get_current_user
from app.core.config import settings
from app.models.models import User

router = APIRouter(prefix="/upload", tags=["Uploads"])

@router.post("")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
    dest_path = settings.MEDIA_DIR / unique_name
    
    with open(dest_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # Also mirror to frontend public assets so Vite dev server can serve immediately if needed
    frontend_dest = settings.ROOT_ASSETS_DIR / "frontend" / "public" / "assets" / unique_name
    try:
        with open(frontend_dest, "wb") as buffer:
            buffer.write(content)
    except Exception:
        pass
        
    return {
        "filename": unique_name,
        "url": f"/media/{unique_name}"
    }

