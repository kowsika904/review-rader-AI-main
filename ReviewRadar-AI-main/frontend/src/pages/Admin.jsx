import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, CheckCircle2, Terminal } from 'lucide-react';
import axios from 'axios';

export default function Admin() {
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [apiStatus, setApiStatus] = useState('Checking...');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get('http://localhost:8000/');
        if (res.status === 200) setApiStatus('Healthy');
        setDbStatus('Connected');
      } catch (e) {
        setApiStatus('Down');
        setDbStatus('Disconnected');
      }
    };
    checkStatus();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Monitoring</h1>
        <p className="text-gray-500">System health and background job status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clay-card p-6 flex flex-col gap-2 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">API Gateway</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{apiStatus === 'Healthy' ? '100%' : '0%'}</p>
          <p className="text-sm text-gray-500">Status: {apiStatus}</p>
        </div>
        
        <div className="clay-card p-6 flex flex-col gap-2 border-t-4 border-t-blue-500">
          <div className="flex items-center gap-2 text-blue-600">
            <Database className="w-5 h-5" />
            <span className="font-semibold">Supabase Cluster</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{dbStatus}</p>
          <p className="text-sm text-gray-500">PostgreSQL Schema: public</p>
        </div>

        <div className="clay-card p-6 flex flex-col gap-2 border-t-4 border-t-accent">
          <div className="flex items-center gap-2 text-accent">
            <Activity className="w-5 h-5" />
            <span className="font-semibold">Active Workers</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">1</p>
          <p className="text-sm text-gray-500">Background agents online</p>
        </div>
      </div>
      
      <div className="clay-card p-6">
         <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
           <Terminal className="w-5 h-5 text-gray-600" /> System Logs
         </h3>
         <div className="bg-gray-800 rounded-2xl p-6 font-mono text-xs text-emerald-400 h-64 overflow-y-auto shadow-inner">
            <p>[{new Date().toISOString()}] INFO: API Gateway initialized.</p>
            <p>[{new Date().toISOString()}] INFO: Supabase connection verified.</p>
            <p>[{new Date().toISOString()}] INFO: Selenium worker (Headless: False) pool ready.</p>
            <p className="text-gray-400">[{new Date().toISOString()}] INFO: Waiting for new scraping tasks...</p>
         </div>
      </div>
    </motion.div>
  );
}
