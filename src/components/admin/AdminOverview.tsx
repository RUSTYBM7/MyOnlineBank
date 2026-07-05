import { motion } from 'framer-motion';
import { GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  Bot,
  Clock,
  DollarSign,
  Globe,
  Server,
  ShieldCheck,
  Sun,
  TrendingUp,
  UserCheck,
  Users,
  Wifi,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 42000, users: 45 },
  { month: 'Aug', revenue: 38000, users: 62 },
  { month: 'Sep', revenue: 51000, users: 38 },
  { month: 'Oct', revenue: 47000, users: 85 },
  { month: 'Nov', revenue: 62000, users: 72 },
  { month: 'Dec', revenue: 58000, users: 58 },
];

const txnVolData = [
  { day: 'Mon', volume: 120, success: 115, failed: 5 },
  { day: 'Tue', volume: 145, success: 142, failed: 3 },
  { day: 'Wed', volume: 98, success: 95, failed: 3 },
  { day: 'Thu', volume: 167, success: 165, failed: 2 },
  { day: 'Fri', volume: 189, success: 187, failed: 2 },
  { day: 'Sat', volume: 134, success: 132, failed: 2 },
  { day: 'Sun', volume: 112, success: 110, failed: 2 },
];

const systemHealthData = [
  { name: 'API', value: 99.9, color: '#2ECC71' },
  { name: 'Database', value: 99.5, color: '#A8E6CF' },
  { name: 'Auth', value: 100, color: '#DDA0DD' },
];

const transactionTypes = [
  { name: 'Transfers', value: 45, color: '#A8E6CF' },
  { name: 'Payments', value: 30, color: '#DDA0DD' },
  { name: 'Deposits', value: 15, color: '#F4F7C0' },
  { name: 'Withdrawals', value: 10, color: '#C8D9C4' },
];

interface AdminOverviewProps {
  stats: {
    totalUsers: number;
    activeToday: number;
    totalDeposits: number;
    totalWithdrawals: number;
    pendingKycs: number;
    flaggedTransactions: number;
  };
}

export default function AdminOverview({ stats }: AdminOverviewProps) {
  const { transactions, adminActions } = useStore();
  const [systemStatus, setSystemStatus] = useState('Operational');
  const [uptime, setUptime] = useState(99.99);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => Math.min(99.99, prev + 0.001 * Math.random()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const recentAlerts = transactions
    .filter((t) => t.status === 'flagged' || Math.abs(t.amount) > 5000)
    .slice(0, 5);

  const kpiCards = [
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, change: '+12%', positive: true, gradient: 'from-emerald-400 to-teal-500' },
    { label: 'Active Today', value: stats.activeToday.toString(), icon: UserCheck, change: '+5%', positive: true, gradient: 'from-cyan-400 to-blue-500' },
    { label: 'Total Deposits', value: `$${(stats.totalDeposits / 1000).toFixed(0)}K`, icon: DollarSign, change: '+8%', positive: true, gradient: 'from-violet-400 to-purple-500' },
    { label: 'Withdrawals', value: `$${(stats.totalWithdrawals / 1000).toFixed(0)}K`, icon: ArrowDownRight, change: '-3%', positive: false, gradient: 'from-amber-400 to-orange-500' },
    { label: 'Pending KYCs', value: stats.pendingKycs.toString(), icon: ShieldCheck, change: stats.pendingKycs === 0 ? 'Clear' : 'Review', positive: stats.pendingKycs === 0, gradient: 'from-rose-400 to-red-500' },
    { label: 'Flagged TXNs', value: stats.flaggedTransactions.toString(), icon: AlertTriangle, change: 'Review', positive: stats.flaggedTransactions === 0, gradient: 'from-red-400 to-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with System Status */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-800">Command Center</h1>
          <p className="text-sm text-emerald-800/50">Real-time banking operations overview</p>
        </div>

        {/* System Health Indicators */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <motion.div
              className="w-2.5 h-2.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-emerald-800">{systemStatus}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-800/50" />
            <span className="text-sm text-emerald-800">{uptime.toFixed(2)}%</span>
            <span className="text-xs text-emerald-800/40">Uptime</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-800/50" />
            <span className="text-sm text-emerald-800">Live</span>
          </div>
        </motion.div>
      </div>

      {/* AI Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="ai-widget p-4 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold text-cyan-600">AI Operations Assistant</p>
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <p className="text-sm text-emerald-800/80">
              System performing optimally. All metrics within normal parameters. Consider scaling API capacity by 15% before peak hours.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <GlassCard className="p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <motion.div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </motion.div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  stat.positive
                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'
                    : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-emerald-800">{stat.value}</p>
              <p className="text-xs text-emerald-800/40 mt-0.5">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-emerald-800">Revenue</h3>
              </div>
              <span className="text-xs text-emerald-800/40">Last 6 months</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#0A0A0A', opacity: 0.4 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '12px', backdropFilter: 'blur(10px)' }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#A8E6CF" strokeWidth={3} fill="url(#revGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Transaction Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-emerald-800">Transaction Volume</h3>
              </div>
              <span className="text-xs text-emerald-800/40">This week</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={txnVolData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#0A0A0A', opacity: 0.4 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '12px', backdropFilter: 'blur(10px)' }}
                    formatter={(v: number) => [`${v} txns`, 'Volume']}
                  />
                  <Bar dataKey="success" fill="#A8E6CF" radius={[6, 6, 0, 0]} name="Success" />
                  <Bar dataKey="failed" fill="#FF6B6B" radius={[6, 6, 0, 0]} name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* System Health & Transaction Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-rows-2 gap-4"
        >
          {/* System Health */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-emerald-800 text-sm">System Health</h3>
            </div>
            <div className="flex gap-4">
              {systemHealthData.map((item, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="relative w-12 h-12 mx-auto mb-1">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="#f0f0f0" strokeWidth="4" fill="none" />
                      <motion.circle
                        cx="24" cy="24" r="20"
                        stroke={item.color}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(item.value / 100) * 125.6} 125.6`}
                        initial={{ strokeDasharray: "0 125.6" }}
                        animate={{ strokeDasharray: `${(item.value / 100) * 125.6} 125.6` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: 'easeOut' }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-800">
                      {item.value}%
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-800/50">{item.name}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Transaction Types */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-violet-500" />
              <h3 className="font-semibold text-emerald-800 text-sm">Transaction Mix</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {transactionTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1">
                {transactionTypes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-emerald-800/70 flex-1">{item.name}</span>
                    <span className="text-xs font-medium text-emerald-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Alerts & Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-4 h-4 text-white" />
                </motion.div>
                <h3 className="font-semibold text-emerald-800">Active Alerts</h3>
              </div>
              <span className="text-xs text-emerald-800/40">{recentAlerts.length} alerts</span>
            </div>
            <div className="space-y-2 max-h-[280px] overflow-y-auto glass-scrollbar pr-2">
              {recentAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 mx-auto mb-3 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-sm text-emerald-800/50">All systems operational</p>
                  <p className="text-xs text-emerald-800/30">No alerts require attention</p>
                </motion.div>
              ) : (
                recentAlerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-colors cursor-pointer group"
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        Math.abs(alert.amount) > 10000
                          ? 'bg-gradient-to-br from-rose-100 to-red-100'
                          : 'bg-gradient-to-br from-amber-100 to-orange-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {Math.abs(alert.amount) > 10000 ? (
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                      ) : (
                        <Activity className="w-5 h-5 text-amber-500" />
                      )}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-800 truncate group-hover:text-emerald-800/80">
                        {alert.description}
                      </p>
                      <p className="text-xs text-emerald-800/40">
                        {alert.recipientName || 'System'} • {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`text-sm font-bold ${
                      alert.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {alert.amount > 0 ? '+' : ''}${Math.abs(alert.amount).toLocaleString()}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-emerald-800">Admin Activity</h3>
              </div>
              <span className="text-xs text-emerald-800/40">Last 5 actions</span>
            </div>
            <div className="space-y-2 max-h-[280px] overflow-y-auto glass-scrollbar pr-2">
              {adminActions.slice(0, 5).map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-800">
                      {action.actionType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-emerald-800/40">
                      {action.adminName} • {action.targetUserName || 'System'}
                    </p>
                  </div>
                  <span className="text-xs text-emerald-800/30">
                    {new Date(action.createdAt).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
