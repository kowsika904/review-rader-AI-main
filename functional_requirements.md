# Functional Requirements Document

## 1. Data Acquisition
- **FR1.1:** The system shall accept a product URL from Amazon or Flipkart.
- **FR1.2:** The system shall scrape at least 20 recent reviews using a headless browser or fallback to sample data if blocked by CAPTCHA.
- **FR1.3:** The system shall extract the reviewer name, rating, review text, and review date.

## 2. AI & Natural Language Processing
- **FR2.1:** The system shall calculate the sentiment score (Positive, Negative, Neutral) of each review using Vader Sentiment Analysis.
- **FR2.2:** The system shall calculate a confidence score for the assigned sentiment.
- **FR2.3:** The system shall extract the most frequently mentioned positive keywords to generate a list of "Pros".
- **FR2.4:** The system shall extract the most frequently mentioned negative keywords to generate a list of "Cons".
- **FR2.5:** The system shall generate an overarching AI verdict based on the aggregated sentiment scores.

## 3. Data Storage
- **FR3.1:** The system shall store scraped product metadata (name, URL, average rating, overall sentiment) in a PostgreSQL `products` table.
- **FR3.2:** The system shall store individual review data (text, rating, sentiment, date) in a PostgreSQL `reviews` table linked via foreign key.

## 4. User Interface
- **FR4.1:** The dashboard shall display a Pie Chart representing the distribution of positive, negative, and neutral sentiments.
- **FR4.2:** The dashboard shall display an Area Chart mapping sentiment scores over the timeline of review dates.
- **FR4.3:** The dashboard shall present the AI-generated Pros, Cons, and Verdict.
- **FR4.4:** The dashboard shall dynamically poll the backend API until the scraping task is complete.
