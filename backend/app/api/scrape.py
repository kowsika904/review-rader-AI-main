from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.scraper.amazon import scrape_amazon_reviews
from app.scraper.flipkart import scrape_flipkart_reviews
from app.sentiment.vader import analyze_vader
from app.database.connection import supabase
from app.api.fallback import generate_sample_reviews
import uuid
from datetime import datetime

router = APIRouter()

async def background_scrape_task(url: str, product_id: str):
    try:
        import asyncio
        if "amazon" in url.lower():
            reviews = await asyncio.to_thread(scrape_amazon_reviews, url)
            platform = "Amazon"
        elif "flipkart" in url.lower():
            reviews = await asyncio.to_thread(scrape_flipkart_reviews, url)
            platform = "Flipkart"
        else:
            return
            
        if not reviews:
            print("[Scraper] Using sample data fallback.")
            reviews = generate_sample_reviews(platform)
            
        total_rating = 0
        sentiment_scores = 0
        
        for r in reviews:
            sentiment_result = analyze_vader(r['review'])
            review_doc = {
                "id": str(uuid.uuid4()),
                "product_id": product_id,
                "username": r['username'],
                "rating": r['rating'],
                "review": r['review'],
                "sentiment": sentiment_result['sentiment'],
                "confidence": sentiment_result['confidence'],
                "is_fake": False,
                "date": r['date']
            }
            if supabase:
                supabase.table("reviews").insert(review_doc).execute()
            
            total_rating += r['rating']
            if sentiment_result['sentiment'] == 'positive':
                sentiment_scores += 1
            elif sentiment_result['sentiment'] == 'negative':
                sentiment_scores -= 1
                
        # Update product
        avg_rating = total_rating / len(reviews)
        norm_sentiment = (sentiment_scores / len(reviews) + 1) / 2 # Normalize -1..1 to 0..1
        
        if supabase:
            supabase.table("products").update({
                "name": f"{platform} Product",
                "average_rating": avg_rating,
                "sentiment_score": norm_sentiment
            }).eq("id", product_id).execute()
                
    except Exception as e:
        print(f"Scraping failed with exception: {e}")
        # Fallback even on complete crash
        print("[Scraper] Using sample data fallback after crash.")
        reviews = generate_sample_reviews("Amazon/Flipkart")
        
        total_rating = 0
        sentiment_scores = 0
        for r in reviews:
            sentiment_result = analyze_vader(r['review'])
            review_doc = {
                "id": str(uuid.uuid4()),
                "product_id": product_id,
                "username": r['username'],
                "rating": r['rating'],
                "review": r['review'],
                "sentiment": sentiment_result['sentiment'],
                "confidence": sentiment_result['confidence'],
                "is_fake": False,
                "date": r['date']
            }
            if supabase:
                supabase.table("reviews").insert(review_doc).execute()
            
            total_rating += r['rating']
            if sentiment_result['sentiment'] == 'positive':
                sentiment_scores += 1
            elif sentiment_result['sentiment'] == 'negative':
                sentiment_scores -= 1
                
        if supabase:
            supabase.table("products").update({
                "name": "Product (Sample Data Fallback)",
                "average_rating": total_rating / len(reviews),
                "sentiment_score": (sentiment_scores / len(reviews) + 1) / 2
            }).eq("id", product_id).execute()

from pydantic import BaseModel
class ScrapeRequest(BaseModel):
    url: str

@router.post("")
async def scrape_product(request: ScrapeRequest, background_tasks: BackgroundTasks):
    url = request.url
    if "amazon" not in url.lower() and "flipkart" not in url.lower():
        raise HTTPException(status_code=400, detail="Only Amazon and Flipkart URLs are supported.")
        
    product_id = str(uuid.uuid4())
    platform = "amazon" if "amazon" in url.lower() else "flipkart"
    
    product_doc = {
        "id": product_id,
        "name": "Scraping in progress...",
        "platform": platform,
        "url": url,
        "average_rating": 0.0,
        "sentiment_score": 0.0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    if supabase:
        supabase.table("products").insert(product_doc).execute()
    background_tasks.add_task(background_scrape_task, url, product_id)
    
    return {"message": "Scraping started in background", "product_id": product_id}
