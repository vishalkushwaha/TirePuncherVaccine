from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api.deps import get_db, get_current_user
from app.models.models import (
    EventNews, BlogPost, GalleryAlbum, GalleryPhoto, Testimonial,
    FAQ, Certificate, ContactMessage, Product, User
)
from app.schemas.schemas import (
    EventNewsCreate, EventNewsOut,
    BlogPostCreate, BlogPostOut,
    GalleryAlbumOut, GalleryPhotoOut,
    TestimonialCreate, TestimonialOut,
    FAQCreate, FAQOut,
    CertificateCreate, CertificateOut,
    ContactMessageCreate, ContactMessageOut
)

router = APIRouter(prefix="", tags=["Content Management"])

# --- Events & News ---
@router.get("/events", response_model=List[EventNewsOut])
def get_events(limit: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(EventNews).filter(EventNews.is_published == True).order_by(EventNews.created_at.desc())
    if limit:
        query = query.limit(limit)
    return query.all()

@router.get("/events/all", response_model=List[EventNewsOut])
def get_all_events_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(EventNews).order_by(EventNews.created_at.desc()).all()

@router.get("/events/{slug_or_id}", response_model=EventNewsOut)
def get_event(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        event = db.query(EventNews).filter(EventNews.id == int(slug_or_id)).first()
    else:
        event = db.query(EventNews).filter(EventNews.slug == slug_or_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event/News not found")
    return event

@router.post("/events", response_model=EventNewsOut, status_code=status.HTTP_201_CREATED)
def create_event(event_in: EventNewsCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = EventNews(**event_in.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.put("/events/{event_id}", response_model=EventNewsOut)
def update_event(event_id: int, event_in: EventNewsCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = db.query(EventNews).filter(EventNews.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for k, v in event_in.model_dump().items():
        setattr(event, k, v)
    db.commit()
    db.refresh(event)
    return event

@router.delete("/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    event = db.query(EventNews).filter(EventNews.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return None

# --- Blog Posts ---
@router.get("/blog", response_model=List[BlogPostOut])
def get_blog_posts(limit: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(BlogPost).filter(BlogPost.is_published == True).order_by(BlogPost.created_at.desc())
    if limit:
        query = query.limit(limit)
    return query.all()

@router.get("/blog/all", response_model=List[BlogPostOut])
def get_all_blog_posts_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()

@router.get("/blog/{slug_or_id}", response_model=BlogPostOut)
def get_blog_post(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        post = db.query(BlogPost).filter(BlogPost.id == int(slug_or_id)).first()
    else:
        post = db.query(BlogPost).filter(BlogPost.slug == slug_or_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.post("/blog", response_model=BlogPostOut, status_code=status.HTTP_201_CREATED)
def create_blog_post(post_in: BlogPostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = BlogPost(**post_in.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.put("/blog/{post_id}", response_model=BlogPostOut)
def update_blog_post(post_id: int, post_in: BlogPostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    for k, v in post_in.model_dump().items():
        setattr(post, k, v)
    db.commit()
    db.refresh(post)
    return post

@router.delete("/blog/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog_post(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(post)
    db.commit()
    return None

# --- Gallery ---
@router.get("/gallery", response_model=List[GalleryAlbumOut])
def get_gallery_albums(db: Session = Depends(get_db)):
    return db.query(GalleryAlbum).order_by(GalleryAlbum.sort_order.asc()).all()

@router.post("/gallery/albums", response_model=GalleryAlbumOut, status_code=status.HTTP_201_CREATED)
def create_gallery_album(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    album = GalleryAlbum(
        name_en=data["name_en"],
        name_hi=data["name_hi"],
        slug=data["slug"],
        description_en=data.get("description_en"),
        description_hi=data.get("description_hi"),
        sort_order=data.get("sort_order", 0)
    )
    db.add(album)
    db.commit()
    db.refresh(album)
    return album

@router.post("/gallery/photos", response_model=GalleryPhotoOut, status_code=status.HTTP_201_CREATED)
def add_gallery_photo(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    photo = GalleryPhoto(
        album_id=data["album_id"],
        caption_en=data.get("caption_en"),
        caption_hi=data.get("caption_hi"),
        image_url=data["image_url"],
        sort_order=data.get("sort_order", 0)
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo

@router.delete("/gallery/photos/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_photo(photo_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    photo = db.query(GalleryPhoto).filter(GalleryPhoto.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    db.delete(photo)
    db.commit()
    return None

# --- Testimonials ---
@router.get("/testimonials", response_model=List[TestimonialOut])
def get_testimonials(featured: Optional[bool] = None, db: Session = Depends(get_db)):
    query = db.query(Testimonial).filter(Testimonial.is_approved == True)
    if featured is not None:
        query = query.filter(Testimonial.is_featured == featured)
    return query.order_by(Testimonial.created_at.desc()).all()

@router.get("/testimonials/all", response_model=List[TestimonialOut])
def get_all_testimonials_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()

@router.post("/testimonials", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
def create_testimonial(test_in: TestimonialCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    test = Testimonial(**test_in.model_dump())
    db.add(test)
    db.commit()
    db.refresh(test)
    return test

@router.put("/testimonials/{test_id}", response_model=TestimonialOut)
def update_testimonial(test_id: int, data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    test = db.query(Testimonial).filter(Testimonial.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for k, v in data.items():
        if hasattr(test, k):
            setattr(test, k, v)
    db.commit()
    db.refresh(test)
    return test

@router.delete("/testimonials/{test_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(test_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    test = db.query(Testimonial).filter(Testimonial.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(test)
    db.commit()
    return None

# --- FAQs ---
@router.get("/faqs", response_model=List[FAQOut])
def get_faqs(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(FAQ).filter(FAQ.is_published == True)
    if category:
        query = query.filter(FAQ.category == category)
    return query.order_by(FAQ.sort_order.asc(), FAQ.id.asc()).all()

@router.get("/faqs/all", response_model=List[FAQOut])
def get_all_faqs_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(FAQ).order_by(FAQ.sort_order.asc(), FAQ.id.asc()).all()

@router.post("/faqs", response_model=FAQOut, status_code=status.HTTP_201_CREATED)
def create_faq(faq_in: FAQCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faq = FAQ(**faq_in.model_dump())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq

@router.put("/faqs/{faq_id}", response_model=FAQOut)
def update_faq(faq_id: int, faq_in: FAQCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for k, v in faq_in.model_dump().items():
        setattr(faq, k, v)
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/faqs/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(faq_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    db.delete(faq)
    db.commit()
    return None

# --- Certificates ---
@router.get("/certificates", response_model=List[CertificateOut])
def get_certificates(db: Session = Depends(get_db)):
    return db.query(Certificate).filter(Certificate.is_published == True).order_by(Certificate.sort_order.asc()).all()

@router.get("/certificates/all", response_model=List[CertificateOut])
def get_all_certificates_admin(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Certificate).order_by(Certificate.sort_order.asc()).all()

@router.post("/certificates", response_model=CertificateOut, status_code=status.HTTP_201_CREATED)
def create_certificate(cert_in: CertificateCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cert = Certificate(**cert_in.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert

@router.delete("/certificates/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(cert_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(cert)
    db.commit()
    return None

# --- Contact Messages ---
@router.post("/contact", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_contact(msg_in: ContactMessageCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(**msg_in.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@router.get("/contact/messages", response_model=List[ContactMessageOut])
def get_contact_messages(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()

@router.put("/contact/messages/{msg_id}")
def mark_contact_message(msg_id: int, data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if "is_read" in data:
        msg.is_read = data["is_read"]
    if "notes" in data:
        msg.notes = data["notes"]
    db.commit()
    return {"message": "Updated successfully"}

# --- Search ---
@router.get("/search")
def search_site(q: str, db: Session = Depends(get_db)):
    term = f"%{q}%"
    products = db.query(Product).filter(
        Product.is_active == True,
        or_(
            Product.name_en.ilike(term),
            Product.name_hi.ilike(term),
            Product.code.ilike(term),
            Product.description_en.ilike(term)
        )
    ).all()
    
    events = db.query(EventNews).filter(
        EventNews.is_published == True,
        or_(
            EventNews.title_en.ilike(term),
            EventNews.title_hi.ilike(term),
            EventNews.excerpt_en.ilike(term)
        )
    ).all()
    
    blogs = db.query(BlogPost).filter(
        BlogPost.is_published == True,
        or_(
            BlogPost.title_en.ilike(term),
            BlogPost.title_hi.ilike(term),
            BlogPost.summary_en.ilike(term)
        )
    ).all()
    
    return {
        "query": q,
        "products": [{"id": p.id, "code": p.code, "name_en": p.name_en, "name_hi": p.name_hi, "mrp": p.mrp, "image_url": p.image_url} for p in products],
        "events": [{"id": e.id, "slug": e.slug, "title_en": e.title_en, "title_hi": e.title_hi, "event_date": e.event_date} for e in events],
        "blogs": [{"id": b.id, "slug": b.slug, "title_en": b.title_en, "title_hi": b.title_hi, "summary_en": b.summary_en} for b in blogs]
    }

