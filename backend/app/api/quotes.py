from typing import List, Optional
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user
from app.models.models import RetailQuote, BulkQuote, User
from app.schemas.schemas import (
    RetailQuoteCreate, RetailQuoteOut, RetailQuoteUpdate,
    BulkQuoteCreate, BulkQuoteOut, BulkQuoteUpdate
)

router = APIRouter(prefix="/quotes", tags=["Quotes"])

def send_notification_email(quote_type: str, quote_num: str, details: dict):
    # Simulates background email dispatcher to ujjalaelectricalsbkn@gmail.com
    print(f"[EMAIL NOTIFICATION DISPATCHED] New {quote_type} {quote_num} for Ujjala Electricals:")
    for k, v in details.items():
        print(f"  {k}: {v}")

@router.post("/retail", response_model=RetailQuoteOut, status_code=status.HTTP_201_CREATED)
def submit_retail_quote(quote_in: RetailQuoteCreate, db: Session = Depends(get_db)):
    quote_num = f"RQ-{datetime.utcnow().strftime('%y%m')}-{random.randint(1000, 9999)}"
    
    quote = RetailQuote(
        quote_number=quote_num,
        full_name=quote_in.full_name,
        phone=quote_in.phone,
        city=quote_in.city,
        product_code=quote_in.product_code,
        product_name=quote_in.product_name or quote_in.product_code.upper(),
        quantity=quote_in.quantity,
        vehicle_type=quote_in.vehicle_type,
        message=quote_in.message,
        status="New"
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    
    send_notification_email("Retail Quote", quote_num, {
        "Customer": quote.full_name,
        "Phone": quote.phone,
        "City": quote.city,
        "Product": quote.product_name,
        "Qty": quote.quantity
    })
    
    return quote

@router.get("/retail", response_model=List[RetailQuoteOut])
def get_retail_quotes(status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(RetailQuote)
    if status:
        query = query.filter(RetailQuote.status == status)
    return query.order_by(RetailQuote.created_at.desc()).all()

@router.put("/retail/{quote_id}", response_model=RetailQuoteOut)
def update_retail_quote(quote_id: int, update_in: RetailQuoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    quote = db.query(RetailQuote).filter(RetailQuote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Retail quote not found")
    
    if update_in.status is not None:
        quote.status = update_in.status
    if update_in.notes is not None:
        quote.notes = update_in.notes
    
    db.commit()
    db.refresh(quote)
    return quote

@router.post("/bulk", response_model=BulkQuoteOut, status_code=status.HTTP_201_CREATED)
def submit_bulk_quote(quote_in: BulkQuoteCreate, db: Session = Depends(get_db)):
    quote_num = f"BQ-{datetime.utcnow().strftime('%y%m')}-{random.randint(1000, 9999)}"
    
    quote = BulkQuote(
        quote_number=quote_num,
        business_name=quote_in.business_name,
        contact_person=quote_in.contact_person,
        phone=quote_in.phone,
        email=quote_in.email,
        city=quote_in.city,
        district=quote_in.district,
        state=quote_in.state,
        product_code=quote_in.product_code,
        estimated_quantity=quote_in.estimated_quantity,
        items_json=quote_in.items_json,
        total_bottles=quote_in.total_bottles or 0,
        estimated_subtotal=quote_in.estimated_subtotal,
        estimated_discount=quote_in.estimated_discount,
        estimated_total=quote_in.estimated_total,
        gst_number=quote_in.gst_number,
        message=quote_in.message,
        status="New"
    )
    db.add(quote)
    db.commit()
    db.refresh(quote)
    
    send_notification_email("Bulk Order Quote", quote_num, {
        "Business": quote.business_name,
        "Contact": quote.contact_person,
        "Phone": quote.phone,
        "City": f"{quote.city}, {quote.state}",
        "Estimated Quantity": quote.estimated_quantity
    })
    
    return quote

@router.get("/bulk", response_model=List[BulkQuoteOut])
def get_bulk_quotes(status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(BulkQuote)
    if status:
        query = query.filter(BulkQuote.status == status)
    return query.order_by(BulkQuote.created_at.desc()).all()

@router.put("/bulk/{quote_id}", response_model=BulkQuoteOut)
def update_bulk_quote(quote_id: int, update_in: BulkQuoteUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    quote = db.query(BulkQuote).filter(BulkQuote.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Bulk quote not found")
    
    if update_in.status is not None:
        quote.status = update_in.status
    if update_in.notes is not None:
        quote.notes = update_in.notes
    
    db.commit()
    db.refresh(quote)
    return quote

@router.get("/stats")
def get_quote_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    retail_total = db.query(RetailQuote).count()
    retail_new = db.query(RetailQuote).filter(RetailQuote.status == "New").count()
    
    bulk_total = db.query(BulkQuote).count()
    bulk_new = db.query(BulkQuote).filter(BulkQuote.status == "New").count()
    
    return {
        "retail": {"total": retail_total, "new": retail_new},
        "bulk": {"total": bulk_total, "new": bulk_new}
    }

