import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Globe,
  Plus,
  Settings,
  Shield,
  Smartphone,
  Snowflake,
  User
} from 'lucide-react';;

export default function CardSettings() {
  const navigate = useNavigate();
  const { cards, user } = useStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [defaultCard, setDefaultCard] = useState<string | null>(
    cards.find(c => c.userId === user?.id && !c.isVirtual)?.id || null
  );

  if (!user) return null;

  const userCards = cards.filter(c => c.userId === user.id);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const cardSettings = [
    {
      id: 'default',
      title: 'Default Card',
      description: defaultCard ? `Card ending in ${userCards.find(c => c.id === defaultCard)?.lastFourDigits}` : 'No default set',
      icon: <CreditCard className="w-5 h-5" />,
      action: () => showToast('Opening default card settings...', 'success'),
    },
    {
      id: 'limits',
      title: 'Spending Limits',
      description: 'Control daily and monthly limits',
      icon: <Shield className="w-5 h-5" />,
      action: () => showToast('Opening spending limits...', 'success'),
    },
    {
      id: 'atm',
      title: 'ATM Withdrawals',
      description: 'Daily ATM limit: $500',
      icon: <CreditCard className="w-5 h-5" />,
      action: () => showToast('Opening ATM settings...', 'success'),
    },
    {
      id: 'online',
      title: 'Online Payments',
      description: 'Enable or disable online transactions',
      icon: <Globe className="w-5 h-5" />,
      action: () => showToast('Opening online payment settings...', 'success'),
    },
    {
      id: 'international',
      title: 'International Transactions',
      description: 'Enable for international use',
      icon: <Globe className="w-5 h-5" />,
      action: () => showToast('Opening international settings...', 'success'),
    },
    {
      id: 'contactless',
      title: 'Contactless Payments',
      description: 'NFC and tap-to-pay settings',
      icon: <Smartphone className="w-5 h-5" />,
      action: () => showToast('Opening contactless settings...', 'success'),
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
          <h1 className="text-xl font-bold text-emerald-800">Card Settings</h1>
          <p className="text-sm text-emerald-800/50">Manage your card preferences</p>
        </div>
      </div>

      {/* Card Summary */}
      <GlassCard className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-emerald-800">Your Cards</p>
            <p className="text-sm text-emerald-800/70">
              {userCards.length} card{userCards.length !== 1 ? 's' : ''} linked to your account
            </p>
          </div>
          <button
            onClick={() => navigate('/app/cards')}
            className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium"
          >
            Manage Cards
          </button>
        </div>
      </GlassCard>

      {/* User Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Your Cards</h3>
        {userCards.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-emerald-800/30 mb-3" />
            <p className="text-emerald-800/60 mb-4">No cards yet</p>
            <button
              onClick={() => navigate('/app/cards')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Card
            </button>
          </GlassCard>
        ) : (
          userCards.map((card) => (
            <GlassCard key={card.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${
                  card.color === 'mint' ? 'from-[#A8E6CF] to-[#88D4AB]' :
                  card.color === 'gold' ? 'from-[#F4F7C0] to-[#E5EB8A]' :
                  card.color === 'navy' ? 'from-[#1a1a2e] to-[#16213e]' :
                  'from-[#DDA0DD] to-[#C48BC4]'
                } flex items-center justify-center`}>
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-emerald-800">
                      •••• {card.lastFourDigits}
                    </p>
                    {card.isVirtual && (
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-600 text-xs rounded-full">
                        Virtual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-800/60 capitalize">{card.type} Card</p>
                </div>
                <button
                  onClick={() => {
                    setDefaultCard(card.id);
                    showToast('Default card updated', 'success');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    defaultCard === card.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-emerald-800'
                  }`}
                >
                  {defaultCard === card.id ? 'Default' : 'Set Default'}
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Card Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Card Preferences</h3>
        {cardSettings.map((setting) => (
          <GlassCard key={setting.id} className="p-4">
            <button
              onClick={setting.action}
              className="w-full flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                {setting.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-emerald-800">{setting.title}</p>
                <p className="text-xs text-emerald-800/60">{setting.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-800/40" />
            </button>
          </GlassCard>
        ))}
      </div>

      {/* Card Security */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-emerald-800/60 uppercase tracking-wider">Security Features</h3>
        <GlassCard className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Snowflake className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-800">Instant Freeze</p>
                <p className="text-xs text-emerald-800/60">Freeze cards instantly from any screen</p>
              </div>
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-800">Zero Liability Protection</p>
                <p className="text-xs text-emerald-800/60">You're protected against unauthorized transactions</p>
              </div>
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-emerald-800">Travel Notifications</p>
                <p className="text-xs text-emerald-800/60">Automatic alerts when you travel</p>
              </div>
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
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
