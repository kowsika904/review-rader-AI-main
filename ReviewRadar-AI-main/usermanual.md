# User Manual: ReviewRadar AI

## Overview
ReviewRadar AI is a powerful analytics dashboard that allows you to instantly extract actionable business intelligence from e-commerce product reviews.

## How to Use the Platform

### Step 1: Submitting a URL
1. Navigate to the Landing Page.
2. Locate an Amazon or Flipkart product you wish to analyze.
3. Copy the full URL of the product page.
4. Paste the URL into the search bar and click the **Analyze** button.

### Step 2: The Analysis Phase
- Once you click Analyze, the system will redirect you to the Dashboard.
- You will see an "Analyzing Reviews..." loading screen. 
- **Please wait:** Our background agents are currently navigating the internet, bypassing bot detection, reading the reviews, and feeding them through our Natural Language Processing models. This can take up to 30 seconds.

### Step 3: Interpreting the Dashboard
Once the data is loaded, the Claymorphism dashboard will appear.
- **Metric Cards:** At the top, you will see aggregate statistics: Total Reviews scraped, Average Rating, Positive Sentiment Percentage, and Critical Issues Percentage.
- **Sentiment Distribution:** A pie chart breaking down exactly how many reviews were Positive, Neutral, or Negative.
- **Sentiment Timeline:** An area chart showing how the product's reception has changed over time.
- **AI Summary:** A completely automated list of the Most Praised Features and Common Complaints based on keyword frequency extraction.
- **Raw Data Table:** A searchable table at the bottom containing the raw text, star rating, and AI sentiment classification of every individual review.

## Troubleshooting
- **No Reviews Found:** If the dashboard immediately loads but all metrics are 0, it means the platform successfully blocked the scraper. The system will inject realistic sample data so you can still view the dashboard layout, but the data is not live.
- **Infinite Loading:** If the system loads forever, ensure your Supabase database is connected and your FastAPI backend is running.
