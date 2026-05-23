import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, AlertCircle, ThumbsUp, MessageSquare, Star, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // Poll the backend until reviews are populated
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/analytics/${id}`);
        // If product is still "Scraping in progress...", keep polling
        if (response.data.product && response.data.product.name !== "Scraping in progress...") {
            setData(response.data);
            setLoading(false);
        } else {
            // Still scraping, poll again in 3 seconds
            setTimeout(fetchData, 3000);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Only stop loading if it's not a 404 meaning it's still being created
        if(error.response?.status !== 404) {
            setLoading(false);
        } else {
            setTimeout(fetchData, 3000);
        }
      }
    };
    
    fetchData();
  }, [id]);

  if (loading || !data) {
    return (
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Analyzing Reviews...</h2>
                <p className="text-gray-600">Our AI agents are scraping and processing the data. This may take a minute.</p>
            </div>
        </div>
    );
  }

  const { product, total_reviews, average_rating, positive_percentage, negative_percentage, neutral_percentage, sentiment_timeline, reviews, ai_summary } = data;

  const sentimentData = [
    { name: 'Positive', value: positive_percentage, color: '#10B981' },
    { name: 'Neutral', value: neutral_percentage, color: '#F59E0B' },
    { name: 'Negative', value: negative_percentage, color: '#EF4444' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Product Analytics</h1>
          <p className="text-gray-500">{product.name}</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 clay-btn hover:scale-105 cursor-pointer">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Reviews" value={total_reviews.toLocaleString()} icon={<MessageSquare className="w-5 h-5 text-primary" />} />
        <MetricCard title="Average Rating" value={`${average_rating} / 5`} icon={<Star className="w-5 h-5 text-yellow-400" />} />
        <MetricCard title="Positive Sentiment" value={`${positive_percentage}%`} icon={<ThumbsUp className="w-5 h-5 text-secondary" />} />
        <MetricCard title="Critical Issues" value={`${negative_percentage}%`} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="clay-card p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Sentiment Distribution</h3>
          <div className="h-64">
            {total_reviews > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '1rem', color: '#1a202c' }} />
              </PieChart>
            </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No data</div>
            )}
          </div>
          <div className="flex justify-center gap-4 text-sm mt-4">
            {sentimentData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </div>

        <div className="clay-card p-6 col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Sentiment Timeline</h3>
          <div className="h-64">
            {sentiment_timeline && sentiment_timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentiment_timeline}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[0, 5]} stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '1rem', color: '#1a202c' }} />
                <Area type="monotone" dataKey="sentiment" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSentiment)" />
              </AreaChart>
            </ResponsiveContainer>
            ) : (
                 <div className="h-full flex items-center justify-center text-gray-500">Timeline data not available</div>
            )}
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="clay-card p-6 border-l-4 border-l-accent">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Sparkles className="w-5 h-5 text-accent" /> AI Generated Summary
        </h3>
        <p className="mb-6 text-gray-600 italic">"{ai_summary.verdict}"</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-secondary font-medium mb-2">Most Praised Features</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {ai_summary.pros.map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-red-500 font-medium mb-2">Common Complaints</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {ai_summary.cons.map((con, i) => <li key={i}>{con}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-gray-300/30">
          <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>
        </div>
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-white/30 text-sm sticky top-0 text-gray-600">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium w-1/2">Review</th>
                <th className="p-4 font-medium">Sentiment</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300/30 text-gray-700">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-white/40 transition-colors">
                  <td className="p-4 whitespace-nowrap font-medium text-gray-800">{review.username}</td>
                  <td className="p-4"><StarRating rating={review.rating} /></td>
                  <td className="p-4 text-sm text-gray-600">{review.review}</td>
                  <td className="p-4">
                    <SentimentBadge sentiment={review.sentiment} conf={review.confidence} />
                  </td>
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{review.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className="clay-card p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="p-3 bg-white/50 rounded-xl shadow-inner">{icon}</div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function SentimentBadge({ sentiment, conf }) {
  const colors = {
    positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    neutral: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    negative: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex px-2 py-1 text-xs rounded-full border ${colors[sentiment] || colors.neutral} capitalize w-fit`}>
        {sentiment}
      </span>
      <span className="text-[10px] text-gray-500">{(conf * 100).toFixed(1)}% conf</span>
    </div>
  );
}
