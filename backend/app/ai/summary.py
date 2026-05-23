from app.ai.keywords import extract_keywords

def generate_ai_summary(reviews: list):
    positive_reviews = [r for r in reviews if r.get('sentiment') == 'positive']
    negative_reviews = [r for r in reviews if r.get('sentiment') == 'negative']
    
    pros_keywords = extract_keywords(positive_reviews, top_n=5)
    cons_keywords = extract_keywords(negative_reviews, top_n=5)
    
    pros = [f"{k['word'].capitalize()} ({k['count']} mentions)" for k in pros_keywords] if pros_keywords else []
    cons = [f"{k['word'].capitalize()} ({k['count']} mentions)" for k in cons_keywords] if cons_keywords else []
    
    if not pros and len(positive_reviews) > 0:
        pros = ["Positive feedback"]
    if not cons and len(negative_reviews) > 0:
        cons = ["Negative feedback"]
        
    if len(positive_reviews) > len(negative_reviews):
        verdict = "Overall a highly recommended product based on customer sentiment."
    elif len(negative_reviews) > len(positive_reviews):
        verdict = "Customers have significant concerns. Proceed with caution."
    else:
        verdict = "Mixed reviews. Depends on your specific use case."
        
    if not reviews:
        verdict = "Not enough reviews to form a verdict."
    
    return {
        "pros": pros,
        "cons": cons,
        "verdict": verdict
    }
