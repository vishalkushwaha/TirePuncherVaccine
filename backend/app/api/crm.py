from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import RetailQuote, BulkQuote, AbandonedCart, ContactMessage, User, AuditLog

router = APIRouter(prefix="/crm", tags=["Centralized CRM & Leads"])

@router.get("/leads")
def get_unified_leads(
    source_filter: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    leads = []
    
    # 1. Retail Quotes
    if not source_filter or source_filter == "retail":
        q_retail = db.query(RetailQuote)
        if status_filter:
            q_retail = q_retail.filter(RetailQuote.status == status_filter)
        for r in q_retail.order_by(RetailQuote.created_at.desc()).all():
            leads.append({
                "id": f"retail_{r.id}",
                "raw_id": r.id,
                "source": "Retail Quote",
                "source_type": "retail",
                "reference": r.quote_number,
                "name": r.full_name,
                "phone": r.phone,
                "email": None,
                "city": r.city,
                "product": r.product_name or r.product_code.upper(),
                "quantity": f"{r.quantity} bottle(s)",
                "details": f"Vehicle: {r.vehicle_type or 'General'}",
                "status": r.status,
                "notes": r.notes,
                "created_at": r.created_at.isoformat() if r.created_at else None
            })

    # 2. Bulk Quotes
    if not source_filter or source_filter == "bulk":
        q_bulk = db.query(BulkQuote)
        if status_filter:
            q_bulk = q_bulk.filter(BulkQuote.status == status_filter)
        for b in q_bulk.order_by(BulkQuote.created_at.desc()).all():
            leads.append({
                "id": f"bulk_{b.id}",
                "raw_id": b.id,
                "source": "Wholesale / Fleet",
                "source_type": "bulk",
                "reference": b.quote_number,
                "name": f"{b.business_name} ({b.contact_person})",
                "phone": b.phone,
                "email": b.email,
                "city": f"{b.city}, {b.state}",
                "product": (b.product_code or "Mixed").upper(),
                "quantity": b.estimated_quantity,
                "details": f"GST: {b.gst_number or 'N/A'}",
                "status": b.status,
                "notes": b.notes,
                "created_at": b.created_at.isoformat() if b.created_at else None
            })

    # 3. Abandoned Carts
    if not source_filter or source_filter == "abandoned_cart":
        q_cart = db.query(AbandonedCart)
        if status_filter:
            q_cart = q_cart.filter(AbandonedCart.status == status_filter)
        for c in q_cart.order_by(AbandonedCart.created_at.desc()).all():
            leads.append({
                "id": f"cart_{c.id}",
                "raw_id": c.id,
                "source": "Abandoned Cart",
                "source_type": "abandoned_cart",
                "reference": f"CART-{c.id}",
                "name": c.customer_name or "Store Visitor",
                "phone": c.phone or "Not Provided",
                "email": c.email,
                "city": "Online Cart",
                "product": "Cart Products",
                "quantity": f"₹{int(c.cart_value)} Value",
                "details": f"Step reached: {c.step_reached}",
                "status": c.status,
                "notes": c.recovery_notes,
                "created_at": c.created_at.isoformat() if c.created_at else None
            })

    # 4. Contact Inquiries
    if not source_filter or source_filter == "contact":
        q_msg = db.query(ContactMessage)
        for m in q_msg.order_by(ContactMessage.created_at.desc()).all():
            leads.append({
                "id": f"contact_{m.id}",
                "raw_id": m.id,
                "source": "Contact Form",
                "source_type": "contact",
                "reference": f"MSG-{m.id}",
                "name": m.name,
                "phone": m.phone,
                "email": m.email,
                "city": "Direct Contact",
                "product": m.subject or "Customer Inquiry",
                "quantity": "Inquiry",
                "details": m.message[:60] + "..." if len(m.message) > 60 else m.message,
                "status": "New" if not m.is_read else "Contacted",
                "notes": m.notes,
                "created_at": m.created_at.isoformat() if m.created_at else None
            })

    # Search filter
    if search:
        s_term = search.lower()
        leads = [l for l in leads if (
            s_term in (l["name"] or "").lower() or
            s_term in (l["phone"] or "").lower() or
            s_term in (l["reference"] or "").lower() or
            s_term in (l["city"] or "").lower()
        )]

    # Sort newest first
    leads.sort(key=lambda x: x["created_at"] or "", reverse=True)
    return leads

@router.put("/leads/{source_type}/{raw_id}")
def update_lead(
    source_type: str,
    raw_id: int,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_status = updates.get("status")
    new_notes = updates.get("notes")

    if source_type == "retail":
        item = db.query(RetailQuote).filter(RetailQuote.id == raw_id).first()
        if item:
            if new_status: item.status = new_status
            if new_notes: item.notes = new_notes
    elif source_type == "bulk":
        item = db.query(BulkQuote).filter(BulkQuote.id == raw_id).first()
        if item:
            if new_status: item.status = new_status
            if new_notes: item.notes = new_notes
    elif source_type == "abandoned_cart":
        item = db.query(AbandonedCart).filter(AbandonedCart.id == raw_id).first()
        if item:
            if new_status: item.status = new_status
            if new_notes: item.recovery_notes = new_notes
    elif source_type == "contact":
        item = db.query(ContactMessage).filter(ContactMessage.id == raw_id).first()
        if item:
            item.is_read = True
            if new_notes: item.notes = new_notes

    audit = AuditLog(
        user_id=current_user.id,
        username=current_user.username,
        action="CRM_LEAD_UPDATED",
        details=f"Lead {source_type} #{raw_id} status updated to {new_status}"
    )
    db.add(audit)
    db.commit()
    return {"message": "Lead updated successfully"}

