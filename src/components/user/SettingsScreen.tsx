import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  User, Shield, Bell, CreditCard, Lock, Eye, Moon,
  Globe, FileText, ChevronRight, HelpCircle, Check, LogOut
} from 'lucide-react';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  if (!user) return null;

  const settingCategories = [
    {
      id: 'account',
      title: 'Account',
      description: 'Personal info, KYC, profile',
      icon: User,
      color: 'emerald',
      route: '/app/settings/account',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password, 2FA, sessions',
      icon: Shield,
      color: 'teal',
      route: '/app/settings/security',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alerts, sounds, badges',
      icon: Bell,
      color: 'cyan',
      route: '/app/settings/notifications',
    },
    {
      id: 'cards',
      title: 'Cards',
      description: 'Manage cards, limits',
      icon: CreditCard,
      color: 'mint',
      route: '/app/settings/cards',
    },
    {
      id: 'privacy',
      title: 'Privacy',
      description: 'Data, visibility',
      icon: Eye,
      color: 'lavender',
      route: '/app/settings/privacy',
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Theme, language',
      icon: Moon,
      color: 'yellow',
      route: '/app/settings/appearance',
    },
    {
      id: 'about',
      title: 'Help & About',
      description: 'Support, legal',
      icon: HelpCircle,
      color: 'slate',
      route: '/app/settings/about',
    },
  ];

  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-400 to-teal-400',
    teal: 'from-teal-400 to-cyan-400',
    cyan: 'from-cyan-400 to-blue-400',
    mint: 'from-emerald-300 to-green-300',
    lavender: 'from-purple-300 to-pink-300',
    yellow: 'from-amber-300 to-orange-300',
    slate: 'from-slate-400 to-gray-400',
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-5 space-y-6 animate-fade-in pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-emerald-800">Settings</h1>
        <p className="text-sm text-emerald-800/50">Customize your experience</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt={user.fullName}
              className="w-16 h-16 rounded-full border-4 border-white/40 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-800 text-lg">{user.fullName}</p>
            <p className="text-sm text-emerald-800/60">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <GlassBadge
                variant={user.kycStatus === 'verified' ? 'green' : user.kycStatus === 'pending' ? 'yellow' : 'red'}
                size="sm"
              >
                {user.tier.toUpperCase()}
              </GlassBadge>
              {user.kycStatus === 'verified' && (
                <GlassBadge variant="mint" size="sm">
                  Verified
                </GlassBadge>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-3">
        {settingCategories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(category.route)}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-white/70 transition-all hover:shadow-lg border border-white/30"
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[category.color]} flex items-center justify-center mb-3 shadow-lg`}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-emerald-800">{category.title}</p>
            <p className="text-xs text-emerald-800/50 mt-1">{category.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Quick Actions</h3>
        <GlassCard className="p-4">
          <button
            onClick={() => navigate('/app/cards')}
            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-emerald-800">Manage Cards</p>
              <p className="text-xs text-emerald-800/60">Freeze, unfreeze, view details</p>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-800/40" />
          </button>
        </GlassCard>
      </div>

      {/* App Info */}
      <GlassCard className="p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
        <div className="flex items-center justify-center gap-2 text-emerald-800/40">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">OP</span>
          </div>
          <span className="text-sm">OrbitPay v2.0.0</span>
        </div>
      </GlassCard>

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5 text-red-500" />
        <span className="text-sm font-medium text-red-500">Sign Out</span>
      </motion.button>
    </div>
  );
}
