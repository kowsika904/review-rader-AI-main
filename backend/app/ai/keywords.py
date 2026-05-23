import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import string

try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def extract_keywords(reviews: list, top_n=10):
    text = " ".join([r['review'] for r in reviews])
    text = text.lower()
    
    try:
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        punctuation = set(string.punctuation)
        
        filtered_tokens = [w for w in tokens if not w in stop_words and not w in punctuation and len(w) > 2]
        count = Counter(filtered_tokens)
        
        return [{"word": word, "count": freq} for word, freq in count.most_common(top_n)]
    except Exception as e:
        print(f"Keyword extraction failed: {e}")
        return []
