import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL and SUPABASE_KEY are not fully set in .env")
    supabase = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def ping_db():
    try:
        if supabase:
            response = supabase.table("products").select("*", count="exact").limit(1).execute()
            print("Pinged Supabase. You successfully connected!")
    except Exception as e:
        print(f"Supabase connection error: {e}")
