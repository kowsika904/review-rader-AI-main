from fastapi import APIRouter, HTTPException
from app.database.connection import supabase

router = APIRouter()

@router.get("")
async def get_products():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase connection not initialized")
    
    response = supabase.table("products").select("*").order("created_at", desc=True).execute()
    return response.data

@router.get("/{product_id}")
async def get_product(product_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase connection not initialized")
        
    response = supabase.table("products").select("*").eq("id", product_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return response.data[0]
