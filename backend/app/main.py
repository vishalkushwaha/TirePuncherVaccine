from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api import auth, products, quotes, distributors, content, settings as site_settings, users, upload, orders, abandoned_carts, coupons, analytics, crm
from app.database.session import Base, engine, SessionLocal
from app.database.seeder import seed_db

# Create DB tables
Base.metadata.create_all(bind=engine)

# Auto-seed initial data if not present
with SessionLocal() as db:
    seed_db(db)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="REST API and Content Management System for Tyre Puncture Vaccine (Ujjala Electricals, Bikaner)"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static media directory
app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(products.router, prefix=settings.API_V1_STR)
app.include_router(quotes.router, prefix=settings.API_V1_STR)
app.include_router(distributors.router, prefix=settings.API_V1_STR)
app.include_router(content.router, prefix=settings.API_V1_STR)
app.include_router(site_settings.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix=settings.API_V1_STR)
app.include_router(abandoned_carts.router, prefix=settings.API_V1_STR)
app.include_router(coupons.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(crm.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "firm": "Ujjala Electricals",
        "brand": "Tyre Puncture Vaccine"
    }

