from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    platform: str
    url: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: str
    average_rating: float = 0.0
    sentiment_score: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "name": "Apple iPhone 15",
                "platform": "amazon",
                "url": "https://amazon.com/...",
                "average_rating": 4.5,
                "sentiment_score": 0.85
            }
        }
    )

class ReviewBase(BaseModel):
    product_id: str
    username: str
    rating: float
    review: str
    date: str

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: str
    sentiment: str = "neutral"
    confidence: float = 0.0
    is_fake: bool = False

    model_config = ConfigDict(populate_by_name=True)

class AnalyticsData(BaseModel):
    total_reviews: int
    positive_percentage: float
    negative_percentage: float
    neutral_percentage: float
    average_rating: float
    sentiment_timeline: List[dict]
    rating_distribution: List[dict]
    keyword_frequency: List[dict]

class AISummary(BaseModel):
    product_id: str
    pros: List[str]
    cons: List[str]
    verdict: str
