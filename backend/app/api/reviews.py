from fastapi import APIRouter

router = APIRouter()

@router.get("/{product_id}")
async def get_product_reviews(product_id: str):
    return {"message": "Get reviews for product"}
