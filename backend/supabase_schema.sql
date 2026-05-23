-- Create the products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    average_rating FLOAT DEFAULT 0.0,
    sentiment_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    rating FLOAT NOT NULL,
    review TEXT NOT NULL,
    sentiment TEXT DEFAULT 'neutral',
    confidence FLOAT DEFAULT 0.0,
    is_fake BOOLEAN DEFAULT FALSE,
    date TEXT
);

-- Set up Row Level Security (RLS)
-- For simplicity in development, we will allow anon read/write.
-- In production, you should restrict this.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all operations for reviews" ON public.reviews FOR ALL USING (true);
