from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class AdminSetPasswordRequest(BaseModel):
    new_password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "staff"

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Product Schemas
class ProductBase(BaseModel):
    code: str
    name_en: str
    name_hi: str
    mrp: float
    warranty_months: int
    pack_size: Optional[str] = "1 Litre"
    tyre_type: Optional[str] = "Tubeless"
    is_heavy_vehicle: Optional[bool] = False
    vehicle_summary_en: Optional[str] = None
    vehicle_summary_hi: Optional[str] = None
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    features_en: Optional[str] = None
    features_hi: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = True
    is_active: Optional[bool] = True
    sort_order: Optional[int] = 0
    sku: Optional[str] = None
    stock_quantity: Optional[int] = 500
    low_stock_threshold: Optional[int] = 20
    allow_direct_purchase: Optional[bool] = True
    allow_quote: Optional[bool] = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name_en: Optional[str] = None
    name_hi: Optional[str] = None
    mrp: Optional[float] = None
    warranty_months: Optional[int] = None
    pack_size: Optional[str] = None
    tyre_type: Optional[str] = None
    is_heavy_vehicle: Optional[bool] = None
    vehicle_summary_en: Optional[str] = None
    vehicle_summary_hi: Optional[str] = None
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    features_en: Optional[str] = None
    features_hi: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    sku: Optional[str] = None
    stock_quantity: Optional[int] = None
    low_stock_threshold: Optional[int] = None
    allow_direct_purchase: Optional[bool] = None
    allow_quote: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Quotes Schemas
class RetailQuoteCreate(BaseModel):
    full_name: str
    phone: str
    city: str
    product_code: str
    product_name: Optional[str] = None
    quantity: int = 1
    vehicle_type: Optional[str] = None
    message: Optional[str] = None

class RetailQuoteUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class RetailQuoteOut(RetailQuoteCreate):
    id: int
    quote_number: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class BulkQuoteCreate(BaseModel):
    business_name: str
    contact_person: str
    phone: str
    email: Optional[str] = None
    city: str
    district: Optional[str] = None
    state: Optional[str] = "Rajasthan"
    product_code: Optional[str] = None
    estimated_quantity: str
    items_json: Optional[str] = None
    total_bottles: Optional[int] = 0
    estimated_subtotal: Optional[float] = None
    estimated_discount: Optional[float] = None
    estimated_total: Optional[float] = None
    gst_number: Optional[str] = None
    message: Optional[str] = None

class BulkQuoteUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class BulkQuoteOut(BulkQuoteCreate):
    id: int
    quote_number: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Distributor Application Schemas
class DistributorAppCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    city: str
    district: str
    tehsil: Optional[str] = None
    state: Optional[str] = "Rajasthan"
    current_business: Optional[str] = None
    investment_capacity: Optional[str] = None
    message: Optional[str] = None

class DistributorAppUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class DistributorAppOut(DistributorAppCreate):
    id: int
    application_number: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Dealer Schemas
class DealerCreate(BaseModel):
    dealer_name: str
    contact_person: Optional[str] = None
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    city: str
    district: Optional[str] = None
    state: Optional[str] = "Rajasthan"
    pin_code: Optional[str] = None
    is_active: Optional[bool] = True
    sort_order: Optional[int] = 0

class DealerOut(DealerCreate):
    id: int
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Content Schemas
class EventNewsCreate(BaseModel):
    title_en: str
    title_hi: str
    slug: str
    category: Optional[str] = "News"
    event_date: Optional[str] = None
    excerpt_en: Optional[str] = None
    excerpt_hi: Optional[str] = None
    content_en: Optional[str] = None
    content_hi: Optional[str] = None
    image_url: Optional[str] = None
    is_published: Optional[bool] = True

class EventNewsOut(EventNewsCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class BlogPostCreate(BaseModel):
    title_en: str
    title_hi: str
    slug: str
    summary_en: Optional[str] = None
    summary_hi: Optional[str] = None
    content_en: Optional[str] = None
    content_hi: Optional[str] = None
    author: Optional[str] = "Tyre Puncture Vaccine Team"
    cover_image: Optional[str] = None
    reading_time: Optional[str] = "4 min read"
    is_published: Optional[bool] = True

class BlogPostOut(BlogPostCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class FAQCreate(BaseModel):
    category: Optional[str] = "General"
    question_en: str
    question_hi: str
    answer_en: str
    answer_hi: str
    sort_order: Optional[int] = 0
    is_published: Optional[bool] = True

class FAQOut(FAQCreate):
    id: int
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class TestimonialCreate(BaseModel):
    customer_name: str
    customer_city: str
    vehicle_model: Optional[str] = None
    review_en: str
    review_hi: Optional[str] = None
    rating: Optional[int] = 5
    is_approved: Optional[bool] = True
    is_featured: Optional[bool] = False

class TestimonialOut(TestimonialCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class CertificateCreate(BaseModel):
    title_en: str
    title_hi: str
    issuing_body: Optional[str] = None
    issue_year: Optional[str] = None
    document_url: str
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    is_published: Optional[bool] = True
    sort_order: Optional[int] = 0

class CertificateOut(CertificateCreate):
    id: int
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class ContactMessageCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    subject: Optional[str] = None
    message: str

class ContactMessageOut(ContactMessageCreate):
    id: int
    is_read: bool
    notes: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class GalleryPhotoOut(BaseModel):
    id: int
    album_id: int
    caption_en: Optional[str] = None
    caption_hi: Optional[str] = None
    image_url: str
    sort_order: int
    created_at: datetime
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class GalleryAlbumOut(BaseModel):
    id: int
    name_en: str
    name_hi: str
    slug: str
    description_en: Optional[str] = None
    description_hi: Optional[str] = None
    sort_order: int
    photos: List[GalleryPhotoOut] = []
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class SettingUpdate(BaseModel):
    value: str

class SiteSettingOut(BaseModel):
    key: str
    value: Optional[str] = None
    description: Optional[str] = None
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# -------------------------------------------------------------
# E-COMMERCE & CRM SCHEMAS
# -------------------------------------------------------------
class OrderItemCreate(BaseModel):
    product_id: Optional[int] = None
    product_code: str
    product_name: str
    quantity: int
    unit_price: float
    total_price: float

class OrderItemOut(OrderItemCreate):
    id: int
    order_id: int
    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class OrderCreate(BaseModel):
    customer_id: Optional[int] = None
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    shipping_address: str
    city: str
    state: Optional[str] = "Rajasthan"
    pin_code: str
    subtotal: float
    discount_amount: Optional[float] = 0.0
    shipping_fee: Optional[float] = 0.0
    total_amount: float
    payment_method: Optional[str] = "COD"  # "COD", "ONLINE", "UPI"
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    order_status: Optional[str] = None  # "New", "Processing", "Dispatched", "Delivered", "Cancelled"
    payment_status: Optional[str] = None  # "Pending", "Paid", "Failed", "Refunded"
    tracking_number: Optional[str] = None
    shipping_partner: Optional[str] = None
    notes: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_id: Optional[int] = None
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    shipping_address: str
    city: str
    state: str
    pin_code: str
    subtotal: float
    discount_amount: float
    shipping_fee: float
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    tracking_number: Optional[str] = None
    shipping_partner: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class AbandonedCartCreate(BaseModel):
    cart_session_id: str
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    items_json: str
    cart_value: float
    step_reached: Optional[str] = "Cart"  # "Cart", "Address", "Payment"
    status: Optional[str] = "Abandoned"

class AbandonedCartUpdate(BaseModel):
    status: Optional[str] = None
    recovery_notes: Optional[str] = None

class AbandonedCartOut(BaseModel):
    id: int
    cart_session_id: str
    customer_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    items_json: str
    cart_value: float
    step_reached: str
    status: str
    recovery_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class CouponValidateRequest(BaseModel):
    code: str
    cart_value: float

class CouponValidateResponse(BaseModel):
    valid: bool
    code: str
    discount_amount: float
    message: str

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    username: Optional[str] = None
    action: str
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Customer Authentication & Profile Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str
# Customer Authentication Schemas
class CustomerRegister(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    password: str

class CustomerLogin(BaseModel):
    identifier: str  # phone or email
    password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class CustomerOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    identifier: str  # email or phone

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str



