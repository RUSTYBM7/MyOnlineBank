import { motion } from 'framer-motion';
import { GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import {
  Users, UserCheck, DollarSign, ArrowDownRight,
  ShieldCheck, AlertTriangle, TrendingUp, Activity
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

const revenueData = [
  { month: 'Jul', revenue: 42000 },
  { month: 'Aug', revenue: 38000 },
  { month: 'Sep', revenue: 51000 },
  { month: 'Oct', revenue: 47000 },
  { month: 'Nov', revenue: 62000 },
  { month: 'Dec', revenue: 58000 },
];

const userRegData = [
  { month: 'Jul', users: 45 },
  { month: 'Aug', users: 62 },
  { month: 'Sep', users: 38 },
  { month: 'Oct', users: 85 },
  { month: 'Nov', users: 72 },
  { month: 'Dec', users: 58 },
];

const txnVolData = [
  { day: 'Mon', volume: 120 },
  { day: 'Tue', volume: 145 },
  { day: 'Wed', volume: 98 },
  { day: 'Thu', volume: 167 },
  { day: 'Fri', volume: 189 },
  { day: 'Sat', volume: 134 },
  { day: 'Sun', volume: 112 },
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

  const recentAlerts = transactions
    .filter((t) => t.status === 'flagged' || Math.abs(t.amount) > 5000)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0A0A0A]">Dashboard</h1>
        <p className="text-sm text-[#0A0A0A]/50">Real-time banking overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, change: '+12%', positive: true },
          { label: 'Active Today', value: stats.activeToday.toString(), icon: UserCheck, change: '+5%', positive: true },
          { label: 'Total Deposits', value: `$${(stats.totalDeposits / 1000).toFixed(0)}K`, icon: DollarSign, change: '+8%', positive: true },
          { label: 'Total Withdrawals', value: `$${(stats.totalWithdrawals / 1000).toFixed(0)}K`, icon: ArrowDownRight, change: '-3%', positive: false },
          { label: 'Pending KYCs', value: stats.pendingKycs.toString(), icon: ShieldCheck, change: 'Urgent', positive: stats.pendingKycs === 0 },
          { label: 'Flagged TXNs', value: stats.flaggedTransactions.toString(), icon: AlertTriangle, change: 'Review', positive: stats.flaggedTransactions === 0 },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#A8E6CF]/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#0A0A0A]/60" />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.positive ? 'bg-[#2ECC71]/10 text-[#2ECC71]' : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-[#0A0A0A]">{stat.value}</p>
              <p className="text-xs text-[#0A0A0A]/40 mt-0.5">{stat.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#0A0A0A]">Revenue</h3>
            <span className="text-xs text-[#0A0A0A]/40">Last 6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#0A0A0A', opacity: 0.4 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#A8E6CF" strokeWidth={2} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* User Registration Chart */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#0A0A0A]">User Registrations</h3>
            <span className="text-xs text-[#0A0A0A]/40">Last 6 months</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userRegData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDA0DD" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DDA0DD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#0A0A0A', opacity: 0.4 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(v: number) => [`${v} users`, 'New']}
                />
                <Area type="monotone" dataKey="users" stroke="#DDA0DD" strokeWidth={2} fill="url(#userGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Transaction Volume */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[#0A0A0A]">Transaction Volume</h3>
            <span className="text-xs text-[#0A0A0A]/40">This week</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={txnVolData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#0A0A0A', opacity: 0.4 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(v: number) => [`${v} txns`, 'Volume']}
                />
                <Bar dataKey="volume" fill="#F4F7C0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Alert Feed */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="font-medium text-[#0A0A0A]">Recent Alerts</h3>
          </div>
          <span className="text-xs text-[#0A0A0A]/40">{recentAlerts.length} alerts</span>
        </div>
        <div className="space-y-2">
          {recentAlerts.length === 0 ? (
            <p className="text-sm text-[#0A0A0A]/40 text-center py-4">No alerts at this time</p>
          ) : (
            recentAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  Math.abs(alert.amount) > 10000 ? 'bg-[#FF6B6B]/15' : 'bg-[#F4F7C0]/30'
                }`}>
                  {Math.abs(alert.amount) > 10000 ? (
                    <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
                  ) : (
                    <Activity className="w-4 h-4 text-[#0A0A0A]/50" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0A0A0A]">{alert.description}</p>
                  <p className="text-xs text-[#0A0A0A]/40">
                    {alert.recipientName || 'System'} • {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`text-sm font-medium ${
                  alert.amount > 0 ? 'text-[#2ECC71]' : 'text-[#FF6B6B]'
                }`}>
                  {alert.amount > 0 ? '+' : ''}${Math.abs(alert.amount).toLocaleString()}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Recent Admin Actions */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-[#0A0A0A]">Recent Admin Actions</h3>
          <span className="text-xs text-[#0A0A0A]/40">Last 5 actions</span>
        </div>
        <div className="space-y-2">
          {adminActions.slice(0, 5).map((action) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/50"
            >
              <div className="w-8 h-8 rounded-full bg-[#A8E6CF]/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#0A0A0A]/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0A0A0A]">
                  {action.actionType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <p className="text-xs text-[#0A0A0A]/40">
                  {action.adminName} • {action.targetUserName || 'System'}
                </p>
              </div>
              <span className="text-xs text-[#0A0A0A]/30">
                {new Date(action.createdAt).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
