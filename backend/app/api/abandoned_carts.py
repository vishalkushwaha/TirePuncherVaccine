from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import AbandonedCart, User, AuditLog
from app.schemas.schemas import AbandonedCartCreate, AbandonedCartUpdate, AbandonedCartOut

router = APIRouter(prefix="/abandoned-carts", tags=["Abandoned Cart Recovery"])

@router.post("", response_model=AbandonedCartOut)
def record_cart_session(cart_in: AbandonedCartCreate, db: Session = Depends(get_db)):
    # Find existing session or create new
    cart = db.query(AbandonedCart).filter(
        AbandonedCart.cart_session_id == cart_in.cart_session_id
    ).first()
    
    if cart:
        if cart_in.customer_name:
            cart.customer_name = cart_in.customer_name
        if cart_in.phone:
            cart.phone = cart_in.phone
        if cart_in.email:
            cart.email = cart_in.email
        cart.items_json = cart_in.items_json
        cart.cart_value = cart_in.cart_value
        cart.step_reached = cart_in.step_reached or cart.step_reached
        cart.updated_at = datetime.utcnow()
    else:
        cart = AbandonedCart(
            cart_session_id=cart_in.cart_session_id,
            customer_name=cart_in.customer_name,
            phone=cart_in.phone,
            email=cart_in.email,
            items_json=cart_in.items_json,
            cart_value=cart_in.cart_value,
            step_reached=cart_in.step_reached or "Cart",
            status=cart_in.status or "Abandoned"
        )
        db.add(cart)
    
    db.commit()
    db.refresh(cart)
    return cart

@router.get("", response_model=List[AbandonedCartOut])
def get_abandoned_carts(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AbandonedCart)
    if status_filter:
        query = query.filter(AbandonedCart.status == status_filter)
    return query.order_by(AbandonedCart.updated_at.desc()).all()

@router.put("/{cart_id}", response_model=AbandonedCartOut)
def update_cart_recovery(
    cart_id: int,
    update_in: AbandonedCartUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = db.query(AbandonedCart).filter(AbandonedCart.id == cart_id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Abandoned cart record not found")
    
    if update_in.status is not None:
        cart.status = update_in.status
    if update_in.recovery_notes is not None:
        cart.recovery_notes = update_in.recovery_notes
        
    cart.updated_at = datetime.utcnow()
    
    audit = AuditLog(
        user_id=current_user.id,
        username=current_user.username,
        action="ABANDONED_CART_UPDATED",
        details=f"Cart #{cart.id} ({cart.phone}) recovery status: {cart.status}"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(cart)
    return cart

