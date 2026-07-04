import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import {
  Shield, Lock, Fingerprint, Smartphone, Eye, EyeOff,
  ChevronRight, Check, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';

export default function SecuritySettings() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!user) return null;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const activeSessions = [
    { device: 'iPhone 16 Pro', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
    { device: 'MacBook Pro', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
    { device: 'Chrome Browser', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ];

  const securitySettings = [
    {
      id: 'password',
      title: 'Password',
      description: 'Last changed 30 days ago',
      icon: Lock,
      action: () => showToast('Opening password settings...', 'success'),
    },
    {
      id: '2fa',
      title: 'Two-Factor Authentication',
      description: twoFactor ? 'Enabled - Using SMS & Authenticator' : 'Disabled',
      icon: Shield,
      toggle: true,
      value: twoFactor,
      onToggle: () => {
        setTwoFactor(!twoFactor);
        showToast(twoFactor ? '2FA disabled' : '2FA enabled', 'success');
      },
    },
    {
      id: 'biometrics',
      title: 'Biometric Login',
      description: biometrics ? 'Face ID enabled' : 'Disabled',
      icon: Fingerprint,
      toggle: true,
      value: biometrics,
      onToggle: () => {
        setBiometrics(!biometrics);
        showToast(biometrics ? 'Biometrics disabled' : 'Biometrics enabled', 'success');
      },
    },
    {
      id: 'limits',
      title: 'Transaction Limits',
      description: `Daily limit: $${user.dailyLimit.toLocaleString()}`,
      icon: Shield,
      action: () => showToast('Opening transaction limits...', 'success'),
    },
  ];

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/settings')}
          className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 text-emerald-800 rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-emerald-800">Security Settings</h1>
          <p className="text-sm text-emerald-800/50">Protect your account</p>
        </div>
      </div>

      {/* Security Status */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-800">Account Security</p>
            <p className="text-sm text-emerald-800/70">Your account is well protected</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <p className="text-lg font-bold text-emerald-800">Strong</p>
            <p className="text-xs text-emerald-800/60">Password</p>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <p className="text-lg font-bold text-emerald-800">Enabled</p>
            <p className="text-xs text-emerald-800/60">2FA</p>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-xl">
            <p className="text-lg font-bold text-emerald-800">3</p>
            <p className="text-xs text-emerald-800/60">Sessions</p>
          </div>
        </div>
      </GlassCard>

      {/* Security Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Security Options</h3>
        {securitySettings.map((setting) => (
          <GlassCard key={setting.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <setting.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-800">{setting.title}</p>
                <p className="text-xs text-emerald-800/60">{setting.description}</p>
              </div>
              {setting.toggle ? (
                <button
                  onClick={setting.onToggle}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    setting.value ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: setting.value ? 20 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              ) : (
                <button
                  onClick={setting.action}
                  className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Active Sessions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Active Sessions</h3>
        <GlassCard className="p-4">
          <div className="space-y-3">
            {activeSessions.map((session, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/30 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-emerald-800">{session.device}</p>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full">Current</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-800/60">
                    <span>{session.location}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{session.lastActive}</span>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => showToast('Session terminated', 'success')}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast('All other sessions terminated', 'success')}
            className="w-full mt-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            Terminate All Other Sessions
          </button>
        </GlassCard>
      </div>

      {/* Login History */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Recent Login Activity</h3>
        <GlassCard className="p-4">
          <div className="space-y-3">
            {[
              { action: 'Login successful', time: 'Today, 9:45 AM', location: 'San Francisco, CA' },
              { action: 'Password changed', time: 'July 1, 2024', location: 'San Francisco, CA' },
              { action: 'New device login', time: 'June 28, 2024', location: 'New York, NY' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-800">{activity.action}</p>
                  <p className="text-xs text-emerald-800/60">{activity.time} • {activity.location}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-24 left-4 right-4 z-[200] p-4 rounded-2xl shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}
    </div>
  );
}
