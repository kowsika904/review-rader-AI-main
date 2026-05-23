import { Outlet, Link } from 'react-router-dom';
import { Radar, Activity, BarChart2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => (
  <nav className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Radar className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ReviewRadar AI
          </span>
        </div>
        <div className="hidden md:block">
          <div className="flex items-baseline space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"><BarChart2 className="w-4 h-4"/> Dashboard</Link>
            <Link to="/compare" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Compare</Link>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"><Activity className="w-4 h-4"/> Admin</Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-surface mt-auto pt-8">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
      <p>&copy; {new Date().getFullYear()} ReviewRadar AI. All rights reserved.</p>
    </div>
  </footer>
);

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-gray-800">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
