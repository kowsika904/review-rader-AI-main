import { Search, ArrowRight, Star, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function Landing() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if(url) {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/scrape', { url });
            navigate(`/dashboard/${response.data.product_id}`);
        } catch (error) {
            console.error("Scraping error:", error);
            alert("Failed to start scraping. Please check the URL.");
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full clay-card text-sm text-gray-600 font-medium"
      >
        <Sparkles className="w-4 h-4 text-accent" />
        <span>Vader + DistilBERT Powered Analysis</span>
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-800">
        Unlock <span className="text-primary">Product Intelligence</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-12">
        Paste any Amazon or Flipkart product URL to instantly scrape reviews, analyze sentiment, and extract actionable business insights using AI.
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-3xl relative mb-24">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-500" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="block w-full pl-12 pr-40 py-5 clay-card text-lg text-gray-800 placeholder-gray-400 focus:outline-none transition-all"
          placeholder="https://www.amazon.com/dp/B0..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-2 right-2 px-6 clay-btn-primary flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Initializing..." : <>Analyze <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          icon={<Star className="w-8 h-8 text-yellow-400" />}
          title="Sentiment Analysis"
          description="Classify reviews into positive, negative, or neutral with state-of-the-art NLP models."
        />
        <FeatureCard 
          icon={<Zap className="w-8 h-8 text-primary" />}
          title="AI Summarization"
          description="Get instant pros, cons, and a final verdict without reading thousands of reviews."
        />
        <FeatureCard 
          icon={<TrendingUp className="w-8 h-8 text-secondary" />}
          title="Trend Tracking"
          description="Visualize customer sentiment over time and identify common complaints."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="clay-card p-6 text-left hover:scale-105 transition-transform duration-300">
      <div className="mb-4 bg-white/50 w-14 h-14 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Sparkles(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
