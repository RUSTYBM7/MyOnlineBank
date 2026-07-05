import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ArrowUpRight, ArrowDownRight, RefreshCw, Eye, RotateCcw, AlertCircle, CheckCircle, Filter, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { Transaction } from '@/store/adminStore';
import { Button, Badge, Modal, Table } from '@/components/ui';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Transactions() {
  const { transactions, reverseTransaction, fetchTransactions, isLoading } = useAdminStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.id.toLowerCase().includes(search.toLowerCase()) || tx.memberName.toLowerCase().includes(search.toLowerCase()) || tx.reference.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReverse = (tx: Transaction) => {
    if (confirm('Are you sure you want to reverse this transaction?')) {
      reverseTransaction(tx.id);
      showToast(`Transaction ${tx.id} has been reversed`, 'success');
    }
  };

  const stats = {
    total: transactions.length,
    volume: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    completed: transactions.filter(tx => tx.status === 'completed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
    failed: transactions.filter(tx => tx.status === 'failed').length,
  };

  const columns = [
    { key: 'id', header: 'ID', render: (tx: Transaction) => <span className="text-slate-400 font-mono text-sm">{tx.id}</span> },
    { key: 'member', header: 'Member', render: (tx: Transaction) => <span className="text-white font-medium">{tx.memberName}</span> },
    { key: 'type', header: 'Type', render: (tx: Transaction) => (
      <span className="flex items-center gap-1.5 text-slate-300 capitalize">
        {tx.type === 'withdrawal' ? <ArrowUpRight className="w-4 h-4 text-red-400" /> :
         tx.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-emerald-400" /> :
         <RefreshCw className="w-4 h-4 text-blue-400" />}
        {tx.type}
      </span>
    )},
    { key: 'amount', header: 'Amount', render: (tx: Transaction) => (
      <span className={`font-semibold ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
        {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
      </span>
    )},
    { key: 'description', header: 'Description', render: (tx: Transaction) => <span className="text-slate-400">{tx.description}</span> },
    { key: 'reference', header: 'Reference', render: (tx: Transaction) => <span className="text-slate-500 text-sm">{tx.reference}</span> },
    { key: 'date', header: 'Date', render: (tx: Transaction) => <span className="text-slate-400 text-sm">{tx.date}</span> },
    { key: 'status', header: 'Status', render: (tx: Transaction) => (
      <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}>{tx.status}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: (tx: Transaction) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setSelectedTx(tx); setShowViewModal(true); }} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4" /></button>
        {tx.status === 'completed' && (
          <button onClick={() => handleReverse(tx)} className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg" title="Reverse"><RotateCcw className="w-4 h-4" /></button>
        )}
      </div>
    )}
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Transactions</h1><p className="text-slate-400 text-sm mt-1">View and manage all transactions</p></div>
        <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Volume', value: `$${(stats.volume / 1000000).toFixed(2)}M`, color: 'blue' },
          { label: 'Total Transactions', value: stats.total, color: 'emerald' },
          { label: 'Completed', value: stats.completed, color: 'emerald' },
          { label: 'Pending', value: stats.pending, color: 'amber' },
          { label: 'Failed', value: stats.failed, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Types</option>
          <option value="transfer">Transfer</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="deposit">Deposit</option>
          <option value="payment">Payment</option>
          <option value="refund">Refund</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="reversed">Reversed</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filteredTransactions} keyExtractor={tx => tx.id} emptyMessage="No transactions found" />
      </motion.div>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Transaction Details" size="lg">
        {selectedTx && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="text-slate-400 text-sm">Transaction ID</p>
                <p className="text-white font-bold font-mono">{selectedTx.id}</p>
              </div>
              <Badge variant={selectedTx.status === 'completed' ? 'success' : selectedTx.status === 'pending' ? 'warning' : 'danger'}>
                {selectedTx.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Amount</p>
                <p className={`text-2xl font-bold ${selectedTx.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedTx.type === 'withdrawal' ? '-' : '+'}${selectedTx.amount.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-1">Type</p>
                <p className="text-white font-medium capitalize">{selectedTx.type}</p>
              </div>
              <div><p className="text-slate-400 text-sm">Member</p><p className="text-white">{selectedTx.memberName}</p></div>
              <div><p className="text-slate-400 text-sm">Date & Time</p><p className="text-white">{selectedTx.date}</p></div>
              <div><p className="text-slate-400 text-sm">Description</p><p className="text-white">{selectedTx.description}</p></div>
              <div><p className="text-slate-400 text-sm">Reference</p><p className="text-white font-mono">{selectedTx.reference}</p></div>
            </div>
            {selectedTx.status === 'completed' && (
              <Button variant="warning" onClick={() => { handleReverse(selectedTx); setShowViewModal(false); }} icon={<RotateCcw className="w-4 h-4" />}>Reverse Transaction</Button>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
