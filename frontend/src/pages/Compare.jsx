import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Search, ArrowRight, Scale, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function Compare() {
  const [products, setProducts] = useState([]);
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSelect1 = (id) => {
    const p = products.find(prod => prod.id === id);
    setProduct1(p);
  };

  const handleSelect2 = (id) => {
    const p = products.find(prod => prod.id === id);
    setProduct2(p);
  };

  const comparisonData = product1 && product2 ? [
    {
      name: 'Rating',
      [product1.name]: product1.average_rating,
      [product2.name]: product2.average_rating,
    },
    {
      name: 'Sentiment',
      [product1.name]: product1.sentiment_score * 5, // Scale to 5
      [product2.name]: product2.sentiment_score * 5,
    }
  ] : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-bold text-gray-800">Loading Products...</h2>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/50 rounded-2xl shadow-inner">
          <Scale className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Comparison</h1>
          <p className="text-gray-500">Compare sentiment and performance side-by-side</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product 1 Selection */}
        <div className="clay-card p-6">
          <label className="block text-sm font-medium text-gray-600 mb-4 uppercase tracking-wider">Product One</label>
          <select 
            onChange={(e) => handleSelect1(e.target.value)}
            className="w-full p-4 clay-card bg-transparent border-none focus:outline-none text-gray-800 mb-6 cursor-pointer"
          >
            <option value="">Select a product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name.substring(0, 40)}...</option>
            ))}
          </select>
          {product1 && <ProductDetails product={product1} />}
        </div>

        {/* Product 2 Selection */}
        <div className="clay-card p-6">
          <label className="block text-sm font-medium text-gray-600 mb-4 uppercase tracking-wider">Product Two</label>
          <select 
            onChange={(e) => handleSelect2(e.target.value)}
            className="w-full p-4 clay-card bg-transparent border-none focus:outline-none text-gray-800 mb-6 cursor-pointer"
          >
            <option value="">Select a product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name.substring(0, 40)}...</option>
            ))}
          </select>
          {product2 && <ProductDetails product={product2} />}
        </div>
      </div>

      {product1 && product2 && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="clay-card p-8"
        >
          <h3 className="text-xl font-bold mb-8 text-gray-800 text-center">Score Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis domain={[0, 5]} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '1rem' }} />
                <Legend />
                <Bar dataKey={product1.name} fill="#4F46E5" radius={[10, 10, 0, 0]} />
                <Bar dataKey={product2.name} fill="#8B5CF6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ProductDetails({ product }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded-full font-bold uppercase">{product.platform}</span>
      </div>
      <div className="flex justify-between items-center p-4 bg-white/30 rounded-2xl">
        <span className="text-sm text-gray-600">Rating</span>
        <div className="flex items-center gap-1 font-bold text-gray-800">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          {product.average_rating}
        </div>
      </div>
      <div className="flex justify-between items-center p-4 bg-white/30 rounded-2xl">
        <span className="text-sm text-gray-600">Sentiment Score</span>
        <div className="flex items-center gap-1 font-bold text-gray-800">
          <ThumbsUp className="w-4 h-4 text-secondary" />
          {(product.sentiment_score * 100).toFixed(1)}%
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 italic truncate">{product.url}</p>
    </motion.div>
  );
}
