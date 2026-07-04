import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import { Search, Download, FileText, DollarSign, Shield, AlertTriangle, Lock, User } from 'lucide-react';

const actionIcons: Record<string, React.ReactNode> = {
  add_funds: <DollarSign className="w-4 h-4 text-[#2ECC71]" />,
  debit_user: <DollarSign className="w-4 h-4 text-[#FF6B6B]" />,
  suspend_user: <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />,
  activate_user: <Shield className="w-4 h-4 text-[#2ECC71]" />,
  approve_kyc: <FileText className="w-4 h-4 text-[#A8E6CF]" />,
  update_user: <User className="w-4 h-4 text-[#DDA0DD]" />,
  flag_transaction: <AlertTriangle className="w-4 h-4 text-[#F4F7C0]" />,
};

const actionColors: Record<string, string> = {
  add_funds: 'bg-[#2ECC71]/10 text-[#2ECC71]',
  debit_user: 'bg-[#FF6B6B]/10 text-[#FF6B6B]',
  suspend_user: 'bg-[#FF6B6B]/10 text-[#FF6B6B]',
  activate_user: 'bg-[#2ECC71]/10 text-[#2ECC71]',
  approve_kyc: 'bg-[#A8E6CF]/10 text-[#0A0A0A]',
  update_user: 'bg-[#DDA0DD]/10 text-[#0A0A0A]',
  flag_transaction: 'bg-[#F4F7C0]/20 text-[#0A0A0A]',
};

export default function AuditLogs() {
  const { adminActions } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = adminActions.filter((a) => {
    const matchesSearch =
      a.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.targetUserName && a.targetUserName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.actionType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || a.actionType === filterType;
    return matchesSearch && matchesType;
  });

  const actionTypes = ['all', ...Array.from(new Set(adminActions.map((a) => a.actionType)))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0A0A0A]">Audit Logs</h1>
          <p className="text-sm text-[#0A0A0A]/50">{filtered.length} logged actions</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A0A0A]/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-56"
            />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="glass-input px-3 py-2.5 rounded-xl text-sm">
            {actionTypes.map((t) => (
              <option key={t} value={t}>{t === 'all' ? 'All Actions' : t.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <GlassButton variant="default" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </GlassButton>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Action</th>
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Admin</th>
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Target User</th>
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Reason</th>
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">IP Address</th>
                <th className="text-left text-xs font-medium text-[#0A0A0A]/50 uppercase px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((action, i) => (
                <motion.tr
                  key={action.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${actionColors[action.actionType]?.split(' ')[0] || 'bg-white/20'}`}>
                        {actionIcons[action.actionType] || <Lock className="w-4 h-4 text-[#0A0A0A]/40" />}
                      </div>
                      <span className="text-sm text-[#0A0A0A] capitalize">{action.actionType.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#0A0A0A]">{action.adminName}</td>
                  <td className="px-4 py-3 text-sm text-[#0A0A0A]/60">{action.targetUserName || '-'}</td>
                  <td className="px-4 py-3">
                    {action.amount ? (
                      <span className={`text-sm font-medium ${action.amount > 0 ? 'text-[#2ECC71]' : 'text-[#FF6B6B]'}`}>
                        {action.amount > 0 ? '+' : ''}${Math.abs(action.amount).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-sm text-[#0A0A0A]/30">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#0A0A0A]/40 max-w-[150px] truncate">{action.reason || '-'}</td>
                  <td className="px-4 py-3 text-sm font-mono text-[#0A0A0A]/40">{action.ipAddress}</td>
                  <td className="px-4 py-3 text-sm text-[#0A0A0A]/40">
                    {new Date(action.createdAt).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
