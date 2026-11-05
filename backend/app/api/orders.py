import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Order, OrderItem, Product, User, AuditLog
from app.schemas.schemas import OrderCreate, OrderUpdate, OrderOut

router = APIRouter(prefix="/orders", tags=["E-Commerce Orders"])

def generate_order_number():
    date_part = datetime.utcnow().strftime("%y%m%d")
    rand_part = random.randint(1000, 9999)
    return f"TPV-{date_part}-{rand_part}"

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def place_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    # Server-side business mode check: Disallow direct purchasing in Mode A (quotation)
    from app.models.models import SiteSetting
    ecom_setting = db.query(SiteSetting).filter(SiteSetting.key == "ecommerce_enabled").first()
    mode_setting = db.query(SiteSetting).filter(SiteSetting.key == "business_mode").first()
    if (ecom_setting and ecom_setting.value == "false") or (mode_setting and mode_setting.value == "quotation"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Direct online order placement is currently disabled. Please submit a quotation request."
        )

    if not order_in.items or len(order_in.items) == 0:
        raise HTTPException(status_code=400, detail="Cannot place order with empty cart")
    
    order_num = generate_order_number()
    
    # 1. Create order record
    order = Order(
        order_number=order_num,
        customer_id=order_in.customer_id,
        customer_name=order_in.customer_name,
        customer_phone=order_in.customer_phone,
        customer_email=order_in.customer_email,
        shipping_address=order_in.shipping_address,
        city=order_in.city,
        state=order_in.state or "Rajasthan",
        pin_code=order_in.pin_code,
        subtotal=order_in.subtotal,
        discount_amount=order_in.discount_amount or 0.0,
        shipping_fee=order_in.shipping_fee or 0.0,
        total_amount=order_in.total_amount,
        payment_method=order_in.payment_method or "COD",
        payment_status="Paid" if order_in.payment_method == "ONLINE" else "Pending",
        order_status="New",
        notes=order_in.notes
    )
    db.add(order)
    db.flush()  # get order.id
    
    # 2. Add line items and atomically decrement inventory
    for item in order_in.items:
        line_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_code=item.product_code,
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            total_price=item.total_price
        )
        db.add(line_item)
        
        # Decrement stock on product
        prod = db.query(Product).filter(
            (Product.id == item.product_id) | (Product.code == item.product_code)
        ).first()
        if prod:
            current_stock = prod.stock_quantity or 500
            prod.stock_quantity = max(0, current_stock - item.quantity)
    
    # 3. Log audit event
    audit = AuditLog(
        action="ORDER_PLACED",
        details=f"Order {order_num} placed by {order.customer_name} ({order.customer_phone}) for ₹{order.total_amount} ({len(order_in.items)} items)"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(order)
    return order

@router.get("", response_model=List[OrderOut])
def get_orders(
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.order_status == status_filter)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Order.order_number.ilike(search_pattern)) |
            (Order.customer_name.ilike(search_pattern)) |
            (Order.customer_phone.ilike(search_pattern)) |
            (Order.city.ilike(search_pattern))
        )
    return query.order_by(Order.created_at.desc()).all()

@router.get("/{order_number}", response_model=OrderOut)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}", response_model=OrderOut)
def update_order(
    order_id: int,
    update_in: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    prev_status = order.order_status
    
    if update_in.order_status is not None:
        order.order_status = update_in.order_status
        # If cancelled, restore stock
        if update_in.order_status == "Cancelled" and prev_status != "Cancelled":
            for item in order.items:
                prod = db.query(Product).filter(
                    (Product.id == item.product_id) | (Product.code == item.product_code)
                ).first()
                if prod:
                    prod.stock_quantity = (prod.stock_quantity or 0) + item.quantity
    
    if update_in.payment_status is not None:
        order.payment_status = update_in.payment_status
    if update_in.tracking_number is not None:
        order.tracking_number = update_in.tracking_number
    if update_in.shipping_partner is not None:
        order.shipping_partner = update_in.shipping_partner
    if update_in.notes is not None:
        order.notes = update_in.notes
        
    order.updated_at = datetime.utcnow()
    
    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        username=current_user.username,
        action="ORDER_UPDATED",
        details=f"Order {order.order_number} status updated to {order.order_status}, tracking: {order.tracking_number}"
    )
    db.add(audit)
    
    db.commit()
    db.refresh(order)
    return order

