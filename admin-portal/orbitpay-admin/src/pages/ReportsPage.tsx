import { useState } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, Users, DollarSign, CreditCard, Activity, FileText, BarChart3, PieChart, LineChart } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3, description: 'Complete platform summary' },
    { id: 'transactions', name: 'Transactions', icon: DollarSign, description: 'Transaction analysis' },
    { id: 'users', name: 'Users', icon: Users, description: 'User growth & activity' },
    { id: 'cards', name: 'Cards', icon: CreditCard, description: 'Card performance' },
    { id: 'loans', name: 'Loans', icon: Activity, description: 'Loan portfolio' },
    { id: 'compliance', name: 'Compliance', icon: FileText, description: 'Regulatory reports' },
  ];

  const quickStats = [
    { label: 'Total Revenue', value: '$2.5M', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'Active Users', value: '48,291', change: '+8.3%', trend: 'up', icon: Users },
    { label: 'Transaction Volume', value: '$15.2M', change: '+15.2%', trend: 'up', icon: Activity },
    { label: 'Avg. Processing Time', value: '1.2s', change: '-23%', trend: 'down', icon: TrendingDown },
  ];

  const recentReports = [
    { name: 'Monthly Performance Report - December 2024', date: 'Dec 31, 2024', size: '2.4 MB', type: 'PDF' },
    { name: 'User Activity Summary - Week 52', date: 'Dec 29, 2024', size: '1.8 MB', type: 'PDF' },
    { name: 'Transaction Audit Log', date: 'Dec 28, 2024', size: '5.2 MB', type: 'CSV' },
    { name: 'KYC Compliance Report - Q4 2024', date: 'Dec 27, 2024', size: '3.1 MB', type: 'PDF' },
    { name: 'Card Portfolio Analysis', date: 'Dec 26, 2024', size: '1.5 MB', type: 'XLSX' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-slate-400 mt-1">Generate and view platform reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-emerald-400" />
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Report Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      reportType === type.id
                        ? 'bg-emerald-500/10 border-emerald-500/50'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      reportType === type.id ? 'text-emerald-400' : 'text-slate-400'
                    }`} />
                    <p className={`font-medium ${
                      reportType === type.id ? 'text-white' : 'text-slate-300'
                    }`}>{type.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Preview */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Performance Trend</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  Revenue
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                  Users
                </span>
              </div>
            </div>
            {/* Placeholder for chart */}
            <div className="h-64 bg-slate-800/30 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Chart visualization</p>
                <p className="text-sm text-slate-500">Based on selected report type and date range</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
          </div>
          <div className="divide-y divide-slate-700/50">
            {recentReports.map((report, index) => (
              <div key={index} className="p-4 hover:bg-slate-800/30 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    report.type === 'PDF' ? 'bg-red-500/20' :
                    report.type === 'CSV' ? 'bg-green-500/20' :
                    'bg-emerald-500/20'
                  }`}>
                    <FileText className={`w-5 h-5 ${
                      report.type === 'PDF' ? 'text-red-400' :
                      report.type === 'CSV' ? 'text-green-400' :
                      'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{report.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{report.date}</span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-400">{report.size}</span>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700/50">
            <button className="w-full py-2 text-center text-emerald-400 hover:text-emerald-300 text-sm font-medium">
              View All Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
