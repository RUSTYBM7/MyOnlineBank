import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  Search, Filter, Eye, Edit3, DollarSign, MinusCircle,
  UserX, UserCheck, X, Check, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalType = 'view' | 'edit' | 'addFunds' | 'debit' | 'suspend' | null;

interface UserManagementProps {
  searchQuery: string;
}

export default function UserManagement({ searchQuery: propSearchQuery }: UserManagementProps) {
  const {
    users, transactions, addFunds, debitUser, suspendUser, activateUser,
    impersonateUser, updateUser, admin,
  } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundCurrency, setFundCurrency] = useState('USD');
  const [fundNote, setFundNote] = useState('');
  const [debitReason, setDebitReason] = useState('');
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = propSearchQuery || localSearch;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || u.accountStatus === statusFilter;
    const matchesKyc = kycFilter === 'all' || u.kycStatus === kycFilter;
    return matchesSearch && matchesStatus && matchesKyc;
  });

  const user = users.find((u) => u.id === selectedUser);
  const userTransactions = transactions.filter((t) => t.userId === selectedUser).slice(0, 10);

  const handleAddFunds = () => {
    if (!user || !fundAmount || !admin) return;
    addFunds(user.id, Number(fundAmount), fundCurrency, admin.id, fundNote);
    setModalType(null);
    setFundAmount('');
    setFundNote('');
  };

  const handleDebit = () => {
    if (!user || !fundAmount || !admin) return;
    debitUser(user.id, Number(fundAmount), fundCurrency, admin.id, debitReason);
    setModalType(null);
    setFundAmount('');
    setDebitReason('');
  };

  const handleUpdateUser = () => {
    if (!user) return;
    updateUser(user.id, editForm);
    setModalType(null);
  };

  const openModal = (type: ModalType, userId: string) => {
    setSelectedUser(userId);
    setModalType(type);
    const u = users.find((us) => us.id === userId);
    if (u) {
      setEditForm({
        fullName: u.fullName,
        email: u.email,
        phone: u.phone,
        address: u.address,
        dailyLimit: u.dailyLimit,
        weeklyLimit: u.weeklyLimit,
        monthlyLimit: u.monthlyLimit,
        tier: u.tier,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-800">User Management</h1>
          <p className="text-sm text-emerald-800/50">{filteredUsers.length} users found</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-800/30" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search users..."
              className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              showFilters ? 'bg-emerald-800 text-white' : 'glass-button'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-4 flex flex-wrap gap-4">
              <div>
                <label className="text-xs text-emerald-800/50 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="glass-input px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="frozen">Frozen</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-emerald-800/50 mb-1 block">KYC</label>
                <select
                  value={kycFilter}
                  onChange={(e) => setKycFilter(e.target.value)}
                  className="glass-input px-3 py-2 rounded-lg text-sm"
                >
                  <option value="all">All KYC</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-200/20">
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">Contact</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">Balance</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">KYC</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">Tier</th>
                <th className="text-left text-xs font-medium text-emerald-800/50 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={u.avatar} alt="" className="w-9 h-9 rounded-full" />
                        {u.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2ECC71] rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-800">{u.fullName}</p>
                        <p className="text-xs text-emerald-800/40">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-emerald-800">{u.email}</p>
                    <p className="text-xs text-emerald-800/40">{u.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-emerald-800">
                      ${u.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-emerald-800/40">{u.balanceBtc} BTC</p>
                  </td>
                  <td className="px-4 py-3">
                    <GlassBadge
                      variant={u.accountStatus === 'active' ? 'green' : u.accountStatus === 'suspended' ? 'red' : 'yellow'}
                      size="sm"
                    >
                      {u.accountStatus}
                    </GlassBadge>
                  </td>
                  <td className="px-4 py-3">
                    <GlassBadge
                      variant={u.kycStatus === 'verified' ? 'green' : u.kycStatus === 'pending' ? 'yellow' : 'red'}
                      size="sm"
                    >
                      {u.kycStatus}
                    </GlassBadge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-emerald-800/70 capitalize">{u.tier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openModal('view', u.id)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center" title="View">
                        <Eye className="w-4 h-4 text-emerald-800/50" />
                      </button>
                      <button onClick={() => openModal('edit', u.id)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center" title="Edit">
                        <Edit3 className="w-4 h-4 text-emerald-800/50" />
                      </button>
                      <button onClick={() => openModal('addFunds', u.id)} className="w-8 h-8 rounded-lg hover:bg-[#2ECC71]/10 flex items-center justify-center" title="Add Funds">
                        <DollarSign className="w-4 h-4 text-[#2ECC71]" />
                      </button>
                      <button onClick={() => openModal('debit', u.id)} className="w-8 h-8 rounded-lg hover:bg-[#FF6B6B]/10 flex items-center justify-center" title="Debit">
                        <MinusCircle className="w-4 h-4 text-[#FF6B6B]" />
                      </button>
                      {u.accountStatus === 'active' ? (
                        <button onClick={() => { setSelectedUser(u.id); setModalType('suspend'); }} className="w-8 h-8 rounded-lg hover:bg-[#FF6B6B]/10 flex items-center justify-center" title="Suspend">
                          <UserX className="w-4 h-4 text-[#FF6B6B]" />
                        </button>
                      ) : (
                        <button onClick={() => activateUser(u.id)} className="w-8 h-8 rounded-lg hover:bg-[#2ECC71]/10 flex items-center justify-center" title="Activate">
                          <UserCheck className="w-4 h-4 text-[#2ECC71]" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modal */}
      <AnimatePresence>
        {modalType && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalType(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-surface-strong rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              {/* View User */}
              {modalType === 'view' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-emerald-800">User Profile</h2>
                    <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={user.avatar} alt="" className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="text-lg font-medium text-emerald-800">{user.fullName}</h3>
                      <p className="text-sm text-emerald-800/50">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        <GlassBadge variant="mint" size="sm">{user.tier}</GlassBadge>
                        <GlassBadge variant={user.accountStatus === 'active' ? 'green' : 'red'} size="sm">{user.accountStatus}</GlassBadge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <GlassCard className="p-3 text-center"><p className="text-lg font-medium">${user.balanceUsd.toLocaleString()}</p><p className="text-xs text-emerald-800/40">USD Balance</p></GlassCard>
                    <GlassCard className="p-3 text-center"><p className="text-lg font-medium">{user.balanceBtc}</p><p className="text-xs text-emerald-800/40">BTC Balance</p></GlassCard>
                    <GlassCard className="p-3 text-center"><p className="text-lg font-medium">${user.dailyLimit.toLocaleString()}</p><p className="text-xs text-emerald-800/40">Daily Limit</p></GlassCard>
                    <GlassCard className="p-3 text-center"><p className="text-lg font-medium">{user.isOnline ? 'Online' : 'Offline'}</p><p className="text-xs text-emerald-800/40">Status</p></GlassCard>
                  </div>
                  <h4 className="font-medium text-emerald-800 mb-3">Recent Transactions</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userTransactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-white/30">
                        <span className="text-sm text-emerald-800">{t.description}</span>
                        <span className={`text-sm font-medium ${t.amount > 0 ? 'text-[#2ECC71]' : 'text-[#FF6B6B]'}`}>
                          {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <GlassButton variant="primary" fullWidth onClick={() => { impersonateUser(user.id); window.open('/app', '_blank'); }}>
                      <Eye className="w-4 h-4" /> Impersonate
                    </GlassButton>
                  </div>
                </div>
              )}

              {/* Edit User */}
              {modalType === 'edit' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-emerald-800">Edit User</h2>
                    <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { key: 'fullName', label: 'Full Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'address', label: 'Address' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-xs text-emerald-800/50 mb-1 block">{field.label}</label>
                        <input
                          type="text"
                          value={editForm[field.key] || ''}
                          onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                          className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'dailyLimit', label: 'Daily Limit' },
                        { key: 'weeklyLimit', label: 'Weekly' },
                        { key: 'monthlyLimit', label: 'Monthly' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="text-xs text-emerald-800/50 mb-1 block">{field.label}</label>
                          <input
                            type="number"
                            value={editForm[field.key] || ''}
                            onChange={(e) => setEditForm({ ...editForm, [field.key]: Number(e.target.value) })}
                            className="w-full glass-input px-3 py-2.5 rounded-xl text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Account Tier</label>
                      <select
                        value={editForm.tier || ''}
                        onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      >
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <GlassButton variant="primary" fullWidth onClick={handleUpdateUser}>
                      <Check className="w-4 h-4" /> Save Changes
                    </GlassButton>
                  </div>
                </div>
              )}

              {/* Add Funds */}
              {modalType === 'addFunds' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-emerald-800">Add Funds</h2>
                    <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/30">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">{user.fullName}</p>
                      <p className="text-xs text-emerald-800/40">Current: ${user.balanceUsd.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Amount</label>
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full glass-input px-4 py-3 rounded-xl text-2xl text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Currency</label>
                      <select
                        value={fundCurrency}
                        onChange={(e) => setFundCurrency(e.target.value)}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BTC">BTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Note / Reference</label>
                      <input
                        type="text"
                        value={fundNote}
                        onChange={(e) => setFundNote(e.target.value)}
                        placeholder="Internal note..."
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                    <GlassButton variant="primary" fullWidth onClick={handleAddFunds} disabled={!fundAmount || Number(fundAmount) <= 0}>
                      <DollarSign className="w-4 h-4" /> Add Funds
                    </GlassButton>
                  </div>
                </div>
              )}

              {/* Debit User */}
              {modalType === 'debit' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-emerald-800">Debit User</h2>
                    <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/30">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">{user.fullName}</p>
                      <p className="text-xs text-emerald-800/40">Available: ${user.balanceUsd.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Amount (max ${user.balanceUsd.toLocaleString()})</label>
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="0.00"
                        max={user.balanceUsd}
                        className="w-full glass-input px-4 py-3 rounded-xl text-2xl text-center"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Currency</label>
                      <select
                        value={fundCurrency}
                        onChange={(e) => setFundCurrency(e.target.value)}
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BTC">BTC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-emerald-800/50 mb-1 block">Reason</label>
                      <input
                        type="text"
                        value={debitReason}
                        onChange={(e) => setDebitReason(e.target.value)}
                        placeholder="Reason for debit..."
                        className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                      />
                    </div>
                    {Number(fundAmount) > user.balanceUsd && (
                      <p className="text-sm text-[#FF6B6B]">Amount exceeds available balance</p>
                    )}
                    <GlassButton
                      variant="danger"
                      fullWidth
                      onClick={handleDebit}
                      disabled={!fundAmount || Number(fundAmount) <= 0 || Number(fundAmount) > user.balanceUsd}
                    >
                      <MinusCircle className="w-4 h-4" /> Debit Account
                    </GlassButton>
                  </div>
                </div>
              )}

              {/* Suspend Confirm */}
              {modalType === 'suspend' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#FF6B6B]">Suspend User</h2>
                    <button onClick={() => setModalType(null)} className="w-8 h-8 rounded-lg hover:bg-white/30 flex items-center justify-center">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-[#FF6B6B]/10">
                    <AlertTriangle className="w-8 h-8 text-[#FF6B6B]" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">You are about to suspend {user.fullName}</p>
                      <p className="text-xs text-emerald-800/50">All outgoing transactions will be blocked.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GlassButton variant="default" fullWidth onClick={() => setModalType(null)}>Cancel</GlassButton>
                    <GlassButton
                      variant="danger"
                      fullWidth
                      onClick={() => { suspendUser(user.id); setModalType(null); }}
                    >
                      <UserX className="w-4 h-4" /> Confirm Suspend
                    </GlassButton>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
