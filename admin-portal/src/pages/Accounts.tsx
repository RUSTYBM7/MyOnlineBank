import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Eye, Edit, Snowflake, Unlock, XCircle, Download, DollarSign, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { Account } from '@/store/adminStore';
import { Button, Badge, Modal, Input, Select, Table, ProgressBar } from '@/components/ui';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Accounts() {
  const { accounts, members, freezeAccount, unfreezeAccount, closeAccount, fetchAccounts, fetchMembers, isLoading } = useAdminStore();

  useEffect(() => {
    fetchAccounts();
    fetchMembers();
  }, [fetchAccounts, fetchMembers]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({ memberId: '', type: 'savings', branch: 'Main Branch', initialDeposit: '' });

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const member = members.find(m => m.id === acc.memberId);
      const matchesSearch = acc.accountNumber.includes(search) || (member?.firstName + ' ' + member?.lastName).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
      const matchesType = typeFilter === 'all' || acc.type === typeFilter;
      const matchesBranch = branchFilter === 'all' || acc.branch === branchFilter;
      return matchesSearch && matchesStatus && matchesType && matchesBranch;
    });
  }, [accounts, members, search, statusFilter, typeFilter, branchFilter]);

  const branches = [...new Set(accounts.map(a => a.branch))];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFreeze = (acc: Account) => {
    freezeAccount(acc.id);
    showToast(`Account ${acc.accountNumber} has been frozen`, 'success');
  };

  const handleUnfreeze = (acc: Account) => {
    unfreezeAccount(acc.id);
    showToast(`Account ${acc.accountNumber} has been unfrozen`, 'success');
  };

  const handleClose = (acc: Account) => {
    if (confirm('Are you sure you want to close this account? This action cannot be undone.')) {
      closeAccount(acc.id);
      showToast(`Account ${acc.accountNumber} has been closed`, 'success');
    }
  };

  const columns = [
    { key: 'member', header: 'Member', render: (a: Account) => <span className="text-white font-medium">{a.memberName}</span> },
    { key: 'type', header: 'Type', render: (a: Account) => <span className="text-slate-400 capitalize">{a.type}</span> },
    { key: 'accountNumber', header: 'Account #', render: (a: Account) => <span className="text-slate-400 font-mono">{a.accountNumber}</span> },
    { key: 'balance', header: 'Balance', render: (a: Account) => <span className="text-white font-medium">${a.balance.toLocaleString()}</span> },
    { key: 'interestRate', header: 'Interest', render: (a: Account) => <span className="text-slate-400">{a.interestRate > 0 ? `${a.interestRate}%` : '-'}</span> },
    { key: 'branch', header: 'Branch', render: (a: Account) => <span className="text-slate-400">{a.branch}</span> },
    { key: 'status', header: 'Status', render: (a: Account) => <Badge variant={a.status === 'active' ? 'success' : a.status === 'frozen' ? 'warning' : 'danger'}>{a.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (a: Account) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setSelectedAccount(a); setShowViewModal(true); }} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4" /></button>
        {a.status === 'active' ? (
          <button onClick={() => handleFreeze(a)} className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg" title="Freeze"><Snowflake className="w-4 h-4" /></button>
        ) : a.status === 'frozen' ? (
          <button onClick={() => handleUnfreeze(a)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg" title="Unfreeze"><Unlock className="w-4 h-4" /></button>
        ) : null}
        {a.status !== 'closed' && (
          <button onClick={() => handleClose(a)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg" title="Close"><XCircle className="w-4 h-4" /></button>
        )}
      </div>
    )}
  ];

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    frozen: accounts.filter(a => a.status === 'frozen').length,
    totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0)
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Accounts</h1><p className="text-slate-400 text-sm mt-1">Manage all member accounts</p></div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Open Account</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Accounts', value: stats.total, color: 'emerald' },
          { label: 'Active', value: stats.active, color: 'emerald' },
          { label: 'Frozen', value: stats.frozen, color: 'amber' },
          { label: 'Total Balance', value: `$${(stats.totalBalance / 1000000).toFixed(1)}M`, color: 'blue' },
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
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search accounts..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
          <option value="closed">Closed</option>
          <option value="dormant">Dormant</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Types</option>
          <option value="savings">Savings</option>
          <option value="checking">Checking</option>
          <option value="business">Business</option>
          <option value="joint">Joint</option>
          <option value="student">Student</option>
          <option value="youth">Youth</option>
          <option value="premium">Premium</option>
          <option value="retirement">Retirement</option>
        </select>
        <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Branches</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filteredAccounts} keyExtractor={a => a.id} emptyMessage="No accounts found" />
      </motion.div>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Account Details" size="lg">
        {selectedAccount && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div><p className="text-slate-400 text-sm">Account Number</p><p className="text-white font-bold font-mono">{selectedAccount.accountNumber}</p></div>
              <Badge variant={selectedAccount.status === 'active' ? 'success' : 'warning'}>{selectedAccount.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Balance</p><p className="text-2xl font-bold text-white">${selectedAccount.balance.toLocaleString()}</p></div>
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Interest Rate</p><p className="text-2xl font-bold text-white">{selectedAccount.interestRate}%</p></div>
              <div><p className="text-slate-400 text-sm">Account Type</p><p className="text-white capitalize">{selectedAccount.type}</p></div>
              <div><p className="text-slate-400 text-sm">Branch</p><p className="text-white">{selectedAccount.branch}</p></div>
              <div><p className="text-slate-400 text-sm">Opened Date</p><p className="text-white">{selectedAccount.openedDate}</p></div>
              <div><p className="text-slate-400 text-sm">Account Holder</p><p className="text-white">{selectedAccount.memberName}</p></div>
            </div>
            <div className="flex gap-3">
              {selectedAccount.status === 'active' && <Button variant="warning" onClick={() => { handleFreeze(selectedAccount); setShowViewModal(false); }} icon={<Snowflake className="w-4 h-4" />}>Freeze Account</Button>}
              {selectedAccount.status === 'frozen' && <Button variant="success" onClick={() => { handleUnfreeze(selectedAccount); setShowViewModal(false); }} icon={<Unlock className="w-4 h-4" />}>Unfreeze Account</Button>}
              {selectedAccount.status !== 'closed' && <Button variant="danger" onClick={() => { handleClose(selectedAccount); setShowViewModal(false); }} icon={<XCircle className="w-4 h-4" />}>Close Account</Button>}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
