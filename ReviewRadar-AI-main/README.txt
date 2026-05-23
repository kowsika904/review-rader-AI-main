ReviewRadar AI Platform

A full-stack web application designed to scrape e-commerce product reviews (Amazon, Flipkart), analyze their sentiment using Natural Language Processing (Vader + DistilBERT), and present the data through a beautiful Claymorphism dashboard.

Tech Stack:
- Frontend: React, Vite, TailwindCSS (Claymorphism UI), Recharts, Framer Motion
- Backend: FastAPI, Python, Selenium, NLTK
- Database: Supabase (PostgreSQL)

Setup Instructions:
1. Install backend requirements: cd backend && pip install -r requirements.txt
2. Configure Supabase: Add SUPABASE_URL and SUPABASE_KEY to backend/.env
3. Run backend: cd backend && uvicorn main:app --reload --port 8000
4. Install frontend dependencies: cd frontend && npm install
5. Run frontend: cd frontend && npm run dev
