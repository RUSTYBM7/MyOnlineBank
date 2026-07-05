import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Wallet, CheckCircle, XCircle, Clock, Eye, AlertCircle, Check, Download, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { Loan } from '@/store/adminStore';
import { Button, Badge, Modal, Select, Table, ProgressBar } from '@/components/ui';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Loans() {
  const { loans, approveLoan, rejectLoan, fetchLoans, isLoading } = useAdminStore();

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredLoans = useMemo(() => {
    return loans.filter(l => {
      const matchesSearch = l.memberName.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || l.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [loans, search, typeFilter, statusFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (l: Loan) => { approveLoan(l.id); showToast(`Loan ${l.id} has been approved`, 'success'); };
  const handleReject = (l: Loan) => { rejectLoan(l.id); showToast(`Loan ${l.id} has been rejected`, 'success'); };

  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status === 'active').length,
    pending: loans.filter(l => l.status === 'pending').length,
    portfolio: loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.balance, 0),
    defaulted: loans.filter(l => l.status === 'defaulted').length,
  };

  const columns = [
    { key: 'id', header: 'Loan ID', render: (l: Loan) => <span className="text-slate-400 font-mono text-sm">{l.id}</span> },
    { key: 'member', header: 'Member', render: (l: Loan) => <span className="text-white font-medium">{l.memberName}</span> },
    { key: 'type', header: 'Type', render: (l: Loan) => <Badge variant="info">{l.type}</Badge> },
    { key: 'amount', header: 'Original', render: (l: Loan) => <span className="text-white">${l.amount.toLocaleString()}</span> },
    { key: 'balance', header: 'Balance', render: (l: Loan) => <span className="text-white font-medium">${l.balance.toLocaleString()}</span> },
    { key: 'rate', header: 'Rate', render: (l: Loan) => <span className="text-slate-400">{l.rate}%</span> },
    { key: 'progress', header: 'Progress', render: (l: Loan) => (
      <div className="w-24"><ProgressBar value={l.progress} showLabel color={l.progress > 50 ? 'emerald' : 'amber'} /></div>
    )},
    { key: 'status', header: 'Status', render: (l: Loan) => (
      <Badge variant={l.status === 'active' ? 'success' : l.status === 'pending' ? 'warning' : l.status === 'defaulted' ? 'danger' : 'default'}>{l.status}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: (l: Loan) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setSelectedLoan(l); setShowViewModal(true); }} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4" /></button>
        {l.status === 'pending' && (
          <>
            <button onClick={() => handleApprove(l)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg" title="Approve"><CheckCircle className="w-4 h-4" /></button>
            <button onClick={() => handleReject(l)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg" title="Reject"><XCircle className="w-4 h-4" /></button>
          </>
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
        <div><h1 className="text-2xl font-bold text-white">Loans</h1><p className="text-slate-400 text-sm mt-1">Manage loan portfolio and applications</p></div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>New Loan</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Loan Portfolio', value: `$${(stats.portfolio / 1000000).toFixed(1)}M`, color: 'emerald' },
          { label: 'Active Loans', value: stats.active, color: 'emerald' },
          { label: 'Pending Approval', value: stats.pending, color: 'amber' },
          { label: 'Defaulted', value: stats.defaulted, color: 'red' },
          { label: 'Total Loans', value: stats.total, color: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{s.label}</p><p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search loans..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Types</option><option value="personal">Personal</option><option value="home">Home</option><option value="auto">Auto</option><option value="business">Business</option><option value="student">Student</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="defaulted">Defaulted</option><option value="paid_off">Paid Off</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filteredLoans} keyExtractor={l => l.id} emptyMessage="No loans found" />
      </motion.div>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Loan Details" size="lg">
        {selectedLoan && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div>
                <p className="text-slate-400 text-sm">Loan ID</p><p className="text-white font-bold font-mono">{selectedLoan.id}</p>
              </div>
              <Badge variant={selectedLoan.status === 'active' ? 'success' : selectedLoan.status === 'pending' ? 'warning' : 'danger'}>{selectedLoan.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Original Amount</p><p className="text-xl font-bold text-white">${selectedLoan.amount.toLocaleString()}</p></div>
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Outstanding Balance</p><p className="text-xl font-bold text-white">${selectedLoan.balance.toLocaleString()}</p></div>
              <div><p className="text-slate-400 text-sm">Interest Rate</p><p className="text-white">{selectedLoan.rate}% APR</p></div>
              <div><p className="text-slate-400 text-sm">Loan Term</p><p className="text-white">{selectedLoan.term} months</p></div>
              <div><p className="text-slate-400 text-sm">Loan Type</p><p className="text-white capitalize">{selectedLoan.type}</p></div>
              <div><p className="text-slate-400 text-sm">Member</p><p className="text-white">{selectedLoan.memberName}</p></div>
              <div><p className="text-slate-400 text-sm">Start Date</p><p className="text-white">{selectedLoan.startDate}</p></div>
              <div><p className="text-slate-400 text-sm">Next Payment</p><p className="text-white">{selectedLoan.nextPayment}</p></div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-2">Repayment Progress</p>
              <ProgressBar value={selectedLoan.progress} showLabel color={selectedLoan.progress > 50 ? 'emerald' : 'amber'} size="md" />
            </div>
            {selectedLoan.status === 'pending' && (
              <div className="flex gap-3">
                <Button variant="success" onClick={() => { handleApprove(selectedLoan); setShowViewModal(false); }} icon={<Check className="w-4 h-4" />}>Approve Loan</Button>
                <Button variant="danger" onClick={() => { handleReject(selectedLoan); setShowViewModal(false); }} icon={<XCircle className="w-4 h-4" />}>Reject Loan</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
