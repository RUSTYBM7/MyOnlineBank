import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassSurface, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useStore();
  const [email, setEmail] = useState('admin@orbitpay.com');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleCredentials = () => {
    if (password.length < 4) {
      setError('Invalid credentials');
      return;
    }
    setError('');
    setStep('2fa');
  };

  const handle2FA = () => {
    if (totp.length !== 6) {
      setError('Enter 6-digit code');
      return;
    }
    setError('');

    const admin = {
      id: 'admin_1',
      userId: 'adm1',
      email: 'admin@orbitpay.com',
      fullName: 'System Admin',
      role: 'super_admin' as const,
      permissions: ['all'],
      lastLogin: new Date().toISOString(),
      ipWhitelist: ['192.168.1.100'],
      isOnline: true,
      avatar: 'https://i.pravatar.cc/150?u=admin1',
    };

    loginAdmin(admin);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-blob-green pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 orbit-ring opacity-20 animate-[spin-slow_20s_linear_infinite]" />
      <div className="absolute bottom-20 right-20 w-48 h-48 orbit-ring opacity-15 animate-[spin-slow_25s_linear_infinite_reverse]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-medium text-[#0A0A0A]">Admin Portal</h1>
          <p className="text-sm text-[#0A0A0A]/50 mt-1">OrbitPay Credit Union Management</p>
        </div>

        <GlassSurface className="p-8 rounded-3xl">
          {step === 'credentials' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input px-4 py-3.5 rounded-xl text-[#0A0A0A]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full glass-input px-4 py-3.5 pr-12 rounded-xl text-[#0A0A0A]"
                    onKeyDown={(e) => e.key === 'Enter' && handleCredentials()}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/30"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-[#FF6B6B]">{error}</p>}
              <GlassButton variant="primary" fullWidth size="lg" onClick={handleCredentials} className="rounded-2xl">
                Continue
              </GlassButton>
              <button
                onClick={() => navigate('/')}
                className="w-full text-center text-sm text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors"
              >
                Back to user app
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <Lock className="w-10 h-10 text-[#0A0A0A]/30 mx-auto mb-3" />
                <p className="text-sm text-[#0A0A0A]/60">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              <div>
                <label className="block text-sm text-[#0A0A0A]/60 mb-2">2FA Code</label>
                <input
                  type="text"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full glass-input px-4 py-3.5 rounded-xl text-[#0A0A0A] text-center text-2xl tracking-[0.5em] font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handle2FA()}
                />
              </div>
              {error && <p className="text-sm text-[#FF6B6B]">{error}</p>}
              <GlassButton variant="primary" fullWidth size="lg" onClick={handle2FA} className="rounded-2xl">
                Verify & Login
              </GlassButton>
              <button
                onClick={() => setStep('credentials')}
                className="w-full text-center text-sm text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors"
              >
                Back to credentials
              </button>
            </div>
          )}
        </GlassSurface>
      </motion.div>
    </div>
  );
}
