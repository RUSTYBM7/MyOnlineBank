import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Shield,
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react';

// Mock data
const stats = [
  {
    name: 'Total Members',
    value: '52,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'emerald'
  },
  {
    name: 'Total Assets',
    value: '$2.5B',
    change: '+8.2%',
    trend: 'up',
    icon: Wallet,
    color: 'teal'
  },
  {
    name: 'Active Cards',
    value: '34,291',
    change: '+5.3%',
    trend: 'up',
    icon: CreditCard,
    color: 'cyan'
  },
  {
    name: 'Pending KYC',
    value: '127',
    change: '-23.1%',
    trend: 'down',
    icon: Shield,
    color: 'amber'
  }
];

const recentTransactions = [
  {
    id: 'TXN001234',
    user: 'Michael Chen',
    email: 'michael.chen@email.com',
    type: 'Transfer',
    amount: '-$5,250.00',
    status: 'Completed',
    date: '2 mins ago'
  },
  {
    id: 'TXN001233',
    user: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    type: 'Payment',
    amount: '-$892.50',
    status: 'Completed',
    date: '5 mins ago'
  },
  {
    id: 'TXN001232',
    user: 'David Williams',
    email: 'david.w@email.com',
    type: 'Deposit',
    amount: '+$15,000.00',
    status: 'Completed',
    date: '12 mins ago'
  },
  {
    id: 'TXN001231',
    user: 'Emily Brown',
    email: 'emily.b@email.com',
    type: 'Withdrawal',
    amount: '-$2,100.00',
    status: 'Pending',
    date: '18 mins ago'
  },
  {
    id: 'TXN001230',
    user: 'James Wilson',
    email: 'james.w@email.com',
    type: 'Transfer',
    amount: '-$8,750.00',
    status: 'Completed',
    date: '25 mins ago'
  }
];

const kycPending = [
  {
    id: 'KYC001',
    name: 'Robert Martinez',
    email: 'robert.m@email.com',
    submitted: '2 hours ago',
    type: 'New Account'
  },
  {
    id: 'KYC002',
    name: 'Jennifer Lee',
    email: 'jennifer.l@email.com',
    submitted: '3 hours ago',
    type: 'Document Update'
  },
  {
    id: 'KYC003',
    name: 'William Taylor',
    email: 'william.t@email.com',
    submitted: '5 hours ago',
    type: 'New Account'
  }
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    teal: 'from-teal-500 to-teal-600',
    cyan: 'from-cyan-500 to-cyan-600',
    amber: 'from-amber-500 to-amber-600'
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
            <Activity className="w-4 h-4" />
            All systems operational
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-slate-400 text-sm">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
            <button
              onClick={() => navigate('/transactions')}
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{txn.user}</p>
                        <p className="text-xs text-slate-400">{txn.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">{txn.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${
                        txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {txn.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">{txn.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KYC Pending */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Pending KYC</h2>
            <span className="px-2 py-1 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-full">
              {kycPending.length} new
            </span>
          </div>
          <div className="p-6 space-y-4">
            {kycPending.map((kyc) => (
              <div
                key={kyc.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => navigate('/kyc')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {kyc.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{kyc.name}</p>
                    <p className="text-xs text-slate-400">{kyc.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">{kyc.type}</span>
                  <p className="text-xs text-slate-500">{kyc.submitted}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('/kyc')}
              className="w-full py-3 text-center text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              Review all pending applications
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add User', icon: Users, color: 'emerald' },
          { label: 'View Reports', icon: Activity, color: 'teal' },
          { label: 'System Status', icon: Shield, color: 'cyan' },
          { label: 'Support', icon: AlertTriangle, color: 'amber' }
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`flex items-center gap-3 p-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-${action.color}-500/50 transition-all group`}
            >
              <div className={`w-10 h-10 rounded-lg bg-${action.color}-500/20 flex items-center justify-center group-hover:bg-${action.color}-500/30 transition-colors`}>
                <Icon className={`w-5 h-5 text-${action.color}-400`} />
              </div>
              <span className="text-sm font-medium text-white">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
