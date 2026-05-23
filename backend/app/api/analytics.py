from fastapi import APIRouter, HTTPException
from app.database.connection import supabase
from app.ai.summary import generate_ai_summary

router = APIRouter()

@router.get("/{product_id}")
async def get_analytics(product_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase connection not initialized")
        
    product_res = supabase.table("products").select("*").eq("id", product_id).execute()
    if not product_res.data:
        raise HTTPException(status_code=404, detail="Product not found")
    product = product_res.data[0]
    
    reviews_res = supabase.table("reviews").select("*").eq("product_id", product_id).execute()
    reviews = reviews_res.data
    
    total_reviews = len(reviews)
    if total_reviews == 0:
        return {
            "product": product,
            "total_reviews": 0,
            "average_rating": 0,
            "positive_percentage": 0,
            "negative_percentage": 0,
            "neutral_percentage": 0,
            "sentiment_timeline": [],
            "reviews": [],
            "ai_summary": {"pros": [], "cons": [], "verdict": "No reviews scraped yet."}
        }
        
    positive_count = sum(1 for r in reviews if r['sentiment'] == 'positive')
    negative_count = sum(1 for r in reviews if r['sentiment'] == 'negative')
    neutral_count = sum(1 for r in reviews if r['sentiment'] == 'neutral')
    
    timeline_data = [
        {"date": "1", "sentiment": 3.0},
        {"date": "2", "sentiment": 4.0},
        {"date": "3", "sentiment": product['average_rating']}
    ]
    
    ai_summary = generate_ai_summary(reviews)
    
    return {
        "product": product,
        "total_reviews": total_reviews,
        "average_rating": round(product['average_rating'], 1),
        "positive_percentage": round((positive_count / total_reviews) * 100, 1),
        "negative_percentage": round((negative_count / total_reviews) * 100, 1),
        "neutral_percentage": round((neutral_count / total_reviews) * 100, 1),
        "sentiment_timeline": timeline_data,
        "reviews": reviews,
        "ai_summary": ai_summary
    }
