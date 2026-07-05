import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Bitcoin, LineChart, Coins, Building, Activity } from 'lucide-react';
import * as api from '@/lib/api-live';

export default function Investments() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.investmentsApi.getAll().then((r: any) => setInvestments(r.data || []));
  }, []);

  const filtered = investments.filter((i) => filter === 'all' || i.type === filter);

  const totalValue = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalReturns = investments.reduce((s, i) => s + i.returns, 0);
  const totalPrincipal = investments.reduce((s, i) => s + i.principal, 0);
  const avgReturn = (totalReturns / totalPrincipal) * 100;

  const byType = (type: string) => investments.filter((i) => i.type === type);
  const typeBreakdown = ['stocks', 'crypto', 'etf', 'savings', 'bonds', 'mutual_funds'].map((t) => ({
    type: t,
    count: byType(t).length,
    value: byType(t).reduce((s, i) => s + i.currentValue, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Investment Management</h1>
        <p className="text-slate-400 mt-1">Member portfolio oversight: stocks, crypto, ETFs, savings, bonds, mutual funds</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total AUM', value: `$${(totalValue / 1000000).toFixed(2)}M`, color: 'emerald', icon: DollarSign },
          { label: 'Net Returns', value: `$${(totalReturns / 1000).toFixed(0)}K`, color: 'blue', icon: TrendingUp, subValue: `${avgReturn.toFixed(2)}%` },
          { label: 'Active Positions', value: investments.length.toLocaleString(), color: 'purple', icon: Activity },
          { label: 'Avg Return', value: `${avgReturn.toFixed(2)}%`, color: 'amber', icon: LineChart },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                {s.subValue && <p className="text-xs text-emerald-400 mt-1">{s.subValue}</p>}
              </div>
              <s.icon className={`w-6 h-6 text-${s.color}-400`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Type breakdown */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Portfolio by Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {typeBreakdown.map((t) => (
            <div key={t.type} className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider">{t.type.replace('_', ' ')}</p>
              <p className="text-xl font-bold text-white mt-1">${(t.value / 1000).toFixed(0)}K</p>
              <p className="text-xs text-slate-500 mt-1">{t.count} positions</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'stocks', 'crypto', 'etf', 'savings', 'bonds', 'mutual_funds'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm ${filter === f ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700'}`}>
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Investments table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Member Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/30 text-slate-400 text-sm">
              <tr>
                <th className="text-left py-3 px-4">Member</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Symbol</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-right py-3 px-4">Principal</th>
                <th className="text-right py-3 px-4">Current</th>
                <th className="text-right py-3 px-4">Returns</th>
                <th className="text-right py-3 px-4">%</th>
                <th className="text-left py-3 px-4">Purchased</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((inv) => (
                <tr key={inv.id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                  <td className="py-3 px-4 text-white text-sm">{inv.memberName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">{inv.type}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-sm">{inv.symbol}</td>
                  <td className="py-3 px-4 text-slate-300 text-sm">{inv.name}</td>
                  <td className="py-3 px-4 text-right text-slate-300 text-sm">${inv.principal.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-white text-sm font-medium">${inv.currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className={`py-3 px-4 text-right text-sm font-medium ${inv.returns >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {inv.returns >= 0 ? '+' : ''}${inv.returns.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`py-3 px-4 text-right text-sm font-medium ${inv.returnPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {inv.returnPercent >= 0 ? '+' : ''}{inv.returnPercent.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-sm">{new Date(inv.purchaseDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}