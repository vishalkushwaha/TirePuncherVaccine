from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_owner
from app.models.models import SiteSetting, User

router = APIRouter(prefix="/settings", tags=["Site Settings"])

@router.get("")
def get_public_settings(db: Session = Depends(get_db)) -> Dict[str, Any]:
    settings = db.query(SiteSetting).all()
    res = {}
    for s in settings:
        res[s.key] = s.value
    return res

@router.put("")
def update_settings(updates: Dict[str, Any], db: Session = Depends(get_db), current_user: User = Depends(get_current_owner)):
    for key, val in updates.items():
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if setting:
            setting.value = str(val)
        else:
            db.add(SiteSetting(key=key, value=str(val)))
    db.commit()
    return {"message": "Settings updated successfully"}

