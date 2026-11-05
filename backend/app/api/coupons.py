from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Coupon, User
from app.schemas.schemas import CouponValidateRequest, CouponValidateResponse

router = APIRouter(prefix="/coupons", tags=["Coupons & Discounts"])

@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon(req: CouponValidateRequest, db: Session = Depends(get_db)):
    code_clean = req.code.strip().upper()
    coupon = db.query(Coupon).filter(
        Coupon.code == code_clean,
        Coupon.is_active == True
    ).first()
    
    if not coupon:
        return CouponValidateResponse(
            valid=False,
            code=code_clean,
            discount_amount=0.0,
            message="Invalid or expired promo coupon code"
        )
    
    if req.cart_value < (coupon.min_order_value or 0):
        return CouponValidateResponse(
            valid=False,
            code=code_clean,
            discount_amount=0.0,
            message=f"Minimum order subtotal of ₹{int(coupon.min_order_value)} required for this coupon"
        )
    
    if coupon.discount_type == "percentage":
        discount = (req.cart_value * coupon.discount_value) / 100.0
        if coupon.max_discount and discount > coupon.max_discount:
            discount = coupon.max_discount
    else:  # flat
        discount = coupon.discount_value
        
    discount = min(discount, req.cart_value)
    
    return CouponValidateResponse(
        valid=True,
        code=code_clean,
        discount_amount=round(discount, 2),
        message=f"Coupon applied! You saved ₹{round(discount, 2)}"
    )

@router.get("")
def list_coupons(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Coupon).all()

