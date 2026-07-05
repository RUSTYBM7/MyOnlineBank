import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, CreditCard, FileText, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, CheckCircle,
  XCircle, ArrowRight, Activity, Wallet, Shield, BarChart3, Loader2
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { Badge, ProgressBar } from '@/components/ui';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const {
    members, accounts, transactions, cards, loans,
    kycApplications, fraudAlerts, notifications,
    fetchAll, isLoading, dashboardStats
  } = useAdminStore();
  const { admin } = useAuthStore();
  const [timeRange, setTimeRange] = useState('today');

  // Fetch real data from Supabase on mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = {
    members: members.filter(m => m.status === 'active').length,
    newMembers: members.filter(m => m.joinDate >= '2024-01-01').length,
    accounts: accounts.filter(a => a.status === 'active').length,
    totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
    transactions: transactions.length,
    transactionVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    cards: cards.filter(c => c.status === 'active').length,
    activeLoans: loans.filter(l => l.status === 'active').length,
    loanPortfolio: loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.balance, 0),
    pendingKYC: kycApplications.filter(k => k.status === 'pending').length,
    openFraudAlerts: fraudAlerts.filter(f => f.status === 'open' || f.status === 'investigating').length,
    unreadNotifications: notifications.filter(n => !n.read).length,
  };

  const recentTransactions = transactions.slice(0, 5);
  const recentAlerts = fraudAlerts.filter(f => f.status === 'open' || f.status === 'investigating').slice(0, 4);
  const pendingKYCList = kycApplications.filter(k => k.status === 'pending').slice(0, 4);

  // Show loading state while fetching data
  if (isLoading && members.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {admin?.firstName || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={() => fetchAll()}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Members</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.members.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">+{stats.newMembers} new</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Balance</p>
              <p className="text-3xl font-bold text-white mt-2">${(stats.totalBalance / 1000000).toFixed(1)}M</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">+8.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Transactions</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.transactions}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-slate-400 text-sm">Volume: </span>
                <span className="text-white text-sm font-medium">${(stats.transactionVolume / 1000).toFixed(1)}K</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm">Loan Portfolio</p>
              <p className="text-3xl font-bold text-white mt-2">${(stats.loanPortfolio / 1000000).toFixed(1)}M</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">+12.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-amber-400 font-semibold">Pending KYC</p>
              <p className="text-slate-400 text-sm">Applications awaiting review</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.pendingKYC}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 font-semibold">Fraud Alerts</p>
              <p className="text-slate-400 text-sm">Requires attention</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.openFraudAlerts}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-semibold">Active Cards</p>
              <p className="text-slate-400 text-sm">Currently in use</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.cards}</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <button className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-emerald-500/20' :
                    tx.type === 'withdrawal' ? 'bg-red-500/20' :
                    tx.type === 'payment' ? 'bg-amber-500/20' : 'bg-blue-500/20'
                  }`}>
                    {tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5 text-emerald-400" /> :
                     tx.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5 text-red-400" /> :
                     <Activity className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">{tx.memberName}</p>
                    <p className="text-slate-500 text-sm">{tx.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                  </p>
                  <Badge variant={
                    tx.status === 'completed' ? 'success' :
                    tx.status === 'pending' ? 'warning' : 'danger'
                  }>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending KYC */}
          <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Pending KYC</h2>
              <Badge variant="warning">{stats.pendingKYC}</Badge>
            </div>
            <div className="divide-y divide-slate-800">
              {pendingKYCList.map((kyc) => (
                <div key={kyc.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{kyc.memberName}</p>
                    <Badge variant="warning" size="sm">Pending</Badge>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{kyc.email}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                      Approve
                    </button>
                    <button className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingKYCList.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">All KYC applications processed</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Fraud Alerts */}
          <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Fraud Alerts</h2>
              <Badge variant="danger">{stats.openFraudAlerts}</Badge>
            </div>
            <div className="divide-y divide-slate-800">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{alert.memberName}</p>
                    <Badge
                      variant={
                        alert.severity === 'critical' ? 'danger' :
                        alert.severity === 'high' ? 'danger' :
                        alert.severity === 'medium' ? 'warning' : 'info'
                      }
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{alert.description}</p>
                  <p className="text-amber-400 text-sm font-medium">${alert.amount.toLocaleString()}</p>
                </div>
              ))}
              {recentAlerts.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500">
                  <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active fraud alerts</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* System Health */}
      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">System Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'API Status', value: 'Operational', color: 'emerald' },
            { label: 'Database', value: 'Healthy', color: 'emerald' },
            { label: 'Auth Service', value: 'Operational', color: 'emerald' },
            { label: 'Payment Gateway', value: 'Operational', color: 'emerald' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
              <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
              <div>
                <p className="text-slate-400 text-sm">{item.label}</p>
                <p className="text-white font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
