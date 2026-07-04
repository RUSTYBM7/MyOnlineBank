import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  User, Shield, Smartphone, Fingerprint, Moon, Sun,
  Bell, ChevronRight, LogOut, CreditCard, MapPin, Calendar,
  Wallet, Receipt, Clock, TrendingUp, HelpCircle, MessageCircle,
  Bitcoin, BarChart3, Settings, Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout, toggleDarkMode, darkMode } = useStore();
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);

  if (!user) return null;

  // Quick access menu - moved from bottom nav and extended
  const quickAccessItems = [
    { icon: <Headphones className="w-5 h-5" />, label: 'Support Team', desc: '24/7 Help Center', action: () => navigate('/app/support') },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Investments', desc: 'Grow your wealth', action: () => navigate('/app/invest') },
    { icon: <Bitcoin className="w-5 h-5" />, label: 'Crypto Wallet', desc: 'Manage crypto assets', action: () => navigate('/app/crypto') },
    { icon: <Wallet className="w-5 h-5" />, label: 'Loans', desc: 'Manage your loans', action: () => navigate('/app/loans') },
    { icon: <Receipt className="w-5 h-5" />, label: 'Pay Bills', desc: 'Bill payments', action: () => navigate('/app/bills') },
    { icon: <Clock className="w-5 h-5" />, label: 'Scheduled', desc: 'Auto transfers', action: () => navigate('/app/scheduled') },
  ];

  const settingsItems = [
    { icon: <User className="w-5 h-5" />, label: 'Personal Info', desc: 'Name, email, phone', action: () => navigate('/app/settings/account') },
    { icon: <Shield className="w-5 h-5" />, label: 'Security', desc: 'Password, 2FA', action: () => navigate('/app/settings/security') },
    { icon: <Fingerprint className="w-5 h-5" />, label: 'Biometrics', desc: biometrics ? 'Enabled' : 'Disabled', action: () => setBiometrics(!biometrics), toggle: true, value: biometrics },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Transaction Limits', desc: `$${user.dailyLimit.toLocaleString()}/day`, action: () => navigate('/app/settings/transaction-limits') },
    { icon: <Smartphone className="w-5 h-5" />, label: 'Devices', desc: '3 active devices', action: () => navigate('/app/settings/devices') },
    { icon: <Bell className="w-5 h-5" />, label: 'Notifications', desc: notifications ? 'On' : 'Off', action: () => setNotifications(!notifications), toggle: true, value: notifications },
    { icon: darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />, label: 'Dark Mode', desc: darkMode ? 'On' : 'Off', action: toggleDarkMode, toggle: true, value: darkMode },
    { icon: <Settings className="w-5 h-5" />, label: 'App Settings', desc: 'Preferences', action: () => navigate('/app/settings') },
    { icon: <Headphones className="w-5 h-5" />, label: 'Help & Support', desc: '24/7 Live Support', action: () => navigate('/app/support') },
  ];

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-emerald-800">Profile</h1>
        <p className="text-sm text-emerald-800/50">Manage your account</p>
      </div>

      {/* Profile Card */}
      <GlassCard intensity="high" className="p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-[#A8E6CF]/40 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative inline-block"
          >
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-20 h-20 rounded-full border-3 border-white/40 mx-auto mb-3"
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#2ECC71] border-2 border-white" />
          </motion.div>
          <h2 className="text-xl font-medium text-emerald-800">{user.fullName}</h2>
          <p className="text-sm text-emerald-800/50 mb-3">{user.email}</p>
          <div className="flex items-center justify-center gap-2">
            <GlassBadge variant="mint" size="sm">
              {user.tier.toUpperCase()}
            </GlassBadge>
            <GlassBadge
              variant={user.kycStatus === 'verified' ? 'green' : user.kycStatus === 'pending' ? 'yellow' : 'red'}
              size="sm"
            >
              KYC {user.kycStatus}
            </GlassBadge>
          </div>
        </div>
      </GlassCard>

      {/* Account Stats */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 text-center">
          <p className="text-lg font-medium text-emerald-800">${(user.balanceUsd + user.balanceEur * 1.09 + user.balanceGbp * 1.27).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-emerald-800/40">Total Balance</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-lg font-medium text-emerald-800">{user.balanceBtc}</p>
          <p className="text-xs text-emerald-800/40">BTC Holdings</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-lg font-medium text-emerald-800">{user.tier === 'premium' ? '∞' : `$${user.dailyLimit.toLocaleString()}`}</p>
          <p className="text-xs text-emerald-800/40">Daily Limit</p>
        </GlassCard>
      </div>

      {/* Personal Info Summary */}
      <GlassCard className="p-5 space-y-3">
        <h3 className="font-medium text-emerald-800">Personal Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-800/60" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-emerald-800/40">Full Name</p>
              <p className="text-sm text-emerald-800">{user.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-emerald-800/60" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-emerald-800/40">Date of Birth</p>
              <p className="text-sm text-emerald-800">{user.dateOfBirth || 'Not set'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-800/60" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-emerald-800/40">Address</p>
              <p className="text-sm text-emerald-800">{user.address || 'Not set'}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Access Items - moved from bottom nav */}
      <div className="space-y-2">
        <h3 className="font-medium text-emerald-800 mb-2">Quick Access</h3>
        {quickAccessItems.map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className="w-full glass-card px-4 py-3.5 flex items-center gap-3 text-left hover:bg-white/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-emerald-800/60">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-800">{item.label}</p>
              <p className="text-xs text-emerald-800/40">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-800/30" />
          </motion.button>
        ))}
      </div>

      {/* Settings Items */}
      <div className="space-y-2">
        <h3 className="font-medium text-emerald-800 mb-2">Settings</h3>
        {settingsItems.map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className="w-full glass-card px-4 py-3.5 flex items-center gap-3 text-left hover:bg-white/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-emerald-800/60">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-800">{item.label}</p>
              <p className="text-xs text-emerald-800/40">{item.desc}</p>
            </div>
            {item.toggle ? (
              <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                item.value ? 'bg-[#A8E6CF]' : 'bg-emerald-800/10'
              }`}>
                <motion.div
                  animate={{ x: item.value ? 20 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                ></motion.div>
              </div>
            ) : (
              <ChevronRight className="w-4 h-4 text-emerald-800/30" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Logout */}
      <GlassButton
        variant="danger"
        fullWidth
        size="lg"
        onClick={() => {
          logout();
          navigate('/');
        }}
        icon={<LogOut className="w-5 h-5" />}
        className="rounded-2xl mt-4"
      >
        Log Out
      </GlassButton>

      <p className="text-center text-xs text-emerald-800/30 pb-4">
        OrbitPay Credit Union v1.0.0
      </p>
    </div>
  );
}
