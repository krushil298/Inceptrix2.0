"""
Marketplace CRUD Endpoints
──────────────────────────
GET    /api/marketplace/products          — List / search products
GET    /api/marketplace/products/{id}     — Get product detail
POST   /api/marketplace/products          — Create product (farmer)
PUT    /api/marketplace/products/{id}     — Update product
DELETE /api/marketplace/products/{id}     — Delete product
"""

from datetime import datetime
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.supabase_client import get_supabase

router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str = Field("", max_length=500)
    price: float = Field(..., gt=0)
    unit: str = Field("kg", description="e.g. kg, quintal, dozen, piece")
    quantity: float = Field(..., gt=0)
    category: str = Field(..., description="Crop category")
    image_url: Optional[str] = None
    seller_id: str = Field(..., description="User ID of the farmer")
    location: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    quantity: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    is_available: Optional[bool] = None


# ── List / Search ─────────────────────────────────────────────

@router.get("/marketplace/products")
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    seller_id: Optional[str] = Query(None, description="Filter by seller"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List marketplace products with optional filters."""
    sb = get_supabase()

    try:
        query = sb.table("products").select(
            "*, users!seller_id(name, phone, avatar_url)"
        ).eq("is_available", True)

        if category and category.lower() != "all":
            query = query.eq("category", category)
        if search:
            query = query.ilike("name", f"%{search}%")
        if min_price is not None:
            query = query.gte("price", min_price)
        if max_price is not None:
            query = query.lte("price", max_price)
        if seller_id:
            query = query.eq("seller_id", seller_id)

        query = query.order("created_at", desc=True).range(offset, offset + limit - 1)
        result = query.execute()

        return {"success": True, "products": result.data, "count": len(result.data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ── Get single product ───────────────────────────────────────

@router.get("/marketplace/products/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID with seller info."""
    sb = get_supabase()

    try:
        result = (
            sb.table("products")
            .select("*, users!seller_id(name, phone, avatar_url, farm_location)")
            .eq("id", product_id)
            .single()
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "product": result.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# ── Create product ───────────────────────────────────────────

@router.post("/marketplace/products", status_code=201)
async def create_product(product: ProductCreate):
    """Create a new marketplace listing (for farmers)."""
    sb = get_supabase()

    row = {
        "id": str(uuid4()),
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "unit": product.unit,
        "quantity": product.quantity,
        "category": product.category,
        "image_url": product.image_url,
        "seller_id": product.seller_id,
        "location": product.location,
        "is_available": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }

    try:
        result = sb.table("products").insert(row).execute()
        return {"success": True, "product": result.data[0] if result.data else row}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create product: {str(e)}")


# ── Update product ───────────────────────────────────────────

@router.put("/marketplace/products/{product_id}")
async def update_product(product_id: str, updates: ProductUpdate):
    """Update a product listing."""
    sb = get_supabase()

    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    update_data["updated_at"] = datetime.utcnow().isoformat()

    try:
        result = (
            sb.table("products")
            .update(update_data)
            .eq("id", product_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "product": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not update product: {str(e)}")


# ── Delete product ───────────────────────────────────────────

@router.delete("/marketplace/products/{product_id}")
async def delete_product(product_id: str):
    """Soft-delete a product (marks as unavailable)."""
    sb = get_supabase()

    try:
        result = (
            sb.table("products")
            .update({"is_available": False, "updated_at": datetime.utcnow().isoformat()})
            .eq("id", product_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"success": True, "message": "Product removed from marketplace"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not delete product: {str(e)}")
