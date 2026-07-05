import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Filter, MoreVertical, Mail, Phone, Calendar,
  MapPin, Building2, Eye, Edit, Trash2, Ban, CheckCircle,
  XCircle, Download, UserPlus, RefreshCw, Shield, DollarSign,
  CreditCard, FileText, AlertTriangle, Loader2
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { Member } from '@/store/adminStore';
import { Button, Badge, Modal, Input, Select, Table, ProgressBar } from '@/components/ui';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Members() {
  const {
    members, accounts, cards, loans, transactions,
    addMember, updateMember, suspendMember, reactivateMember, deleteMember,
    fetchMembers, fetchAccounts, fetchCards, fetchLoans, fetchTransactions,
    isLoading
  } = useAdminStore();

  // Fetch data on mount
  useEffect(() => {
    fetchMembers();
    fetchAccounts();
    fetchCards();
    fetchLoans();
    fetchTransactions();
  }, [fetchMembers, fetchAccounts, fetchCards, fetchLoans, fetchTransactions]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'accounts' | 'cards' | 'loans' | 'transactions' | 'security'>('details');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', branch: 'Main Branch',
    status: 'pending', kycStatus: 'not_submitted'
  });

  // Filter and search
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch =
        m.firstName.toLowerCase().includes(search.toLowerCase()) ||
        m.lastName.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchesKyc = kycFilter === 'all' || m.kycStatus === kycFilter;
      const matchesBranch = branchFilter === 'all' || m.branch === branchFilter;
      return matchesSearch && matchesStatus && matchesKyc && matchesBranch;
    });
  }, [members, search, statusFilter, kycFilter, branchFilter]);

  const memberAccounts = useMemo(() => {
    if (!selectedMember) return [];
    return accounts.filter(a => a.memberId === selectedMember.id);
  }, [selectedMember, accounts]);

  const memberCards = useMemo(() => {
    if (!selectedMember) return [];
    return cards.filter(c => c.memberId === selectedMember.id);
  }, [selectedMember, cards]);

  const memberLoans = useMemo(() => {
    if (!selectedMember) return [];
    return loans.filter(l => l.memberId === selectedMember.id);
  }, [selectedMember, loans]);

  const memberTransactions = useMemo(() => {
    if (!selectedMember) return [];
    return transactions.filter(t => t.memberId === selectedMember.id);
  }, [selectedMember, transactions]);

  const branches = [...new Set(members.map(m => m.branch))];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddMember = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addMember({
      ...formData,
      joinDate: new Date().toISOString().split('T')[0],
      accountCount: 0,
      totalBalance: 0,
      lastLogin: '-'
    });
    setShowAddModal(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', branch: 'Main Branch', status: 'pending', kycStatus: 'not_submitted' });
    showToast('Member added successfully', 'success');
  };

  const handleEditMember = () => {
    if (!selectedMember || !formData.firstName || !formData.lastName) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    updateMember(selectedMember.id, formData);
    setShowEditModal(false);
    setSelectedMember({ ...selectedMember, ...formData });
    showToast('Member updated successfully', 'success');
  };

  const handleSuspendMember = (member: Member) => {
    suspendMember(member.id);
    showToast(`${member.firstName} ${member.lastName} has been suspended`, 'success');
  };

  const handleReactivateMember = (member: Member) => {
    reactivateMember(member.id);
    showToast(`${member.firstName} ${member.lastName} has been reactivated`, 'success');
  };

  const handleDeleteMember = (member: Member) => {
    if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}? This action cannot be undone.`)) {
      deleteMember(member.id);
      showToast('Member deleted successfully', 'success');
    }
  };

  const openViewModal = (member: Member) => {
    setSelectedMember(member);
    setShowViewModal(true);
    setActiveTab('details');
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      branch: member.branch,
      status: member.status,
      kycStatus: member.kycStatus
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getKycColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'not_submitted': return 'default';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Member',
      render: (m: Member) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">{m.firstName[0]}{m.lastName[0]}</span>
          </div>
          <div>
            <p className="text-white font-medium">{m.firstName} {m.lastName}</p>
            <p className="text-slate-500 text-xs">{m.email}</p>
          </div>
        </div>
      )
    },
    { key: 'id', header: 'ID', render: (m: Member) => <span className="text-slate-400 font-mono text-sm">{m.id}</span> },
    { key: 'phone', header: 'Phone', render: (m: Member) => <span className="text-slate-400">{m.phone}</span> },
    { key: 'branch', header: 'Branch', render: (m: Member) => <span className="text-slate-400">{m.branch}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (m: Member) => <Badge variant={getStatusColor(m.status) as 'success' | 'warning' | 'danger' | 'default'}>{m.status}</Badge>
    },
    {
      key: 'kycStatus',
      header: 'KYC',
      render: (m: Member) => <Badge variant={getKycColor(m.kycStatus) as 'success' | 'warning' | 'danger' | 'default'}>{m.kycStatus}</Badge>
    },
    {
      key: 'totalBalance',
      header: 'Balance',
      render: (m: Member) => <span className="text-white font-medium">${m.totalBalance.toLocaleString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m: Member) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openViewModal(m)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => openEditModal(m)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          {m.status === 'active' ? (
            <button onClick={() => handleSuspendMember(m)} className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors" title="Suspend">
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => handleReactivateMember(m)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Reactivate">
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${
            toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all credit union members</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={() => fetchMembers()}>Refresh</Button>
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Member</Button>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && members.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-slate-400">Loading members...</span>
        </div>
      )}

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: members.length, icon: UserPlus, color: 'emerald' },
          { label: 'Active', value: members.filter(m => m.status === 'active').length, icon: CheckCircle, color: 'emerald' },
          { label: 'Pending', value: members.filter(m => m.status === 'pending').length, icon: RefreshCw, color: 'amber' },
          { label: 'Suspended', value: members.filter(m => m.status === 'suspended').length, icon: Ban, color: 'red' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500/50">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="closed">Closed</option>
        </select>
        <select value={kycFilter} onChange={e => setKycFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500/50">
          <option value="all">All KYC</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="not_submitted">Not Submitted</option>
        </select>
        <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500/50">
          <option value="all">All Branches</option>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filteredMembers} keyExtractor={m => m.id} emptyMessage="No members found" />
      </motion.div>

      {/* Add Member Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Member" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" placeholder="John" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} required />
          <Input label="Last Name" placeholder="Doe" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} required />
          <Input label="Email" type="email" placeholder="john.doe@email.com" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} required />
          <Input label="Phone" type="tel" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
          <Select label="Branch" value={formData.branch} onChange={v => setFormData({ ...formData, branch: v })} options={branches.map(b => ({ value: b, label: b }))} />
          <Select label="Status" value={formData.status} onChange={v => setFormData({ ...formData, status: v })} options={[
            { value: 'pending', label: 'Pending' },
            { value: 'active', label: 'Active' },
          ]} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddMember} icon={<UserPlus className="w-4 h-4" />}>Add Member</Button>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Member" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" value={formData.firstName} onChange={v => setFormData({ ...formData, firstName: v })} required />
          <Input label="Last Name" value={formData.lastName} onChange={v => setFormData({ ...formData, lastName: v })} required />
          <Input label="Email" type="email" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} required />
          <Input label="Phone" value={formData.phone} onChange={v => setFormData({ ...formData, phone: v })} />
          <Select label="Branch" value={formData.branch} onChange={v => setFormData({ ...formData, branch: v })} options={branches.map(b => ({ value: b, label: b }))} />
          <Select label="Status" value={formData.status} onChange={v => setFormData({ ...formData, status: v })} options={[
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'suspended', label: 'Suspended' },
            { value: 'closed', label: 'Closed' },
          ]} />
          <Select label="KYC Status" value={formData.kycStatus} onChange={v => setFormData({ ...formData, kycStatus: v })} options={[
            { value: 'verified', label: 'Verified' },
            { value: 'pending', label: 'Pending' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'not_submitted', label: 'Not Submitted' },
          ]} />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="danger" onClick={() => selectedMember && handleDeleteMember(selectedMember)} icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEditMember} icon={<Edit className="w-4 h-4" />}>Save Changes</Button>
        </div>
      </Modal>

      {/* View Member Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Member Details" size="xl">
        {selectedMember && (
          <div className="space-y-6">
            {/* Member Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">{selectedMember.firstName[0]}{selectedMember.lastName[0]}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{selectedMember.firstName} {selectedMember.lastName}</h3>
                <p className="text-slate-400">{selectedMember.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant={getStatusColor(selectedMember.status) as 'success' | 'warning' | 'danger' | 'default'}>{selectedMember.status}</Badge>
                  <Badge variant={getKycColor(selectedMember.kycStatus) as 'success' | 'warning' | 'danger' | 'default'}>{selectedMember.kycStatus}</Badge>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setShowViewModal(false); openEditModal(selectedMember); }} icon={<Edit className="w-4 h-4" />}>Edit</Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-700">
              {(['details', 'accounts', 'cards', 'loans', 'transactions', 'security'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 ${
                    activeTab === tab ? 'text-emerald-400 border-emerald-400' : 'text-slate-400 border-transparent hover:text-slate-300'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-400"><Mail className="w-4 h-4" /> {selectedMember.email}</div>
                  <div className="flex items-center gap-3 text-slate-400"><Phone className="w-4 h-4" /> {selectedMember.phone}</div>
                  <div className="flex items-center gap-3 text-slate-400"><Building2 className="w-4 h-4" /> {selectedMember.branch}</div>
                  <div className="flex items-center gap-3 text-slate-400"><Calendar className="w-4 h-4" /> Joined {selectedMember.joinDate}</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Total Balance</p>
                  <p className="text-2xl font-bold text-white">${selectedMember.totalBalance.toLocaleString()}</p>
                  <p className="text-slate-500 text-sm mt-1">{selectedMember.accountCount} accounts</p>
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-3">
                {memberAccounts.length > 0 ? memberAccounts.map(acc => (
                  <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{acc.type.charAt(0).toUpperCase() + acc.type.slice(1)} Account</p>
                      <p className="text-slate-500 text-sm">{acc.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${acc.balance.toLocaleString()}</p>
                      <Badge variant={acc.status === 'active' ? 'success' : acc.status === 'frozen' ? 'warning' : 'danger'}>{acc.status}</Badge>
                    </div>
                  </div>
                )) : <p className="text-slate-500 text-center py-8">No accounts found</p>}
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="space-y-3">
                {memberCards.length > 0 ? memberCards.map(card => (
                  <div key={card.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{card.type.charAt(0).toUpperCase() + card.type.slice(1)} - {card.network}</p>
                      <p className="text-slate-500 text-sm">**** {card.last4}</p>
                    </div>
                    <Badge variant={card.status === 'active' ? 'success' : card.status === 'frozen' ? 'warning' : 'danger'}>{card.status}</Badge>
                  </div>
                )) : <p className="text-slate-500 text-center py-8">No cards found</p>}
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="space-y-3">
                {memberLoans.length > 0 ? memberLoans.map(loan => (
                  <div key={loan.id} className="p-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium">{loan.type.charAt(0).toUpperCase() + loan.type.slice(1)} Loan</p>
                      <Badge variant={loan.status === 'active' ? 'success' : loan.status === 'pending' ? 'warning' : 'danger'}>{loan.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                      <span>Balance: ${loan.balance.toLocaleString()}</span>
                      <span>{loan.rate}% APR</span>
                    </div>
                    <ProgressBar value={loan.progress} showLabel />
                  </div>
                )) : <p className="text-slate-500 text-center py-8">No loans found</p>}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-3">
                {memberTransactions.length > 0 ? memberTransactions.slice(0, 10).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-slate-500 text-sm">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={tx.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}>
                        {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                      </p>
                      <Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>{tx.status}</Badge>
                    </div>
                  </div>
                )) : <p className="text-slate-500 text-center py-8">No transactions found</p>}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-white">Password</p>
                      <p className="text-slate-500 text-sm">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Reset</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-white">Two-Factor Auth</p>
                      <p className="text-slate-500 text-sm">Not enabled</p>
                    </div>
                  </div>
                  <Button variant="primary" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-white">Session Activity</p>
                      <p className="text-slate-500 text-sm">Last login: {selectedMember.lastLogin}</p>
                    </div>
                  </div>
                  <Button variant="danger" size="sm">Force Logout</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
