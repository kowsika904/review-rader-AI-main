from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

def analyze_distilbert(text: str):
    try:
        result = sentiment_pipeline(text[:512])[0]
        
        label = result['label'].lower()
        score = result['score']
        
        return {
            "sentiment": label,
            "confidence": score
        }
    except Exception as e:
        return {
            "sentiment": "neutral",
            "confidence": 0.0
        }
