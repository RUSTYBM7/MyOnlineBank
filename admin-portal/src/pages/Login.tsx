import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock, Mail, Smartphone, AlertCircle, Loader2, Key, Clock, Copy, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { generateToken, generateSecret, getBackupCodes, getTimeRemaining } from '@/lib/mfa';

// Demo secret - in production, each user has their own secret
const DEMO_SECRET = 'JBSWY3DPEHPK3PXP';

export default function Login() {
  const { login, verifyMFA, pendingMFA, pendingEmail } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentToken, setCurrentToken] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);

  // Update token and timer every second when MFA is pending
  useEffect(() => {
    if (pendingMFA) {
      const updateToken = () => {
        setCurrentToken(generateToken(DEMO_SECRET));
        setTimeRemaining(getTimeRemaining());
      };
      updateToken();
      const interval = setInterval(updateToken, 1000);
      return () => clearInterval(interval);
    }
  }, [pendingMFA]);

  // Check if already logged in
  useEffect(() => {
    const stored = sessionStorage.getItem('orbitpay-admin-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.isAuthenticated) {
        window.location.href = '/dashboard';
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
        setLoading(false);
      } else if (result.requiresMFA) {
        setLoading(false);
      }
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');
    setLoading(true);

    try {
      const result = await verifyMFA(mfaCode);

      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        setMfaError(result.error || 'MFA verification failed');
        setLoading(false);
      }
    } catch {
      setMfaError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(currentToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const backupCodes = getBackupCodes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 mb-6"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">OrbitPay Admin</h1>
          <p className="text-slate-400">Secure Administration Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {!pendingMFA ? (
            // Standard Login Form
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="admin@orbitpay.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0" />
                  Remember me
                </label>
                <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            // MFA Verification Form
            <form onSubmit={handleMFA} className="space-y-6">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4"
                >
                  <Smartphone className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h2 className="text-xl font-semibold text-white mb-2">Two-Factor Authentication</h2>
                <p className="text-slate-400 text-sm">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* Demo Token Display */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    <Key className="w-3 h-3" />
                    Demo Current Code
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span className={`font-mono font-bold ${timeRemaining <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {timeRemaining}s
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-2xl font-mono font-bold tracking-wider flex-1">
                    {currentToken}
                  </span>
                  <button
                    type="button"
                    onClick={copyToken}
                    className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Use this code or enter from your authenticator app
                </p>
              </div>

              {/* Timer Progress Bar */}
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${timeRemaining <= 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(timeRemaining / 30) * 100}%` }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              {mfaError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {mfaError}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading || mfaCode.length !== 6}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>

              {/* Backup Codes Toggle */}
              <button
                type="button"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="w-full py-2 text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
              </button>

              {showBackupCodes && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-3">One-time backup codes (use if authenticator is unavailable)</p>
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, i) => (
                      <div key={i} className="bg-slate-900 rounded px-2 py-1 text-center">
                        <span className="text-emerald-400 font-mono text-sm">{code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2 text-slate-400 hover:text-white text-sm transition-colors"
              >
                Use a different account
              </button>
            </form>
          )}

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">
              By signing in, you agree to the security policies and terms of use.
              <br />
              All access attempts are monitored and logged.
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400 text-center mb-3 font-medium">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-emerald-400 font-medium">Super Admin</p>
              <p className="text-slate-500">admin@orbitpay.com</p>
              <p className="text-slate-500">admin123 (MFA enabled)</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <p className="text-emerald-400 font-medium">Support Agent</p>
              <p className="text-slate-500">support@orbitpay.com</p>
              <p className="text-slate-500">support123 (No MFA)</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
