// 404 / Catch-all page
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass, Satellite } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 text-emerald-500/5"
        >
          <Compass className="w-[600px] h-[600px]" />
        </motion.div>
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <Satellite className="w-16 h-16 text-emerald-400 animate-pulse" />
            <span className="text-8xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">404</span>
          </div>
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-4">Lost in orbit</h1>
        <p className="text-lg text-slate-400 mb-10">
          The page you're looking for has drifted beyond our reach. Let's get you back to your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-xl hover:bg-emerald-400 transition inline-flex items-center gap-2">
            <Home className="w-4 h-4" /> Back to home
          </Link>
          <Link to="/app/dashboard" className="px-6 py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800/50 transition inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
