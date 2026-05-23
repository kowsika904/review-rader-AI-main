from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from app.scraper.utils import get_webdriver
import time

def scrape_flipkart_reviews(url: str, max_reviews=50):
    driver = get_webdriver()
    reviews = []
    
    try:
        driver.get(url)
        time.sleep(2)
        
        try:
            all_reviews_link = driver.find_element(By.XPATH, "//div[contains(text(), 'All')]//parent::a")
            if all_reviews_link:
                all_reviews_link.click()
                time.sleep(2)
        except:
            pass

        while len(reviews) < max_reviews:
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            review_blocks = soup.find_all('div', class_='col EPCmJX')
            
            if not review_blocks:
                review_blocks = soup.find_all('div', class_='t-ZTKy')
                if not review_blocks:
                    break
                
            for block in review_blocks:
                if len(reviews) >= max_reviews:
                    break
                    
                text_elem = block.find('div', class_='t-ZTKy')
                text = text_elem.text.strip() if text_elem else ""

                if "READ MORE" in text:
                    text = text.replace("READ MORE", "").strip()
                    
                rating_elem = block.find('div', class_='XQDdHH')
                rating = 0.0
                if rating_elem:
                    try:
                        rating = float(rating_elem.text)
                    except:
                        pass
                
                user_elem = block.find('p', class_='_2sc7ZR')
                user = user_elem.text if user_elem else "Anonymous"
                
                date_elems = block.find_all('p', class_='_2sc7ZR')
                date = date_elems[1].text if len(date_elems) > 1 else ""
                
                if text:
                    reviews.append({
                        "username": user,
                        "rating": rating,
                        "review": text,
                        "date": date
                    })
            
            try:
                next_button = driver.find_element(By.XPATH, "//span[contains(text(), 'Next')]//parent::a")
                if next_button:
                    next_button.click()
                    time.sleep(2)
                else:
                    break
            except:
                break

        return reviews
    finally:
        driver.quit()
