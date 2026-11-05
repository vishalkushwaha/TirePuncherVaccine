from typing import List, Optional
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import DistributorApplication, Dealer, User
from app.schemas.schemas import (
    DistributorAppCreate, DistributorAppOut, DistributorAppUpdate,
    DealerCreate, DealerOut
)

router = APIRouter(prefix="", tags=["Distributors & Dealers"])

@router.post("/distributors/apply", response_model=DistributorAppOut, status_code=status.HTTP_201_CREATED)
def apply_distributor(app_in: DistributorAppCreate, db: Session = Depends(get_db)):
    app_num = f"DIST-{datetime.utcnow().strftime('%y%m')}-{random.randint(1000, 9999)}"
    
    app_obj = DistributorApplication(
        application_number=app_num,
        full_name=app_in.full_name,
        phone=app_in.phone,
        email=app_in.email,
        city=app_in.city,
        district=app_in.district,
        tehsil=app_in.tehsil,
        state=app_in.state or "Rajasthan",
        current_business=app_in.current_business,
        investment_capacity=app_in.investment_capacity,
        message=app_in.message,
        status="New"
    )
    db.add(app_obj)
    db.commit()
    db.refresh(app_obj)
    return app_obj

@router.get("/distributors/applications", response_model=List[DistributorAppOut])
def get_distributor_applications(status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(DistributorApplication)
    if status:
        query = query.filter(DistributorApplication.status == status)
    return query.order_by(DistributorApplication.created_at.desc()).all()

@router.put("/distributors/applications/{app_id}", response_model=DistributorAppOut)
def update_distributor_application(app_id: int, update_in: DistributorAppUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    app_obj = db.query(DistributorApplication).filter(DistributorApplication.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if update_in.status is not None:
        app_obj.status = update_in.status
    if update_in.notes is not None:
        app_obj.notes = update_in.notes
    
    db.commit()
    db.refresh(app_obj)
    return app_obj

# Dealer routes
@router.get("/dealers", response_model=List[DealerOut])
def get_dealers(city: Optional[str] = None, district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Dealer).filter(Dealer.is_active == True)
    if city:
        query = query.filter(Dealer.city.ilike(f"%{city}%"))
    if district:
        query = query.filter(Dealer.district.ilike(f"%{district}%"))
    return query.order_by(Dealer.sort_order.asc(), Dealer.city.asc()).all()

@router.get("/dealers/all", response_model=List[DealerOut])
def get_all_dealers_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Dealer).order_by(Dealer.sort_order.asc()).all()

@router.post("/dealers", response_model=DealerOut, status_code=status.HTTP_201_CREATED)
def create_dealer(dealer_in: DealerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dealer = Dealer(**dealer_in.model_dump())
    db.add(dealer)
    db.commit()
    db.refresh(dealer)
    return dealer

@router.put("/dealers/{dealer_id}", response_model=DealerOut)
def update_dealer(dealer_id: int, dealer_in: DealerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dealer = db.query(Dealer).filter(Dealer.id == dealer_id).first()
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found")
    
    for field, val in dealer_in.model_dump().items():
        setattr(dealer, field, val)
    
    db.commit()
    db.refresh(dealer)
    return dealer

@router.delete("/dealers/{dealer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dealer(dealer_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dealer = db.query(Dealer).filter(Dealer.id == dealer_id).first()
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer not found")
    db.delete(dealer)
    db.commit()
    return None

