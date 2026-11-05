from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.models import Product, User
from app.schemas.schemas import ProductOut, ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active == True).order_by(Product.sort_order.asc(), Product.id.asc()).all()

@router.get("/all", response_model=List[ProductOut])
def get_all_products_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Product).order_by(Product.sort_order.asc(), Product.id.asc()).all()

@router.get("/compare", response_model=List[ProductOut])
def get_comparison_products(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_active == True).order_by(Product.sort_order.asc()).all()

@router.get("/{identifier}", response_model=ProductOut)
def get_product(identifier: str, db: Session = Depends(get_db)):
    # Can query by code or id
    if identifier.isdigit():
        prod = db.query(Product).filter(Product.id == int(identifier)).first()
    else:
        prod = db.query(Product).filter(Product.code == identifier.lower()).first()
    
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Product).filter(Product.code == product_in.code.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product code already exists")
    
    prod = Product(
        **product_in.model_dump()
    )
    prod.code = prod.code.lower()
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(prod, field, val)
    
    db.commit()
    db.refresh(prod)
    return prod

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()
    return None

