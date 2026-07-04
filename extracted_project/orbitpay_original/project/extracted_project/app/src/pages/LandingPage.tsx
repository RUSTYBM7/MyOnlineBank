import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassSurface, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import { CreditCard, Shield, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', pin: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', phone: '' });

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'u1',
      email: 'sarah.chen@email.com',
      phone: '+1-555-0101',
      fullName: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      kycStatus: 'verified' as const,
      accountStatus: 'active' as const,
      tier: 'premium' as const,
      dailyLimit: 50000,
      weeklyLimit: 200000,
      monthlyLimit: 500000,
      balanceUsd: 26887.09,
      balanceEur: 22150.50,
      balanceGbp: 18920.75,
      balanceBtc: 0.45,
      btcPrice: 67540.20,
      address: '123 Market St, San Francisco, CA 94105',
      dateOfBirth: '1990-03-15',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-12-15T14:30:00Z',
      lastActive: '2024-12-20T10:15:00Z',
      isOnline: true,
    };
    login(demoUser);
    navigate('/app');
  };

  const handleAdminAccess = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-blob-green pointer-events-none" />
      
      {/* Floating Orbit Rings */}
      <div className="absolute top-20 left-10 w-64 h-64 orbit-ring opacity-30 animate-[spin-slow_20s_linear_infinite]" />
      <div className="absolute top-40 right-20 w-48 h-48 orbit-ring opacity-20 animate-[spin-slow_25s_linear_infinite_reverse]" />
      <div className="absolute bottom-32 left-1/4 w-56 h-56 orbit-ring opacity-25 animate-[spin-slow_22s_linear_infinite]" />

      {/* Starbursts */}
      <div className="absolute top-32 right-1/3">
        <Sparkles className="w-6 h-6 text-[#0A0A0A]/20" />
      </div>
      <div className="absolute top-60 left-20">
        <Sparkles className="w-5 h-5 text-[#A8E6CF]/60" />
      </div>
      <div className="absolute bottom-40 right-40">
        <Sparkles className="w-4 h-4 text-[#DDA0DD]/50" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A8E6CF] to-[#DDA0DD] flex items-center justify-center">
            <span className="text-white font-bold text-sm">OP</span>
          </div>
          <span className="font-semibold text-[#0A0A0A] text-lg">OrbitPay</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors">Personal</a>
          <a href="#" className="text-sm text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors">Business</a>
          <a href="#" className="text-sm text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors">Support</a>
          <a href="#" className="text-sm text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="text-sm text-[#0A0A0A]/70 hover:text-[#0A0A0A] transition-colors px-4 py-2"
          >
            Sign in
          </button>
          <GlassButton
            variant="gradient"
            size="sm"
            onClick={() => setShowSignup(true)}
            className="rounded-full px-5"
          >
            Open account
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleAdminAccess}
            className="rounded-full px-4"
          >
            Admin
          </GlassButton>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 pt-12 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#A8E6CF]/20 text-[#0A0A0A] text-sm font-medium mb-6">
              <Zap className="w-4 h-4" /> OrbitPay Credit Union
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-[#0A0A0A] leading-tight mb-6">
              Banking without{' '}
              <span className="font-medium">boundaries</span>
            </h1>
            <p className="text-lg text-[#0A0A0A]/60 mb-8 max-w-md leading-relaxed">
              Your trusted partner for modern banking. Seamless transfers,
              real-time crypto, and intelligent investments at your fingertips.
            </p>
            <div className="flex flex-wrap gap-4">
              <GlassButton
                variant="gradient"
                size="lg"
                onClick={handleDemoLogin}
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="rounded-full"
              >
                Get started
              </GlassButton>
              <GlassButton
                variant="default"
                size="lg"
                onClick={() => setShowLogin(true)}
                className="rounded-full"
              >
                Sign in
              </GlassButton>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-light text-[#0A0A0A]">$2.4B</p>
                <p className="text-sm text-[#0A0A0A]/50">Transactions</p>
              </div>
              <div>
                <p className="text-3xl font-light text-[#0A0A0A]">150K+</p>
                <p className="text-sm text-[#0A0A0A]/50">Users</p>
              </div>
              <div>
                <p className="text-3xl font-light text-[#0A0A0A]">99.9%</p>
                <p className="text-sm text-[#0A0A0A]/50">Uptime</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] hidden lg:block"
          >
            {/* Main Card */}
            <motion.div
              animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 z-20"
            >
              <GlassSurface className="p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-6 rounded bg-gradient-to-r from-[#A8E6CF] to-[#DDA0DD]" />
                  <CreditCard className="w-6 h-6 text-[#0A0A0A]/40" />
                </div>
                <p className="text-xs text-[#0A0A0A]/50 mb-1">Balance</p>
                <p className="text-3xl font-light text-[#0A0A0A] mb-4">$26,887.09</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F4F7C0] text-xs font-medium text-[#0A0A0A]">
                    +$421.03
                  </span>
                  <span className="text-xs text-[#0A0A0A]/40">this week</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-9 rounded-xl bg-white/30 flex items-center justify-center text-xs font-medium">Pay</div>
                  <div className="flex-1 h-9 rounded-xl bg-white/30 flex items-center justify-center text-xs font-medium">Transfer</div>
                  <div className="flex-1 h-9 rounded-xl bg-white/30 flex items-center justify-center text-xs font-medium">Top Up</div>
                </div>
              </GlassSurface>
            </motion.div>

            {/* Floating Card 1 - Back */}
            <motion.div
              animate={{ y: [6, -6, 6], rotate: [8, 12, 8] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 right-0 w-56 z-10"
            >
              <GlassSurface className="p-4 rounded-2xl opacity-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#A8E6CF]/40 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#0A0A0A]/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A]">Security</p>
                    <p className="text-xs text-[#0A0A0A]/40">Biometric enabled</p>
                  </div>
                </div>
              </GlassSurface>
            </motion.div>

            {/* Floating Card 2 - Back */}
            <motion.div
              animate={{ y: [-6, 6, -6], rotate: [-10, -6, -10] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 left-0 w-56 z-10"
            >
              <GlassSurface className="p-4 rounded-2xl opacity-70">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#DDA0DD]/40 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-[#0A0A0A]/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A]">Multi-Currency</p>
                    <p className="text-xs text-[#0A0A0A]/40">USD, EUR, GBP, BTC</p>
                  </div>
                </div>
              </GlassSurface>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-24 grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="w-6 h-6" />, title: 'Instant Transfers', desc: 'Send money globally in seconds with zero hidden fees' },
            { icon: <Shield className="w-6 h-6" />, title: 'Bank-Grade Security', desc: 'Biometric auth, encryption, and real-time fraud detection' },
            { icon: <Globe className="w-6 h-6" />, title: 'Crypto & Fiat', desc: 'Manage both traditional currencies and crypto in one place' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <GlassSurface className="p-6 rounded-2xl h-full">
                <div className="w-12 h-12 rounded-xl bg-[#A8E6CF]/30 flex items-center justify-center text-[#0A0A0A] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-[#0A0A0A] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#0A0A0A]/50 leading-relaxed">{feature.desc}</p>
              </GlassSurface>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="glass-surface border-white/30 rounded-3xl max-w-sm">
          <div className="p-2">
            <h2 className="text-2xl font-medium text-[#0A0A0A] mb-1">Welcome back</h2>
            <p className="text-sm text-[#0A0A0A]/50 mb-6">Sign in to your OrbitPay account</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-1.5">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full glass-input px-4 py-3 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
                />
              </div>
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-1.5">PIN</label>
                <input
                  type="password"
                  value={loginForm.pin}
                  onChange={(e) => setLoginForm({ ...loginForm, pin: e.target.value })}
                  placeholder="****"
                  maxLength={4}
                  className="w-full glass-input px-4 py-3 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
                />
              </div>
              <GlassButton variant="primary" fullWidth onClick={handleDemoLogin} className="mt-2">
                Sign In
              </GlassButton>
              <button
                onClick={handleDemoLogin}
                className="w-full text-center text-sm text-[#0A0A0A]/50 hover:text-[#0A0A0A] transition-colors mt-2"
              >
                Use demo account
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <DialogContent className="glass-surface border-white/30 rounded-3xl max-w-sm">
          <div className="p-2">
            <h2 className="text-2xl font-medium text-[#0A0A0A] mb-1">Create account</h2>
            <p className="text-sm text-[#0A0A0A]/50 mb-6">Join OrbitPay Credit Union today</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full glass-input px-4 py-3 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
                />
              </div>
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-1.5">Email</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full glass-input px-4 py-3 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
                />
              </div>
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder="+1 555 0000"
                  className="w-full glass-input px-4 py-3 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
                />
              </div>
              <GlassButton variant="gradient" fullWidth onClick={handleDemoLogin} className="mt-2">
                Create Account
              </GlassButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
