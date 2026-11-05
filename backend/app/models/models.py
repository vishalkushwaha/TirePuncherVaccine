from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="staff")  # "owner" or "staff"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)  # "gulf", "rock", "thor"
    name_en = Column(String(100), nullable=False)
    name_hi = Column(String(100), nullable=False)
    mrp = Column(Float, nullable=False)
    warranty_months = Column(Integer, nullable=False)  # 9 or 12
    pack_size = Column(String(50), default="1 Litre")
    tyre_type = Column(String(100), default="Tubeless")  # "Tubeless", "Tube & Tubeless"
    is_heavy_vehicle = Column(Boolean, default=False)
    vehicle_summary_en = Column(String(255), nullable=True)
    vehicle_summary_hi = Column(String(255), nullable=True)
    description_en = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)
    features_en = Column(Text, nullable=True)  # JSON or newline-separated
    features_hi = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    is_featured = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    sku = Column(String(50), nullable=True)
    stock_quantity = Column(Integer, default=500)
    low_stock_threshold = Column(Integer, default=20)
    allow_direct_purchase = Column(Boolean, default=True)
    allow_quote = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RetailQuote(Base):
    __tablename__ = "retail_quotes"
    
    id = Column(Integer, primary_key=True, index=True)
    quote_number = Column(String(30), unique=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    city = Column(String(100), nullable=False)
    product_code = Column(String(50), nullable=False)
    product_name = Column(String(100), nullable=True)
    quantity = Column(Integer, default=1)
    vehicle_type = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="New")  # "New", "Called", "Quoted", "Won", "Closed"
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BulkQuote(Base):
    __tablename__ = "bulk_quotes"
    
    id = Column(Integer, primary_key=True, index=True)
    quote_number = Column(String(30), unique=True, index=True)
    business_name = Column(String(150), nullable=False)
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), default="Rajasthan")
    product_code = Column(String(50), nullable=True)
    estimated_quantity = Column(String(100), nullable=False)  # e.g., "5 Cartons (60 bottles)"
    items_json = Column(Text, nullable=True)  # JSON array of selected items with quantities & rates
    total_bottles = Column(Integer, default=0, nullable=True)
    estimated_subtotal = Column(Float, nullable=True)
    estimated_discount = Column(Float, nullable=True)
    estimated_total = Column(Float, nullable=True)
    gst_number = Column(String(30), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="New")  # "New", "Called", "Quoted", "Won", "Closed"
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DistributorApplication(Base):
    __tablename__ = "distributor_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(30), unique=True, index=True)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    tehsil = Column(String(100), nullable=True)
    state = Column(String(100), default="Rajasthan")
    current_business = Column(String(200), nullable=True)
    investment_capacity = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(20), default="New")  # "New", "Contacted", "Approved", "Rejected"
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Dealer(Base):
    __tablename__ = "dealers"
    
    id = Column(Integer, primary_key=True, index=True)
    dealer_name = Column(String(150), nullable=False)
    contact_person = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), default="Rajasthan")
    pin_code = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

class EventNews(Base):
    __tablename__ = "events_news"
    
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String(200), nullable=False)
    title_hi = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True)
    category = Column(String(50), default="News")  # "News", "Camp", "Launch", "Dealer Meet"
    event_date = Column(String(50), nullable=True)
    excerpt_en = Column(Text, nullable=True)
    excerpt_hi = Column(Text, nullable=True)
    content_en = Column(Text, nullable=True)
    content_hi = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class BlogPost(Base):
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String(200), nullable=False)
    title_hi = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True)
    summary_en = Column(Text, nullable=True)
    summary_hi = Column(Text, nullable=True)
    content_en = Column(Text, nullable=True)
    content_hi = Column(Text, nullable=True)
    author = Column(String(100), default="Tyre Puncture Vaccine Team")
    cover_image = Column(String(255), nullable=True)
    reading_time = Column(String(20), default="4 min read")
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class GalleryAlbum(Base):
    __tablename__ = "gallery_albums"
    
    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String(100), nullable=False)
    name_hi = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True)
    description_en = Column(String(255), nullable=True)
    description_hi = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)
    photos = relationship("GalleryPhoto", back_populates="album", cascade="all, delete-orphan")

class GalleryPhoto(Base):
    __tablename__ = "gallery_photos"
    
    id = Column(Integer, primary_key=True, index=True)
    album_id = Column(Integer, ForeignKey("gallery_albums.id"), nullable=False)
    caption_en = Column(String(255), nullable=True)
    caption_hi = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    album = relationship("GalleryAlbum", back_populates="photos")

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_city = Column(String(100), nullable=False)
    vehicle_model = Column(String(100), nullable=True)
    review_en = Column(Text, nullable=False)
    review_hi = Column(Text, nullable=True)
    rating = Column(Integer, default=5)
    is_approved = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class FAQ(Base):
    __tablename__ = "faqs"
    
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), default="General")  # "General", "Usage", "Warranty", "Orders"
    question_en = Column(String(255), nullable=False)
    question_hi = Column(String(255), nullable=False)
    answer_en = Column(Text, nullable=False)
    answer_hi = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)

class Certificate(Base):
    __tablename__ = "certificates"
    
    id = Column(Integer, primary_key=True, index=True)
    title_en = Column(String(150), nullable=False)
    title_hi = Column(String(150), nullable=False)
    issuing_body = Column(String(150), nullable=True)
    issue_year = Column(String(20), nullable=True)
    document_url = Column(String(255), nullable=False)
    description_en = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=True)
    subject = Column(String(200), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SiteSetting(Base):
    __tablename__ = "site_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=True)
    description = Column(String(255), nullable=True)

# -------------------------------------------------------------
# E-COMMERCE & CRM MODELS
# -------------------------------------------------------------
class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    orders = relationship("Order", back_populates="customer")
    addresses = relationship("CustomerAddress", back_populates="customer", cascade="all, delete-orphan")

class CustomerAddress(Base):
    __tablename__ = "customer_addresses"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    address_line = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), default="Rajasthan")
    pin_code = Column(String(10), nullable=False)
    is_default = Column(Boolean, default=False)
    
    customer = relationship("Customer", back_populates="addresses")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(30), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=False)
    customer_email = Column(String(100), nullable=True)
    shipping_address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), default="Rajasthan")
    pin_code = Column(String(10), nullable=False)
    subtotal = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    shipping_fee = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    payment_method = Column(String(30), default="COD")  # "COD", "ONLINE", "UPI"
    payment_status = Column(String(30), default="Pending")  # "Pending", "Paid", "Failed", "Refunded"
    order_status = Column(String(30), default="New")  # "New", "Processing", "Dispatched", "Delivered", "Cancelled"
    tracking_number = Column(String(100), nullable=True)
    shipping_partner = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_code = Column(String(50), nullable=False)
    product_name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

class AbandonedCart(Base):
    __tablename__ = "abandoned_carts"
    
    id = Column(Integer, primary_key=True, index=True)
    cart_session_id = Column(String(100), unique=True, index=True, nullable=False)
    customer_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    items_json = Column(Text, nullable=False)
    cart_value = Column(Float, nullable=False)
    step_reached = Column(String(50), default="Cart")  # "Cart", "Address", "Payment"
    status = Column(String(30), default="Abandoned")  # "Active", "Abandoned", "Contacted", "Recovered"
    recovery_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Coupon(Base):
    __tablename__ = "coupons"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, index=True, nullable=False)
    discount_type = Column(String(20), default="percentage")  # "percentage" or "flat"
    discount_value = Column(Float, nullable=False)
    min_order_value = Column(Float, default=0.0)
    max_discount = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    username = Column(String(100), nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


