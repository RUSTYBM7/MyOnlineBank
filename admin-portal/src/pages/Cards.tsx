import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, CreditCard, Snowflake, Ban, Eye, CheckCircle, AlertCircle, Download, RefreshCw, Loader2 } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import type { Card } from '@/store/adminStore';
import { Button, Badge, Modal, Select, Table, ProgressBar } from '@/components/ui';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Cards() {
  const { cards, freezeCard, unfreezeCard, blockCard, activateCard, fetchCards, isLoading } = useAdminStore();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      const matchesSearch = c.memberName.toLowerCase().includes(search.toLowerCase()) || c.last4.includes(search);
      const matchesType = typeFilter === 'all' || c.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [cards, search, typeFilter, statusFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFreeze = (c: Card) => { freezeCard(c.id); showToast(`Card ending ${c.last4} has been frozen`, 'success'); };
  const handleUnfreeze = (c: Card) => { unfreezeCard(c.id); showToast(`Card ending ${c.last4} has been unfrozen`, 'success'); };
  const handleBlock = (c: Card) => { blockCard(c.id); showToast(`Card ending ${c.last4} has been blocked`, 'success'); };
  const handleActivate = (c: Card) => { activateCard(c.id); showToast(`Card ending ${c.last4} has been activated`, 'success'); };

  const stats = { total: cards.length, active: cards.filter(c => c.status === 'active').length, frozen: cards.filter(c => c.status === 'frozen').length, blocked: cards.filter(c => c.status === 'blocked').length };

  const columns = [
    { key: 'member', header: 'Member', render: (c: Card) => <span className="text-white font-medium">{c.memberName}</span> },
    { key: 'type', header: 'Type', render: (c: Card) => <Badge variant="info">{c.type}</Badge> },
    { key: 'network', header: 'Network', render: (c: Card) => <span className="text-slate-400">{c.network}</span> },
    { key: 'last4', header: 'Card Number', render: (c: Card) => <span className="text-white font-mono">**** {c.last4}</span> },
    { key: 'expiry', header: 'Expiry', render: (c: Card) => <span className="text-slate-400">{c.expiryDate}</span> },
    { key: 'usage', header: 'Usage', render: (c: Card) => (
      <div className="w-24"><ProgressBar value={c.used} max={c.limit} color="blue" /><p className="text-xs text-slate-500 mt-1">${c.used.toLocaleString()}</p></div>
    )},
    { key: 'status', header: 'Status', render: (c: Card) => (
      <Badge variant={c.status === 'active' ? 'success' : c.status === 'frozen' ? 'warning' : 'danger'}>{c.status}</Badge>
    )},
    { key: 'actions', header: 'Actions', render: (c: Card) => (
      <div className="flex items-center gap-2">
        <button onClick={() => { setSelectedCard(c); setShowViewModal(true); }} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4" /></button>
        {c.status === 'active' && <button onClick={() => handleFreeze(c)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg" title="Freeze"><Snowflake className="w-4 h-4" /></button>}
        {c.status === 'frozen' && <button onClick={() => handleUnfreeze(c)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg" title="Unfreeze"><CheckCircle className="w-4 h-4" /></button>}
        {c.status !== 'blocked' && c.status !== 'pending' && <button onClick={() => handleBlock(c)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg" title="Block"><Ban className="w-4 h-4" /></button>}
        {c.status === 'pending' && <button onClick={() => handleActivate(c)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg" title="Activate"><CheckCircle className="w-4 h-4" /></button>}
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
        <div><h1 className="text-2xl font-bold text-white">Cards</h1><p className="text-slate-400 text-sm mt-1">Manage debit, credit, and virtual cards</p></div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Issue Card</Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: 'Total Cards', value: stats.total }, { label: 'Active', value: stats.active }, { label: 'Frozen', value: stats.frozen }, { label: 'Blocked', value: stats.blocked }].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-sm">{s.label}</p><p className="text-2xl font-bold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..." className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Types</option><option value="debit">Debit</option><option value="credit">Credit</option><option value="virtual">Virtual</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-300">
          <option value="all">All Status</option><option value="active">Active</option><option value="frozen">Frozen</option><option value="blocked">Blocked</option><option value="pending">Pending</option><option value="expired">Expired</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <Table columns={columns} data={filteredCards} keyExtractor={c => c.id} emptyMessage="No cards found" />
      </motion.div>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Card Details" size="lg">
        {selectedCard && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <CreditCard className="w-10 h-10 text-slate-400" />
                <span className="text-white font-bold">{selectedCard.network}</span>
              </div>
              <p className="text-2xl font-mono text-white tracking-wider mb-4">**** **** **** {selectedCard.last4}</p>
              <div className="flex justify-between"><div><p className="text-slate-500 text-xs">Card Holder</p><p className="text-white">{selectedCard.memberName}</p></div><div><p className="text-slate-500 text-xs">Expires</p><p className="text-white">{selectedCard.expiryDate}</p></div></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Type</p><p className="text-white capitalize">{selectedCard.type}</p></div>
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Status</p><Badge variant={selectedCard.status === 'active' ? 'success' : 'warning'}>{selectedCard.status}</Badge></div>
              <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-400 text-sm">Limit</p><p className="text-white">${selectedCard.limit.toLocaleString()}</p></div>
            </div>
            <div className="flex gap-3">
              {selectedCard.status === 'active' && <Button variant="secondary" onClick={() => { handleFreeze(selectedCard); setShowViewModal(false); }} icon={<Snowflake className="w-4 h-4" />}>Freeze</Button>}
              {selectedCard.status === 'frozen' && <Button variant="success" onClick={() => { handleUnfreeze(selectedCard); setShowViewModal(false); }} icon={<CheckCircle className="w-4 h-4" />}>Unfreeze</Button>}
              {selectedCard.status !== 'blocked' && selectedCard.status !== 'pending' && <Button variant="danger" onClick={() => { handleBlock(selectedCard); setShowViewModal(false); }} icon={<Ban className="w-4 h-4" />}>Block</Button>}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
