// OrbitPay Member Portal — Standalone Sign In
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles,
  KeyRound, AlertCircle, CheckCircle2, Loader2, Landmark,
  CreditCard, Globe, Banknote, Fingerprint, ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SignIn() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const isAuth = useStore((s) => s.isAuthenticated);

  const [email, setEmail] = useState('aisha.okoro@orbitpay.demo');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricAvailable] = useState(false);

  useEffect(() => {
    if (isAuth) navigate('/app/dashboard');
  }, [isAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Try Supabase auth first
      if (isSupabaseConfigured && supabase && password) {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (!err && data.user) {
          const u = useStore.getState().user;
          login({ ...(u || {}), id: data.user.id, email: data.user.email! } as any);
          navigate('/app/dashboard');
          return;
        }
        // If Supabase rejects, fall through to demo
        console.warn('Supabase auth failed, falling back to demo:', err?.message);
      }
      // Demo fallback
      await new Promise((r) => setTimeout(r, 700));
      const u = useStore.getState().user;
      if (u) {
        login({ ...u, email: email || u.email } as any);
        navigate('/app/dashboard');
      }
    } catch (e: any) {
      setError(e.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (kind: 'personal' | 'business' | 'demo') => {
    const accounts = {
      personal: { email: 'aisha.okoro@orbitpay.demo', name: 'Aisha Okoro' },
      business: { email: 'business@orbitpay.demo', name: 'Marcus Chen' },
      demo: { email: 'demo@orbitpay.demo', name: 'Demo User' },
    };
    const a = accounts[kind];
    setEmail(a.email);
    setPassword('OrbitPay2030!');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <Landmark className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">OrbitPay</p>
              <p className="text-emerald-400 text-xs font-medium tracking-wider uppercase">Credit Union</p>
            </div>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-slate-400 mb-8">Sign in to access your OrbitPay account</p>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300 transition">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required={!isSupabaseConfigured}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setRemember(!remember)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  remember ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'
                }`}
              >
                {remember && <CheckCircle2 className="w-3 h-3 text-white" />}
              </button>
              <span className="text-sm text-slate-400">Keep me signed in for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.01] active:scale-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Biometric (decorative for now) */}
          {biometricAvailable && (
            <button
              type="button"
              className="mt-4 w-full py-3 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800/50 flex items-center justify-center gap-2 transition"
            >
              <Fingerprint className="w-4 h-4" /> Use biometrics
            </button>
          )}

          {/* Demo accounts */}
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { kind: 'personal', label: 'Personal' },
                { kind: 'business', label: 'Business' },
                { kind: 'demo', label: 'Demo' },
              ].map((a) => (
                <button
                  key={a.kind}
                  type="button"
                  onClick={() => useDemoAccount(a.kind as any)}
                  className="px-3 py-2 text-xs bg-slate-900/50 border border-slate-800 rounded-lg text-slate-300 hover:border-emerald-500/30 hover:text-emerald-300 transition"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign up */}
          <p className="mt-8 text-center text-slate-400">
            New to OrbitPay?{' '}
            <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1">
              Create an account <ChevronRight className="w-3 h-3" />
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Showcase */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-emerald-900/40 via-slate-900 to-teal-900/30 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">Trusted by 12,000+ members across 5 continents</span>
            </div>

            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Banking that moves at
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                your orbit.
              </span>
            </h2>

            <p className="text-lg text-slate-300 mb-12">
              Real-time multi-currency accounts, AI-assisted money management, and instant global transfers — all protected by enterprise-grade security.
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Regulated & Insured', desc: 'NCUA equivalent. Deposits insured to $250,000.' },
                { icon: CreditCard, title: 'Multi-currency cards', desc: 'Spend in 150+ currencies at interbank rates.' },
                { icon: Banknote, title: '0% wire transfer fees', desc: 'Up to $50,000/mo on Premium tier.' },
                { icon: KeyRound, title: 'Biometric & MFA', desc: 'FIDO2, TOTP, hardware key support.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{f.title}</p>
                    <p className="text-sm text-slate-400">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 flex items-center gap-6 text-xs text-slate-500"
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> SOC2 Type II
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> PCI DSS Level 1
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Equal Housing Lender
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
