import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassSurface, GlassCard, GlassBadge, GlassButton, GlassInput } from '@/components/glass';
import { useStore } from '@/store';
import {
  Receipt, Plus, Calendar, Clock, Check, AlertCircle,
  Zap, Home, Tv, Phone, Car, GraduationCap, CreditCard
} from 'lucide-react';

export default function BillsScreen() {
  const { billPayments, user } = useStore();
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState<string | null>(null);

  const userBills = billPayments.filter((b) => b.userId === user?.id);

  const billerCategories = [
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'bg-[#F4F7C0]' },
    { id: 'water', name: 'Water', icon: Home, color: 'bg-[#A8E6CF]' },
    { id: 'internet', name: 'Internet', icon: Tv, color: 'bg-[#DDA0DD]' },
    { id: 'phone', name: 'Phone', icon: Phone, color: 'bg-[#88D4AB]' },
    { id: 'car', name: 'Car Insurance', icon: Car, color: 'bg-[#E5EB8A]' },
    { id: 'student', name: 'Student Loan', icon: GraduationCap, color: 'bg-[#C48BC4]' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <GlassBadge variant="green" size="sm">Paid</GlassBadge>;
      case 'pending':
        return <GlassBadge variant="yellow" size="sm">Pending</GlassBadge>;
      case 'failed':
        return <GlassBadge variant="red" size="sm">Failed</GlassBadge>;
      default:
        return <GlassBadge variant="yellow" size="sm">{status}</GlassBadge>;
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Pay Bills</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPayModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-full text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Pay Bill
        </motion.button>
      </div>

      {/* Quick Pay Categories */}
      <div>
        <h3 className="font-medium text-[#0A0A0A] mb-3">Quick Pay</h3>
        <div className="grid grid-cols-3 gap-3">
          {billerCategories.slice(0, 6).map((category) => (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBiller(category.id)}
              className="flex flex-col items-center p-4 bg-white rounded-2xl border border-[#0A0A0A]/5"
            >
              <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-2`}>
                <category.icon className="w-6 h-6 text-[#0A0A0A]" />
              </div>
              <span className="text-xs font-medium text-[#0A0A0A]">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Bills */}
      <div>
        <h3 className="font-medium text-[#0A0A0A] mb-3">Recent Bills</h3>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {userBills.length > 0 ? (
              userBills.map((bill, index) => (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F7F9F4] flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-[#0A0A0A]/60" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#0A0A0A]">{bill.billerName}</h4>
                        <p className="text-xs text-[#0A0A0A]/50">
                          Account: {bill.accountNumber}
                        </p>
                        {bill.dueDate && (
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 text-[#0A0A0A]/40" />
                            <span className="text-xs text-[#FF6B6B]">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#0A0A0A]">
                          {formatCurrency(bill.amount)}
                        </p>
                        {getStatusBadge(bill.status)}
                      </div>
                    </div>
                    {bill.status === 'pending' && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-3 py-2 bg-[#0A0A0A] text-white rounded-xl font-medium"
                      >
                        Pay Now
                      </motion.button>
                    )}
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Receipt className="w-16 h-16 mx-auto text-[#0A0A0A]/20 mb-4" />
                <p className="text-[#0A0A0A]/50">No recent bills</p>
                <GlassButton className="mt-4" onClick={() => setShowPayModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Pay Your First Bill
                </GlassButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bill Payment Modal */}
      <AnimatePresence>
        {showPayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            onClick={() => setShowPayModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-[#0A0A0A]/20 rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Pay a Bill</h2>

              {/* Biller Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Select Biller</label>
                <div className="grid grid-cols-3 gap-2">
                  {billerCategories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBiller(category.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedBiller === category.id
                          ? 'border-[#A8E6CF] bg-[#A8E6CF]/10'
                          : 'border-[#0A0A0A]/10'
                      }`}
                    >
                      <category.icon className={`w-6 h-6 mx-auto mb-1 ${
                        selectedBiller === category.id ? 'text-[#2ECC71]' : 'text-[#0A0A0A]/40'
                      }`} />
                      <span className="text-xs text-[#0A0A0A]">{category.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <GlassInput
                  label="Account Number"
                  placeholder="Enter biller account number"
                />
                <GlassInput
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  prefix="$"
                />
                <GlassInput
                  label="Payment Date"
                  type="date"
                />
              </div>

              {/* Payment Summary */}
              <div className="mt-6 p-4 bg-[#F7F9F4] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0A0A0A]/60">Bill Amount</span>
                  <span className="text-sm text-[#0A0A0A]">$0.00</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0A0A0A]/60">Processing Fee</span>
                  <span className="text-sm text-[#0A0A0A]">$0.00</span>
                </div>
                <div className="border-t border-[#0A0A0A]/10 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#0A0A0A]">Total</span>
                    <span className="text-lg font-bold text-[#0A0A0A]">$0.00</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <GlassButton
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  className="flex-1"
                  disabled={!selectedBiller}
                  onClick={() => {
                    setShowPayModal(false);
                  }}
                >
                  Pay Bill
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
