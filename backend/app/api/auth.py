from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import verify_password, get_password_hash, create_access_token, decode_token
from app.core.config import settings
from app.models.models import User, Customer, CustomerAddress, Order, SiteSetting
from app.schemas.schemas import (
    Token, UserLogin, UserOut,
    CustomerRegister, CustomerLogin, CustomerOut,
    ForgotPasswordRequest, ResetPasswordRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# -------------------------------------------------------------
# Staff / Admin Authentication
# -------------------------------------------------------------
@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
    
    access_token = create_access_token(subject=user.username)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user


# -------------------------------------------------------------
# Customer Authentication & Registration Flow
# -------------------------------------------------------------
@router.post("/customer/register")
def register_customer(reg: CustomerRegister, db: Session = Depends(get_db)):
    # Check if registration is enabled
    reg_setting = db.query(SiteSetting).filter(SiteSetting.key == "allow_customer_registration").first()
    mode_setting = db.query(SiteSetting).filter(SiteSetting.key == "business_mode").first()
    if mode_setting and mode_setting.value == "quotation":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer registration is disabled while operating in Mode A (Quotation Only)."
        )

    # Check for existing phone or email
    if db.query(Customer).filter(Customer.phone == reg.phone).first():
        raise HTTPException(status_code=400, detail="A customer with this phone number is already registered.")
    if reg.email and db.query(Customer).filter(Customer.email == reg.email).first():
        raise HTTPException(status_code=400, detail="A customer with this email address is already registered.")

    customer = Customer(
        full_name=reg.full_name,
        phone=reg.phone,
        email=reg.email,
        hashed_password=get_password_hash(reg.password),
        is_active=True
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)

    token = create_access_token(subject=f"customer:{customer.id}")
    return {
        "access_token": token,
        "token_type": "bearer",
        "customer": {
            "id": customer.id,
            "full_name": customer.full_name,
            "phone": customer.phone,
            "email": customer.email
        }
    }

@router.post("/customer/login")
def login_customer(cred: CustomerLogin, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(
        (Customer.phone == cred.identifier) | (Customer.email == cred.identifier)
    ).first()

    if not customer or not customer.hashed_password or not verify_password(cred.password, customer.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid phone/email or password")

    if not customer.is_active:
        raise HTTPException(status_code=400, detail="Customer account is inactive. Please contact support.")

    token = create_access_token(subject=f"customer:{customer.id}")
    return {
        "access_token": token,
        "token_type": "bearer",
        "customer": {
            "id": customer.id,
            "full_name": customer.full_name,
            "phone": customer.phone,
            "email": customer.email
        }
    }

# -------------------------------------------------------------
# Password Reset / Verification Flow
# -------------------------------------------------------------
@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Check in admin users
    user = db.query(User).filter(
        (User.username == req.identifier) | (User.email == req.identifier)
    ).first()

    # Check in customers
    customer = None
    if not user:
        customer = db.query(Customer).filter(
            (Customer.phone == req.identifier) | (Customer.email == req.identifier)
        ).first()

    if not user and not customer:
        raise HTTPException(status_code=404, detail="No account found matching this username, email or phone.")

    # Generate 15-minute reset token
    target = f"user:{user.id}" if user else f"customer:{customer.id}"
    reset_token = create_access_token(subject=target, expires_delta=timedelta(minutes=15))

    return {
        "message": "Password reset verification initiated.",
        "identifier": req.identifier,
        "reset_token": reset_token,
        "instructions": "Use this verification token with your new password to complete reset."
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = decode_token(req.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Expired or invalid reset token")
    subject: str = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    if subject.startswith("user:"):
        user_id = int(subject.replace("user:", ""))
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User account not found")
        user.hashed_password = get_password_hash(req.new_password)
        db.commit()
        return {"status": "success", "message": "Admin password updated successfully. Please sign in."}

    elif subject.startswith("customer:"):
        cust_id = int(subject.replace("customer:", ""))
        customer = db.query(Customer).filter(Customer.id == cust_id).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer account not found")
        customer.hashed_password = get_password_hash(req.new_password)
        db.commit()
        return {"status": "success", "message": "Customer password updated successfully. Please sign in."}

    raise HTTPException(status_code=400, detail="Invalid subject type in token")
