from datetime import datetime, timedelta
import random

SAMPLE_REVIEWS_TEMPLATE = [
    # Positive
    ("Rohan Sharma", 5.0, "Absolutely love this product! The build quality is exceptional and it works exactly as described. Highly recommend to everyone.", "Amazon"),
    ("Priya Nair", 5.0, "Best purchase I've made this year. Fast delivery, excellent packaging, and the product quality is top-notch. Will definitely buy again!", "Flipkart"),
    ("Arjun Mehta", 4.0, "Great product for the price. Performance is smooth and battery life is impressive. Minor UI issues but overall very satisfied.", "Amazon"),
    ("Sneha Patel", 5.0, "Outstanding quality! I was skeptical at first but this exceeded all my expectations. The features are amazing and it works flawlessly.", "Flipkart"),
    ("Vikram Singh", 4.0, "Very good product. Setup was easy, performance is great. Slight delay in delivery but customer support was helpful.", "Amazon"),
    ("Deepika Iyer", 5.0, "Perfect product! Exactly what I was looking for. The design is sleek, performance is excellent. Worth every rupee spent.", "Flipkart"),
    ("Karthik Rajan", 4.0, "Solid build quality and good performance. Battery lasts all day. Happy with this purchase, good value for money.", "Amazon"),
    ("Ananya Gupta", 5.0, "Incredible product! The quality surpassed my expectations. Fast shipping and great packaging. Will recommend to friends and family.", "Flipkart"),
    # Negative
    ("Amit Joshi", 1.0, "Terrible experience. Product stopped working within a week. Customer support is unresponsive. Complete waste of money. Avoid at all costs!", "Amazon"),
    ("Kavya Reddy", 2.0, "Very disappointed. The product doesn't match the description at all. Poor build quality and it heats up excessively. Not recommended.", "Flipkart"),
    ("Rajesh Kumar", 1.0, "Worst purchase ever! Product arrived broken. Return process is a nightmare. Quality is extremely poor. Don't waste your money.", "Amazon"),
    ("Meena Krishnan", 2.0, "Not good at all. Stopped working after 3 uses. Build quality is very cheap. Expected much better for this price range.", "Flipkart"),
    # Neutral
    ("Suresh Verma", 3.0, "Average product. Does what it claims but nothing extraordinary. Build quality is okay. Might be suitable for basic use but nothing special.", "Amazon"),
    ("Lakshmi Pillai", 3.0, "Decent product for everyday use. Some features work well, others not so much. Packaging was good. Overall an average experience.", "Flipkart"),
    ("Ganesh Murugan", 3.0, "It's okay. Not the best but not the worst. Does the job for basic tasks. The price point could be better for what you get.", "Amazon"),
    ("Pooja Agarwal", 3.0, "Mixed feelings about this product. Some aspects are good, some are mediocre. Customer service needs improvement. Would only recommend if on sale.", "Flipkart"),
    # More varied
    ("Rahul Desai", 5.0, "Excellent! The product quality is phenomenal. Lightning fast performance, beautiful design. Best in its class. Zero complaints.", "Amazon"),
    ("Nisha Kapoor", 4.0, "Really good product overall. Few minor issues with connectivity but nothing major. Looks premium and feels great to use. Satisfied.", "Flipkart"),
    ("Sunil Tiwari", 1.0, "Pathetic quality. Received a defective unit. Company refuses refund. Extremely frustrated. Would give zero stars if I could.", "Amazon"),
    ("Divya Menon", 5.0, "Superb product! Exceeded expectations in every way. Great battery, stunning display, smooth performance. Totally worth the price.", "Flipkart"),
]

def generate_sample_reviews(product_name="Product"):
    """
    Generate realistic-looking sample reviews when scraping fails.
    Timestamps are spread over the last 60 days.
    """
    reviews = []
    now = datetime.utcnow()

    for i, (name, rating, text, source) in enumerate(SAMPLE_REVIEWS_TEMPLATE):
        days_back = random.randint(0, 60)
        review_date = (now - timedelta(days=days_back)).strftime("%Y-%m-%d")

        personalised_text = text.replace("this product", f"this {product_name}")

        reviews.append({
            "username": name,
            "review": personalised_text,
            "rating": rating,
            "date": review_date,
            "source": source,
        })

    random.shuffle(reviews)
    return reviews
