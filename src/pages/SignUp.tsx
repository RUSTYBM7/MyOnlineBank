// OrbitPay Member Portal — Sign Up
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Loader2,
  Landmark, CheckCircle2, Shield, AlertCircle, ChevronRight,
} from 'lucide-react';
import { useStore } from '@/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SignUp() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const update = (key: string, val: any) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.agree) {
      setError('Please agree to terms and conditions');
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              first_name: form.firstName,
              last_name: form.lastName,
              phone: form.phone,
            },
          },
        });
        if (err) throw err;
        if (data.user) {
          login({
            id: data.user.id,
            fullName: `${form.firstName} ${form.lastName}`,
            email: form.email,
            phone: form.phone,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.firstName}${form.lastName}`,
            kycStatus: 'pending',
            memberSince: new Date().toISOString().split('T')[0],
            role: 'member',
          } as any);
          navigate('/app/onboarding');
          return;
        }
      }
      // Demo flow
      await new Promise(r => setTimeout(r, 600));
      login({
        id: 'new-user',
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.firstName}${form.lastName}`,
        kycStatus: 'pending',
        memberSince: new Date().toISOString().split('T')[0],
        role: 'member',
      } as any);
      navigate('/app/onboarding');
    } catch (e: any) {
      setError(e.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">OrbitPay</p>
              <p className="text-emerald-400 text-xs font-medium tracking-wider uppercase">Credit Union</p>
            </div>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create your account</h1>
          <p className="text-slate-400 mb-8">Open a free OrbitPay account in under 60 seconds</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${step >= i ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            ))}
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">First name</label>
                    <input type="text" value={form.firstName} onChange={(e) => update('firstName', e.target.value)}
                      required className="w-full px-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition" placeholder="Aisha" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Last name</label>
                    <input type="text" value={form.lastName} onChange={(e) => update('lastName', e.target.value)}
                      required className="w-full px-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition" placeholder="Okoro" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                      required className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Phone (with country code)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                      required className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition" placeholder="+1 555 0100" />
                  </div>
                </div>
                <button type="button" onClick={() => setStep(2)}
                  disabled={!form.firstName || !form.lastName || !form.email || !form.phone}
                  className="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)}
                      required className="w-full pl-12 pr-12 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition" placeholder="At least 12 characters" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${form.password.length >= 12 ? 'bg-emerald-500 w-full' : form.password.length >= 8 ? 'bg-amber-500 w-2/3' : 'bg-red-500 w-1/3'}`} />
                    </div>
                    <span className="text-xs text-slate-500">{form.password.length >= 12 ? 'Strong' : form.password.length >= 8 ? 'OK' : 'Weak'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                      required className="w-full pl-12 pr-4 py-3.5 bg-slate-900/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition" placeholder="Re-enter password" />
                  </div>
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </div>
                  )}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <button type="button" onClick={() => update('agree', !form.agree)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${form.agree ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}>
                    {form.agree && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-sm text-slate-400">
                    I agree to the <Link to="/terms" className="text-emerald-400 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800/50 transition">
                    Back
                  </button>
                  <button type="submit" disabled={loading || !form.agree || form.password !== form.confirmPassword}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : <>Create <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="mt-8 text-center text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1">
              Sign in <ChevronRight className="w-3 h-3" />
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-emerald-900/40 via-slate-900 to-teal-900/30 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative z-10 px-16 max-w-xl">
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Join OrbitPay in <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">60 seconds.</span>
          </h2>
          <ul className="space-y-4 text-slate-300">
            {['No monthly fees', '$250K FDIC-equivalent insurance', 'Convert in 18 currencies', 'Send free wires up to $50K/mo', 'Card shipped in 1 business day'].map((b, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
