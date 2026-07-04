import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  ArrowLeft, Download, Share2, Printer, FileText,
  Calendar, TrendingUp, TrendingDown, Filter, ChevronDown
} from 'lucide-react';

// Generate mock statement data
const generateMockStatement = (month: string, year: number) => {
  const transactions = [
    { id: 1, date: `${month} 15`, description: 'Direct Deposit - Employer', amount: 4250.00, type: 'credit', category: 'Income' },
    { id: 2, date: `${month} 14`, description: 'Transfer to Savings', amount: -500.00, type: 'debit', category: 'Transfer' },
    { id: 3, date: `${month} 12`, description: 'Whole Foods Market', amount: -87.34, type: 'debit', category: 'Groceries' },
    { id: 4, date: `${month} 10`, description: 'Netflix Subscription', amount: -15.99, type: 'debit', category: 'Entertainment' },
    { id: 5, date: `${month} 8`, description: 'Shell Gas Station', amount: -52.40, type: 'debit', category: 'Transportation' },
    { id: 6, date: `${month} 5`, description: 'Amazon Purchase', amount: -124.99, type: 'debit', category: 'Shopping' },
    { id: 7, date: `${month} 3`, description: 'Starbucks', amount: -8.75, type: 'debit', category: 'Food & Drink' },
    { id: 8, date: `${month} 1`, description: 'Rent Payment', amount: -1800.00, type: 'debit', category: 'Housing' },
  ];

  const credits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const debits = Math.abs(transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0));
  const startingBalance = 5420.00;
  const endingBalance = startingBalance + credits - debits;

  return { transactions, credits, debits, startingBalance, endingBalance };
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function StatementScreen() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(2026);

  const statement = generateMockStatement(selectedMonth, selectedYear);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `OrbitPay Statement - ${selectedMonth} ${selectedYear}`,
        text: `Account statement for ${selectedMonth} ${selectedYear}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6 text-emerald-800" />
        </button>
        <div>
          <h1 className="text-2xl font-medium text-emerald-800">Statements</h1>
          <p className="text-sm text-emerald-800/50">Account statements & history</p>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-3 glass-card rounded-xl text-emerald-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/40 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-24 px-4 py-3 glass-card rounded-xl text-emerald-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/40 pointer-events-none" />
        </div>
      </div>

      {/* Statement Summary Card */}
      <GlassCard intensity="high" className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Statement Period</span>
          </div>
          <span className="text-sm font-semibold text-emerald-800">{selectedMonth} {selectedYear}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-white/30 rounded-xl">
            <p className="text-xs text-emerald-800/50 mb-1">Starting Balance</p>
            <p className="text-lg font-bold text-emerald-800">${statement.startingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center p-3 bg-white/30 rounded-xl">
            <p className="text-xs text-emerald-800/50 mb-1">Ending Balance</p>
            <p className="text-lg font-bold text-emerald-800">${statement.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-emerald-800/50">Credits</p>
              <p className="text-sm font-bold text-green-600">+${statement.credits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-emerald-800/50">Debits</p>
              <p className="text-sm font-bold text-red-500">-${statement.debits.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Account Info */}
      <GlassCard className="p-4" intensity="medium">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-800">Account: Checking ••••4892</p>
            <p className="text-xs text-emerald-800/40">{user?.fullName || 'Member'}</p>
          </div>
          <GlassBadge variant="mint" size="sm">Active</GlassBadge>
        </div>
      </GlassCard>

      {/* Transactions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-emerald-800">Transactions</h3>
          <button className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700">
            <Filter className="w-3 h-3" />
            Filter
          </button>
        </div>

        {statement.transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4 hover:bg-white/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                tx.type === 'credit' ? 'bg-green-100' : 'bg-emerald-100'
              }`}>
                {tx.type === 'credit' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-800 truncate">{tx.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-emerald-800/40">{tx.date}</span>
                  <span className="text-xs text-emerald-800/30">·</span>
                  <span className="text-xs text-emerald-800/40">{tx.category}</span>
                </div>
              </div>
              <p className={`text-sm font-semibold ${
                tx.type === 'credit' ? 'text-green-600' : 'text-emerald-800'
              }`}>
                {tx.type === 'credit' ? '+' : ''}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="glass-card p-4 text-center hover:bg-white/30 transition-colors"
        >
          <Share2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
          <p className="text-xs text-emerald-800">Share</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="glass-card p-4 text-center hover:bg-white/30 transition-colors"
        >
          <Download className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
          <p className="text-xs text-emerald-800">Download PDF</p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="glass-card p-4 text-center hover:bg-white/30 transition-colors"
        >
          <Printer className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
          <p className="text-xs text-emerald-800">Print</p>
        </motion.button>
      </div>

      {/* Footer with Logo */}
      <div className="text-center pt-4">
        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-emerald-800">OrbitPay Credit Union</p>
        <p className="text-xs text-emerald-800/40 mt-1">Member-First Digital Banking</p>
        <p className="text-xs text-emerald-800/30 mt-2">www.orbitpay.com | 1-800-ORBITPAY</p>
      </div>
    </div>
  );
}
