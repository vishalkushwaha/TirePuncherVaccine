from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_owner
from app.core.security import get_password_hash, password_policy_error
from app.models.models import User
from app.schemas.schemas import UserOut, UserCreate, AdminSetPasswordRequest

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db), current_owner: User = Depends(get_current_owner)):
    return db.query(User).all()

@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_owner: User = Depends(get_current_owner)):
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/{user_id}/password")
def set_user_password(
    user_id: int,
    req: AdminSetPasswordRequest,
    db: Session = Depends(get_db),
    current_owner: User = Depends(get_current_owner),
):
    """Owner sets a new password for another staff/owner account (e.g. a forgotten password)."""
    if user_id == current_owner.id:
        raise HTTPException(
            status_code=400,
            detail="Change your own password from My Account (requires your current password)",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    policy_error = password_policy_error(req.new_password)
    if policy_error:
        raise HTTPException(status_code=400, detail=policy_error)
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"status": "success", "message": f"Password updated for {user.username}"}

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_owner: User = Depends(get_current_owner)):
    if user_id == current_owner.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return None

