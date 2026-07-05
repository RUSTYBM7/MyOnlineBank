import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, CreditCard, FileText, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Clock, CheckCircle,
  XCircle, ArrowRight, Activity, Wallet, Shield, BarChart3, Loader2,
  Globe, Server, Lock, Database, Zap, Eye, Smartphone, MapPin,
  Briefcase, Banknote, Receipt, AlertOctagon, Gauge
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { Badge, ProgressBar } from '@/components/ui';

const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444', '#14b8a6'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const {
    members, accounts, transactions, cards, loans, kycApplications,
    fraudAlerts, notifications, supportTickets, fetchAll, isLoading, dashboardStats
  } = useAdminStore();
  const { currentAdmin } = useAuthStore();
  const [realtime, setRealtime] = useState({ activeNow: 0, txPerMin: 0, volumePerMin: 0, onlineAdmins: 0 });

  useEffect(() => {
    if (members.length === 0) fetchAll();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setRealtime({
        activeNow: Math.floor(Math.random() * 500) + 200,
        txPerMin: Math.floor(Math.random() * 50) + 20,
        volumePerMin: Math.floor(Math.random() * 500000) + 100000,
        onlineAdmins: Math.floor(Math.random() * 30) + 10,
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const stats = dashboardStats || {
    totalMembers: 0, activeMembers: 0, pendingKYC: 0, totalAccounts: 0, activeAccounts: 0,
    frozenAccounts: 0, totalBalance: 0, totalDeposits: 0, totalWithdrawals: 0,
    activeLoans: 0, openFraudAlerts: 0, openTickets: 0, dailyRevenue: 0, activeCards: 0,
  };

  const formatNumber = (n: number) => n.toLocaleString();
  const formatCurrency = (n: number) => `$${(n / 1000).toFixed(1)}K`;
  const formatLargeCurrency = (n: number) => {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(0)}`;
  };

  // 17 KPI tiles
  const kpis = [
    { label: 'Total Customers', value: formatNumber(stats.totalMembers), change: '+184 today', changeType: 'up', icon: Users, color: 'emerald' },
    { label: 'Active Customers', value: formatNumber(stats.activeMembers), change: '94.2% of total', changeType: 'up', icon: CheckCircle, color: 'green' },
    { label: 'Pending KYC', value: formatNumber(stats.pendingKYC), change: `${stats.pendingKYC > 50 ? 'High' : 'Normal'} volume`, changeType: stats.pendingKYC > 50 ? 'down' : 'neutral', icon: FileText, color: 'amber' },
    { label: 'Total Deposits', value: formatLargeCurrency(stats.totalDeposits), change: '+12.4% MoM', changeType: 'up', icon: TrendingUp, color: 'emerald' },
    { label: 'Total Withdrawals', value: formatLargeCurrency(stats.totalWithdrawals), change: '+8.1% MoM', changeType: 'up', icon: TrendingDown, color: 'cyan' },
    { label: 'Total Transfers', value: formatNumber(stats.totalTransfers || 34521), change: '+5.7% WoW', changeType: 'up', icon: ArrowRight, color: 'blue' },
    { label: 'Daily Revenue', value: formatCurrency(stats.dailyRevenue), change: '+18.2% vs avg', changeType: 'up', icon: DollarSign, color: 'emerald' },
    { label: 'Pending Transactions', value: formatNumber(stats.pendingTransactions || 47), change: 'Auto-process 5m', changeType: 'neutral', icon: Clock, color: 'amber' },
    { label: 'Failed Transactions', value: formatNumber(stats.failedTransactions || 12), change: 'Retry queue', changeType: 'down', icon: XCircle, color: 'red' },
    { label: 'Restricted Accounts', value: formatNumber(stats.restrictedAccounts || 23), change: 'Compliance review', changeType: 'neutral', icon: Lock, color: 'red' },
    { label: 'Frozen Accounts', value: formatNumber(stats.frozenAccounts), change: 'Owner must unlock', changeType: 'neutral', icon: Lock, color: 'cyan' },
    { label: 'Fraud Alerts', value: formatNumber(stats.openFraudAlerts), change: `${stats.criticalFraudAlerts || 3} critical`, changeType: 'down', icon: AlertTriangle, color: 'red' },
    { label: 'Support Tickets', value: formatNumber(stats.openTickets), change: `${stats.urgentTickets || 4} urgent`, changeType: 'down', icon: AlertOctagon, color: 'amber' },
    { label: 'Loan Portfolio', value: formatLargeCurrency(stats.loanPortfolio || 124000000), change: `${stats.activeLoans} active`, changeType: 'up', icon: Briefcase, color: 'purple' },
    { label: 'Active Cards', value: formatNumber(stats.activeCards), change: '24 networks', changeType: 'up', icon: CreditCard, color: 'emerald' },
    { label: 'API Health', value: '99.98%', change: 'Latency 42ms', changeType: 'up', icon: Server, color: 'emerald' },
    { label: 'Active Sessions', value: formatNumber(realtime.activeNow), change: `${realtime.onlineAdmins} admins online`, changeType: 'up', icon: Activity, color: 'blue' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {currentAdmin?.firstName || 'Admin'}</h1>
          <p className="text-slate-400 mt-1">Here's what's happening across OrbitPay today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-300 font-medium">All systems operational</span>
          </div>
        </div>
      </motion.div>

      {/* 17 KPI Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={itemVariants}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 rounded-lg bg-${kpi.color}-500/10`}>
                <kpi.icon className={`w-4 h-4 text-${kpi.color}-400`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.label}</p>
            <p className={`text-[10px] mt-1 ${
              kpi.changeType === 'up' ? 'text-emerald-400' :
              kpi.changeType === 'down' ? 'text-red-400' : 'text-slate-500'
            }`}>
              {kpi.change}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row 1: Revenue Growth, User Registrations, Daily Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.revenueGrowth || []}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
              <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#g1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">User Registrations (12mo)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Daily Transactions (30d)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.dailyVolume || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2: Account Types, Deposits vs Withdrawals, Monthly Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Account Type Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.accountTypeDistribution || []} dataKey="count" nameKey="type" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {(stats.accountTypeDistribution || []).map((_: any, i: number) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Deposits vs Withdrawals</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.depositsVsWithdrawals || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="deposits" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Profit (12mo)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.monthlyProfit || []}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
              <Area type="monotone" dataKey="profit" stroke="#f59e0b" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row: Live feed + Active sessions + Geo + Device */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Transaction Feed
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.slice(0, 20).map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-3 p-2.5 hover:bg-slate-700/30 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  tx.amount > 0 ? 'bg-emerald-500/10' : 'bg-slate-700/50'
                }`}>
                  {tx.amount > 0 ? <ArrowDownRight className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-slate-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{tx.memberName} · {tx.description}</p>
                  <p className="text-xs text-slate-500">{tx.location} · {new Date(tx.date).toLocaleTimeString()}</p>
                </div>
                <p className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.currency} {Math.abs(tx.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          {/* Active sessions */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              Active Sessions (24h)
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={stats.activeSessionsByHour || []}>
                <defs>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8 }} />
                <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="url(#g3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Geographic distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              Geographic Distribution
            </h3>
            <div className="space-y-2">
              {(stats.geographicDistribution || []).slice(0, 5).map((g: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-sm text-slate-300 flex-1">{g.city}</span>
                  <span className="text-sm text-white font-medium">{g.members.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Top Devices
            </h3>
            <div className="space-y-2">
              {(stats.deviceDistribution || []).map((d: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm text-slate-300 flex-1 truncate">{d.device}</span>
                  <div className="flex-1 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${(d.count / 8000) * 100}%` }} />
                  </div>
                  <span className="text-sm text-white font-medium w-12 text-right">{(d.count / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
