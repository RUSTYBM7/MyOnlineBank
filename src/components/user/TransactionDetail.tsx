import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import { ArrowLeft, Share2, Receipt, Check, Clock, X } from 'lucide-react';

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions } = useStore();

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <div className="p-5">
        <button onClick={() => navigate('/app')} className="flex items-center gap-2 text-[#0A0A0A]/50">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <p className="mt-8 text-center text-[#0A0A0A]/40">Transaction not found</p>
      </div>
    );
  }

  const statusConfig = {
    completed: { icon: <Check className="w-6 h-6" />, color: 'text-[#2ECC71]', bg: 'bg-[#2ECC71]/15' },
    pending: { icon: <Clock className="w-6 h-6" />, color: 'text-[#F4F7C0]', bg: 'bg-[#F4F7C0]/20' },
    failed: { icon: <X className="w-6 h-6" />, color: 'text-[#FF6B6B]', bg: 'bg-[#FF6B6B]/15' },
    held: { icon: <Clock className="w-6 h-6" />, color: 'text-[#DDA0DD]', bg: 'bg-[#DDA0DD]/15' },
    flagged: { icon: <X className="w-6 h-6" />, color: 'text-[#FF6B6B]', bg: 'bg-[#FF6B6B]/15' },
  };

  const status = statusConfig[transaction.status];

  return (
    <div className="min-h-screen bg-[#F7F9F4] p-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/app')}
          className="w-10 h-10 glass-button rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-xl font-medium text-[#0A0A0A]">Transaction</h1>
      </div>

      {/* Status Card */}
      <GlassCard intensity="high" className="p-6 text-center mb-5">
        <div className={`w-16 h-16 rounded-full ${status.bg} ${status.color} flex items-center justify-center mx-auto mb-4`}>
          {status.icon}
        </div>
        <h2 className="text-3xl font-light text-[#0A0A0A] mb-1">
          {transaction.amount > 0 ? '+' : ''}
          {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: transaction.currency })}
        </h2>
        <GlassBadge
          variant={transaction.status === 'completed' ? 'green' : transaction.status === 'pending' ? 'yellow' : 'red'}
          size="md"
          className="mt-2"
        >
          {transaction.status}
        </GlassBadge>
      </GlassCard>

      {/* Details */}
      <GlassCard className="p-5 space-y-4 mb-5">
        <h3 className="font-medium text-[#0A0A0A]">Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-[#0A0A0A]/40">Transaction ID</span>
            <span className="text-sm font-medium text-[#0A0A0A] font-mono">{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#0A0A0A]/40">Type</span>
            <span className="text-sm font-medium text-[#0A0A0A] capitalize">{transaction.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#0A0A0A]/40">Description</span>
            <span className="text-sm font-medium text-[#0A0A0A] text-right max-w-[50%]">{transaction.description}</span>
          </div>
          {transaction.recipientName && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#0A0A0A]/40">Recipient</span>
              <div className="flex items-center gap-2">
                {transaction.recipientAvatar && (
                  <img src={transaction.recipientAvatar} alt="" className="w-6 h-6 rounded-full" />
                )}
                <span className="text-sm font-medium text-[#0A0A0A]">{transaction.recipientName}</span>
              </div>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm text-[#0A0A0A]/40">Date</span>
            <span className="text-sm font-medium text-[#0A0A0A]">
              {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          {transaction.adminAction && (
            <div className="flex justify-between">
              <span className="text-sm text-[#0A0A0A]/40">Admin Action</span>
              <span className="text-sm font-medium text-[#DDA0DD]">{transaction.adminAction}</span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex gap-3">
        <GlassButton variant="default" fullWidth className="flex items-center justify-center gap-2 py-4 rounded-2xl">
          <Receipt className="w-5 h-5" />
          <span className="text-sm">Receipt</span>
        </GlassButton>
        <GlassButton variant="default" fullWidth className="flex items-center justify-center gap-2 py-4 rounded-2xl">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">Share</span>
        </GlassButton>
      </div>
    </div>
  );
}
