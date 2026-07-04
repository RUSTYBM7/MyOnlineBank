import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/glass';
import {
  Lock, Eye, EyeOff, Globe, Shield, ChevronRight,
  Check, CheckCircle2, AlertTriangle
} from 'lucide-react';

export default function PrivacySettings() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    showBalance: false,
    showTransactions: false,
    allowSearch: false,
    dataAnalytics: true,
    marketingTracking: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSetting = (key: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    showToast('Privacy setting updated', 'success');
  };

  const privacyOptions = [
    {
      id: 'profile',
      title: 'Profile Visibility',
      description: 'Control who can see your profile',
      icon: <Globe className="w-5 h-5" />,
      type: 'selector',
      options: ['Private', 'Friends Only', 'Public'],
      current: privacySettings.profileVisibility,
      onChange: (value: string) => {
        setPrivacySettings(prev => ({ ...prev, profileVisibility: value.toLowerCase() }));
        showToast('Profile visibility updated', 'success');
      },
    },
    {
      id: 'showBalance',
      title: 'Show Account Balance',
      description: 'Display balance on profile',
      icon: <Eye className="w-5 h-5" />,
      type: 'toggle',
      value: privacySettings.showBalance,
      onToggle: () => toggleSetting('showBalance'),
    },
    {
      id: 'showTransactions',
      title: 'Transaction History',
      description: 'Allow others to view transactions',
      icon: <Shield className="w-5 h-5" />,
      type: 'toggle',
      value: privacySettings.showTransactions,
      onToggle: () => toggleSetting('showTransactions'),
    },
    {
      id: 'allowSearch',
      title: 'Searchability',
      description: 'Allow found by phone/email',
      icon: <Globe className="w-5 h-5" />,
      type: 'toggle',
      value: privacySettings.allowSearch,
      onToggle: () => toggleSetting('allowSearch'),
    },
  ];

  const dataOptions = [
    {
      id: 'dataAnalytics',
      title: 'Data Analytics',
      description: 'Help improve our services',
      icon: <Shield className="w-5 h-5" />,
      type: 'toggle',
      value: privacySettings.dataAnalytics,
      onToggle: () => toggleSetting('dataAnalytics'),
    },
    {
      id: 'marketingTracking',
      title: 'Marketing Tracking',
      description: 'Personalized recommendations',
      icon: <Globe className="w-5 h-5" />,
      type: 'toggle',
      value: privacySettings.marketingTracking,
      onToggle: () => toggleSetting('marketingTracking'),
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
          <h1 className="text-xl font-bold text-emerald-800">Privacy</h1>
          <p className="text-sm text-emerald-800/50">Control your privacy settings</p>
        </div>
      </div>

      {/* Privacy Status */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-800">Privacy Status</p>
            <p className="text-sm text-emerald-800/70">Your data is protected</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </GlassCard>

      {/* Privacy Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Profile Privacy</h3>
        {privacyOptions.map((option) => (
          <GlassCard key={option.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                {option.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-800">{option.title}</p>
                <p className="text-xs text-emerald-800/60">{option.description}</p>
              </div>
              {option.type === 'toggle' ? (
                <button
                  onClick={option.onToggle}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    option.value ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: option.value ? 20 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              ) : (
                <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  {option.current.charAt(0).toUpperCase() + option.current.slice(1)}
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Data & Analytics */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Data & Analytics</h3>
        <GlassCard className="p-4">
          <div className="space-y-4">
            {dataOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-emerald-800">{option.title}</p>
                  <p className="text-xs text-emerald-800/60">{option.description}</p>
                </div>
                <button
                  onClick={option.onToggle}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    option.value ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <motion.div
                    animate={{ x: option.value ? 20 : 0 }}
                    className="w-5 h-5 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Data Management */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Data Management</h3>
        <GlassCard className="p-4">
          <div className="space-y-3">
            <button
              onClick={() => showToast('Downloading your data...', 'success')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-emerald-50 transition-colors"
            >
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Download My Data</span>
            </button>
            <button
              onClick={() => showToast('Data deletion requested', 'success')}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Lock className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Request Data Deletion</span>
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Privacy Policy */}
      <GlassCard className="p-4">
        <button className="w-full flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Lock className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-emerald-800">Privacy Policy</p>
            <p className="text-xs text-emerald-800/60">Last updated: January 2024</p>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-800/40" />
        </button>
      </GlassCard>

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
