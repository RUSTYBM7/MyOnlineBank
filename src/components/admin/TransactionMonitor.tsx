import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import { Search, ArrowUpRight, ArrowDownRight, Pause, Play, Flag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionMonitorProps {
  searchQuery: string;
}

export default function TransactionMonitor({ searchQuery: propSearchQuery }: TransactionMonitorProps) {
  const { transactions, updateTransaction } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const searchQuery = propSearchQuery || localSearch;

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.recipientName && t.recipientName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAction = (id: string, action: string) => {
    const statusMap: Record<string, string> = {
      hold: 'held',
      release: 'completed',
      approve: 'completed',
      flag: 'flagged',
    };
    updateTransaction(id, { status: statusMap[action] as any });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-800">Transaction Monitor</h1>
          <p className="text-sm text-emerald-800/50">{filtered.length} transactions</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/30" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search transactions..."
              className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-64"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="glass-input px-3 py-2.5 rounded-xl text-sm">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="held">Held</option>
            <option value="flagged">Flagged</option>
            <option value="failed">Failed</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="glass-input px-3 py-2.5 rounded-xl text-sm">
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
            <option value="investment">Investment</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-200/20">
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">ID</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">Description</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">Admin</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((txn, i) => (
                <motion.tr
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-emerald-800/60">{txn.id.slice(0, 12)}...</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {txn.amount > 0 ? (
                        <ArrowDownRight className="w-4 h-4 text-[#2ECC71]" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-[#FF6B6B]" />
                      )}
                      <span className="text-sm text-emerald-800 capitalize">{txn.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-800 max-w-[200px] truncate">{txn.description}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-sm font-medium', txn.amount > 0 ? 'text-[#2ECC71]' : 'text-[#FF6B6B]')}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString('en-US', { style: 'currency', currency: txn.currency })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <GlassBadge
                      variant={txn.status === 'completed' ? 'green' : txn.status === 'pending' ? 'yellow' : txn.status === 'held' ? 'lavender' : 'red'}
                      size="sm"
                    >
                      {txn.status}
                    </GlassBadge>
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-800/50">{txn.adminId ? 'Admin' : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {txn.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(txn.id, 'hold')} className="w-7 h-7 rounded-lg hover:bg-[#DDA0DD]/10 flex items-center justify-center" title="Hold">
                            <Pause className="w-3.5 h-3.5 text-[#DDA0DD]" />
                          </button>
                          <button onClick={() => handleAction(txn.id, 'approve')} className="w-7 h-7 rounded-lg hover:bg-[#2ECC71]/10 flex items-center justify-center" title="Approve">
                            <Check className="w-3.5 h-3.5 text-[#2ECC71]" />
                          </button>
                        </>
                      )}
                      {txn.status === 'held' && (
                        <button onClick={() => handleAction(txn.id, 'release')} className="w-7 h-7 rounded-lg hover:bg-[#2ECC71]/10 flex items-center justify-center" title="Release">
                          <Play className="w-3.5 h-3.5 text-[#2ECC71]" />
                        </button>
                      )}
                      <button onClick={() => handleAction(txn.id, 'flag')} className="w-7 h-7 rounded-lg hover:bg-[#FF6B6B]/10 flex items-center justify-center" title="Flag">
                        <Flag className="w-3.5 h-3.5 text-[#FF6B6B]" />
                      </button>
                    </div>
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
