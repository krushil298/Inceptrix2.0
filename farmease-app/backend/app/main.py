"""
FarmEase Backend — FastAPI Entry Point
─────────────────────────────────────
Serves ML prediction endpoints, weather proxy, and marketplace CRUD.
Run with:  uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import disease, crop, fertilizer, weather, marketplace

settings = get_settings()

# ── App instance ──────────────────────────────────────────────
app = FastAPI(
    title="FarmEase API",
    description="Backend API for FarmEase — AI-powered farming assistant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS (allow mobile app to call us) ───────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ─────────────────────────────────────────
app.include_router(disease.router, prefix="/predict", tags=["Disease Detection"])
app.include_router(crop.router, prefix="/predict", tags=["Crop Recommendation"])
app.include_router(fertilizer.router, prefix="/predict", tags=["Fertilizer Advisory"])
app.include_router(weather.router, prefix="/api", tags=["Weather"])
app.include_router(marketplace.router, prefix="/api", tags=["Marketplace"])


# ── Health check ──────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "app": "FarmEase API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}
