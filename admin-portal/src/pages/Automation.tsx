import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Play, Pause, Trash2, Edit, Bell, Shield, Activity, GitBranch, AlertCircle, Mail, MessageSquare } from 'lucide-react';
import * as api from '@/lib/api';

export default function Automation() {
  const [rules, setRules] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.automationApi.getAll().then((r: any) => setRules(r.data || []));
  }, []);

  const filtered = rules.filter((r) => filter === 'all' || r.status === filter);

  const toggleRule = async (id: string) => {
    await api.automationApi.toggle(id);
    setRules(rules.map((r) => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r));
  };

  const deleteRule = async (id: string) => {
    await api.automationApi.delete(id);
    setRules(rules.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Automation Engine</h1>
          <p className="text-slate-400 mt-1">Rules-based automation for fraud, compliance, and operations</p>
        </div>
        <button className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Rules', value: rules.filter((r) => r.status === 'active').length, color: 'emerald', icon: Zap },
          { label: 'Triggered Today', value: '1,247', color: 'blue', icon: Activity },
          { label: 'Paused', value: rules.filter((r) => r.status === 'paused').length, color: 'amber', icon: Pause },
          { label: 'Total Triggers', value: '142.5K', color: 'purple', icon: GitBranch },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
              </div>
              <s.icon className={`w-6 h-6 text-${s.color}-400`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'active', 'paused', 'draft'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm ${filter === f ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Rules grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((rule, i) => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{rule.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {rule.id} · created by {rule.createdBy}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                rule.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                rule.status === 'paused' ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {rule.status}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-blue-400 font-mono mb-1">IF</div>
                <div className="text-slate-200 font-mono text-xs">{rule.trigger}</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xs text-emerald-400 font-mono mb-1">THEN</div>
                <div className="text-slate-200 font-mono text-xs">{rule.action}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>Triggered {rule.triggeredCount.toLocaleString()} times</span>
              <span>Last: {new Date(rule.lastTriggered).toLocaleString()}</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => toggleRule(rule.id)}
                className="flex-1 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-sm rounded-lg flex items-center justify-center gap-1.5">
                {rule.status === 'active' ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Activate</>}
              </button>
              <button className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-white text-sm rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteRule(rule.id)} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}