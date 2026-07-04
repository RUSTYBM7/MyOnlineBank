import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import { Shield, AlertCircle, Check, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TransactionLimitsPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [limits, setLimits] = useState({
    dailyLimit: user?.dailyLimit || 50000,
    weeklyLimit: user?.weeklyLimit || 200000,
    monthlyLimit: user?.monthlyLimit || 500000,
    singleTransferLimit: 25000,
    dailyTransactions: 100,
    internationalLimit: 10000,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (user) {
      updateUser({
        ...user,
        dailyLimit: limits.dailyLimit,
        weeklyLimit: limits.weeklyLimit,
        monthlyLimit: limits.monthlyLimit,
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const limitPresets = [
    { label: 'Standard', daily: 10000, weekly: 50000, monthly: 200000 },
    { label: 'Premium', daily: 50000, weekly: 200000, monthly: 500000 },
    { label: 'Unlimited', daily: 100000, weekly: 500000, monthly: 2000000 },
  ];

  const applyPreset = (preset: typeof limitPresets[0]) => {
    setLimits(prev => ({
      ...prev,
      dailyLimit: preset.daily,
      weeklyLimit: preset.weekly,
      monthlyLimit: preset.monthly,
    }));
  };

  return (
    <div className="p-5 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/app/settings')}
          className="w-10 h-10 rounded-xl bg-white/50 backdrop-blur-sm flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-emerald-800" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-emerald-800">Transaction Limits</h1>
          <p className="text-sm text-emerald-800/50">Manage your daily limits</p>
        </div>
      </div>

      {/* Current Tier Badge */}
      <GlassCard className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-emerald-800/60">Current Tier</p>
            <p className="font-bold text-emerald-800 text-lg">{user?.tier?.toUpperCase() || 'STANDARD'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-emerald-800/60">Daily Limit</p>
            <p className="font-bold text-emerald-800">{formatCurrency(limits.dailyLimit)}</p>
          </div>
        </div>
      </GlassCard>

      {/* Preset Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-emerald-800/70">Quick Presets</p>
        <div className="grid grid-cols-3 gap-2">
          {limitPresets.map((preset) => (
            <motion.button
              key={preset.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-xl border-2 transition-all ${
                limits.dailyLimit === preset.daily
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-white/30 bg-white/30 hover:border-emerald-300'
              }`}
            >
              <p className="text-sm font-semibold text-emerald-800">{preset.label}</p>
              <p className="text-xs text-emerald-800/60">{formatCurrency(preset.daily)}/day</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Limit Sliders */}
      <div className="space-y-6">
        <p className="text-sm font-medium text-emerald-800/70">Custom Limits</p>

        {/* Daily Limit */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-emerald-800">Daily Limit</p>
              <p className="text-sm text-emerald-800/50">Maximum per day</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(limits.dailyLimit)}</p>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={limits.dailyLimit}
            onChange={(e) => setLimits(prev => ({ ...prev, dailyLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/50 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-emerald-800/40 mt-2">
            <span>$1,000</span>
            <span>$100,000</span>
          </div>
        </GlassCard>

        {/* Weekly Limit */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-emerald-800">Weekly Limit</p>
              <p className="text-sm text-emerald-800/50">Maximum per week</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(limits.weeklyLimit)}</p>
          </div>
          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={limits.weeklyLimit}
            onChange={(e) => setLimits(prev => ({ ...prev, weeklyLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/50 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-emerald-800/40 mt-2">
            <span>$5,000</span>
            <span>$500,000</span>
          </div>
        </GlassCard>

        {/* Monthly Limit */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-emerald-800">Monthly Limit</p>
              <p className="text-sm text-emerald-800/50">Maximum per month</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(limits.monthlyLimit)}</p>
          </div>
          <input
            type="range"
            min="20000"
            max="2000000"
            step="10000"
            value={limits.monthlyLimit}
            onChange={(e) => setLimits(prev => ({ ...prev, monthlyLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/50 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-emerald-800/40 mt-2">
            <span>$20,000</span>
            <span>$2,000,000</span>
          </div>
        </GlassCard>

        {/* Single Transfer Limit */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-emerald-800">Single Transfer Limit</p>
              <p className="text-sm text-emerald-800/50">Maximum per transaction</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(limits.singleTransferLimit)}</p>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={limits.singleTransferLimit}
            onChange={(e) => setLimits(prev => ({ ...prev, singleTransferLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/50 rounded-full appearance-none cursor-pointer accent-emerald-500"
          />
        </GlassCard>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Changes to your transaction limits may take up to 24 hours to take effect. For immediate changes or higher limits, please contact support.
        </p>
      </div>

      {/* Save Button */}
      <GlassButton
        onClick={handleSave}
        disabled={saving}
        className="w-full"
        variant="primary"
        size="lg"
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </span>
        ) : saved ? (
          <span className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            Saved Successfully!
          </span>
        ) : (
          'Save Changes'
        )}
      </GlassButton>
    </div>
  );
}
