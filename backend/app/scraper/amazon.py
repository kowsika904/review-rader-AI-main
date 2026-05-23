from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from app.scraper.utils import get_webdriver
import time

def scrape_amazon_reviews(url: str, max_reviews=50):
    driver = get_webdriver()
    reviews = []
    
    try:
        # Convert product URL to review page URL if it's not already
        if "/dp/" in url:
            dp_index = url.find("/dp/")
            base_url = url[:dp_index]
            product_id = url[dp_index+4:dp_index+14]
            review_url = f"{base_url}/product-reviews/{product_id}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
        else:
            review_url = url
            
        driver.get(review_url)
        time.sleep(2) # Initial load

        while len(reviews) < max_reviews:
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            review_blocks = soup.find_all('div', {'data-hook': 'review'})
            
            if not review_blocks:
                break
                
            for block in review_blocks:
                if len(reviews) >= max_reviews:
                    break
                    
                # Extract rating
                rating_elem = block.find('i', {'data-hook': 'review-star-rating'})
                rating = 0.0
                if rating_elem:
                    rating_text = rating_elem.text
                    try:
                        rating = float(rating_text.split(' ')[0])
                    except:
                        pass
                
                # Extract user
                user_elem = block.find('span', class_='a-profile-name')
                user = user_elem.text if user_elem else "Anonymous"
                
                # Extract date
                date_elem = block.find('span', {'data-hook': 'review-date'})
                date = date_elem.text if date_elem else ""
                
                # Extract text
                text_elem = block.find('span', {'data-hook': 'review-body'})
                text = text_elem.text.strip() if text_elem else ""
                
                if text:
                    reviews.append({
                        "username": user,
                        "rating": rating,
                        "review": text,
                        "date": date
                    })
            
            # Go to next page
            try:
                next_button = driver.find_element(By.CSS_SELECTOR, "li.a-last a")
                if next_button:
                    next_button.click()
                    time.sleep(2) # Wait for next page to load
                else:
                    break
            except:
                break # No more pages

        return reviews
    finally:
        driver.quit()
