import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassSurface, GlassBadge, GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import {
  Bell, Eye, EyeOff, Send, Download, Plus, ArrowRight,
  ChevronRight, TrendingUp, QrCode, Receipt, CreditCard,
  TrendingUp as InvestIcon, Bitcoin, ArrowDownLeft, PiggyBank
} from 'lucide-react';
import { useState } from 'react';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user, transactions, currencyRates, notifications } = useStore();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  if (!user) return null;

  const userTransactions = transactions.filter((t) => t.userId === user.id).slice(0, 6);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const balanceMap: Record<string, number> = {
    USD: user.balanceUsd,
    EUR: user.balanceEur,
    GBP: user.balanceGbp,
    BTC: user.balanceBtc,
  };

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    BTC: '₿',
  };

  const weeklyChange = 421.03;

  // All homepage quick actions - all functional
  const quickActions = [
    { icon: <Send className="w-5 h-5" />, label: 'Send', action: () => navigate('/app/transfer') },
    { icon: <Download className="w-5 h-5" />, label: 'Receive', action: () => navigate('/app/transfer') },
    { icon: <QrCode className="w-5 h-5" />, label: 'Scan QR', action: () => {} },
    { icon: <Receipt className="w-5 h-5" />, label: 'Pay Bills', action: () => navigate('/app/bills') },
  ];

  // Secondary actions
  const secondaryActions = [
    { icon: <CreditCard className="w-5 h-5" />, label: 'Cards', action: () => navigate('/app/cards') },
    { icon: <InvestIcon className="w-5 h-5" />, label: 'Invest', action: () => navigate('/app/invest') },
    { icon: <Bitcoin className="w-5 h-5" />, label: 'Crypto', action: () => navigate('/app/crypto') },
    { icon: <ArrowDownLeft className="w-5 h-5" />, label: 'History', action: () => navigate('/app/transfer') },
  ];

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <GlassSurface className="flex items-center gap-3 px-4 py-2.5 rounded-full">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="w-8 h-8 rounded-full border-2 border-white/40"
          />
          <div>
            <p className="text-xs text-[#0A0A0A]/50">Hello,</p>
            <p className="text-sm font-medium text-[#0A0A0A]">{user.fullName.split(' ')[0]}</p>
          </div>
        </GlassSurface>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {}}
          className="relative w-11 h-11 glass-button rounded-full flex items-center justify-center"
        >
          <Bell className="w-5 h-5 text-[#0A0A0A]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B6B] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Balance Card */}
      <GlassCard intensity="high" className="p-6 relative overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#A8E6CF]/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DDA0DD]/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <GlassBadge variant="yellow" size="sm">
              {selectedCurrency}
            </GlassBadge>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="mb-4">
            <p className="text-xs text-[#0A0A0A]/50 mb-1">
              1 {selectedCurrency} = {selectedCurrency === 'USD' ? '1.00' : (1 / (currencyRates.find(r => r.code === selectedCurrency)?.rate || 1)).toFixed(2)} USD
            </p>
            <h1 className="text-4xl font-light text-[#0A0A0A] tracking-tight">
              {showBalance
                ? `${currencySymbols[selectedCurrency]}${balanceMap[selectedCurrency]?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : '****'}
            </h1>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-[#F4F7C0] text-sm font-medium text-[#0A0A0A]">
              +${weeklyChange.toFixed(2)}
            </span>
            <span className="text-xs text-[#0A0A0A]/40">this week</span>
          </div>

          {/* Quick Actions - Primary */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-[#0A0A0A]">
                  {action.icon}
                </div>
                <span className="text-[10px] font-medium text-[#0A0A0A]">{action.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-4 gap-2">
            {secondaryActions.map((action, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className="flex flex-col items-center gap-1 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-[#0A0A0A]/70">
                  {action.icon}
                </div>
                <span className="text-[9px] text-[#0A0A0A]/60">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Savings & Budgets Quick View */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4 cursor-pointer" onClick={() => navigate('/app/accounts')}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#A8E6CF]/30 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-[#0A0A0A]" />
            </div>
            <div>
              <p className="text-xs text-[#0A0A0A]/50">Savings</p>
              <p className="text-sm font-medium text-[#0A0A0A]">$15,000.00</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4 cursor-pointer" onClick={() => navigate('/app/accounts')}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#DDA0DD]/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#0A0A0A]" />
            </div>
            <div>
              <p className="text-xs text-[#0A0A0A]/50">Budget</p>
              <p className="text-sm font-medium text-[#0A0A0A]">$2,450 left</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Currency Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-[#0A0A0A]">Currency</h2>
          <button className="text-sm text-[#0A0A0A]/50 hover:text-[#0A0A0A]">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {currencyRates.map((rate) => (
            <motion.button
              key={rate.code}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCurrency(rate.code)}
              className={`flex-shrink-0 glass-card px-4 py-3 min-w-[110px] text-left transition-all ${
                selectedCurrency === rate.code ? 'ring-2 ring-[#A8E6CF]' : ''
              }`}
            >
              <p className="text-xs text-[#0A0A0A]/50">{rate.name}</p>
              <p className="text-lg font-medium text-[#0A0A0A]">{rate.code}</p>
              <p className="text-sm text-[#0A0A0A]/70">{rate.rate.toFixed(2)}</p>
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 glass-card px-4 py-3 min-w-[100px] flex flex-col items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center mb-1">
              <Plus className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <span className="text-xs text-[#0A0A0A]/50">Add</span>
          </motion.button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-[#0A0A0A]">Latest Transactions</h2>
          <button
            onClick={() => navigate('/app/transfer')}
            className="text-sm text-[#0A0A0A]/50 hover:text-[#0A0A0A] flex items-center gap-1"
          >
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2.5">
          {userTransactions.map((txn, i) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/app/transaction/${txn.id}`)}
              className="glass-card px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                txn.amount > 0 ? 'bg-[#2ECC71]/15' : 'bg-[#FF6B6B]/10'
              }`}>
                {txn.recipientAvatar ? (
                  <img src={txn.recipientAvatar} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <TrendingUp className={`w-5 h-5 ${txn.amount > 0 ? 'text-[#2ECC71]' : 'text-[#FF6B6B]'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0A0A0A] truncate">
                  {txn.recipientName || txn.description}
                </p>
                <p className="text-xs text-[#0A0A0A]/40">{txn.description}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  txn.amount > 0 ? 'text-[#2ECC71]' : 'text-[#FF6B6B]'
                }`}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString('en-US', { style: 'currency', currency: txn.currency })}
                </p>
                <GlassBadge
                  variant={txn.status === 'completed' ? 'green' : txn.status === 'pending' ? 'yellow' : 'red'}
                  size="sm"
                >
                  {txn.status}
                </GlassBadge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
