import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton, GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import { ArrowLeft, Search, QrCode, User, X, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TransferStep = 'recipient' | 'amount' | 'confirm' | 'success';

const mockContacts = [
  { id: 'c1', name: 'James Wilson', phone: '+1-555-0102', avatar: 'https://i.pravatar.cc/150?u=james' },
  { id: 'c2', name: 'Maria Garcia', phone: '+1-555-0103', avatar: 'https://i.pravatar.cc/150?u=maria' },
  { id: 'c3', name: 'Alex Morgan', phone: '+1-555-0104', avatar: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'c4', name: 'Priya Patel', phone: '+1-555-0105', avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: 'c5', name: 'Eva Novak', phone: '+1-555-0150', avatar: 'https://i.pravatar.cc/150?u=eva' },
  { id: 'c6', name: 'Henrik Jansen', phone: '+1-555-0160', avatar: 'https://i.pravatar.cc/150?u=henrik' },
];

const quickAmounts = [10, 50, 100, 250, 500, 1000];

export default function TransferScreen() {
  const navigate = useNavigate();
  const { user, transactions } = useStore();
  const [step, setStep] = useState<TransferStep>('recipient');
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('USD');

  if (!user) return null;

  const filteredContacts = mockContacts.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const recentTransactions = transactions.filter((t) => t.userId === user.id && t.recipientName).slice(0, 3);

  const handleNumberPress = (num: string) => {
    if (amount.length < 10) {
      setAmount((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleTransfer = () => {
    setStep('success');
    setTimeout(() => {
      navigate('/app');
    }, 2500);
  };

  const numericKeypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace'],
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F4] p-5 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (step === 'recipient') navigate('/app');
            else if (step === 'amount') setStep('recipient');
            else if (step === 'confirm') setStep('amount');
          }}
          className="w-10 h-10 glass-button rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-xl font-medium text-[#0A0A0A]">
          {step === 'recipient' && 'Transfer'}
          {step === 'amount' && 'Enter Amount'}
          {step === 'confirm' && 'Confirm'}
          {step === 'success' && 'Success!'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {/* Recipient Selection */}
        {step === 'recipient' && (
          <motion.div
            key="recipient"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0A0A]/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full glass-input pl-12 pr-4 py-3.5 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30"
              />
            </div>

            {/* QR & Options */}
            <div className="flex gap-3">
              <button className="flex-1 glass-card py-3 flex items-center justify-center gap-2">
                <QrCode className="w-5 h-5 text-[#0A0A0A]/60" />
                <span className="text-sm font-medium">Scan QR</span>
              </button>
              <button className="flex-1 glass-card py-3 flex items-center justify-center gap-2">
                <User className="w-5 h-5 text-[#0A0A0A]/60" />
                <span className="text-sm font-medium">By Username</span>
              </button>
            </div>

            {/* Recent */}
            {recentTransactions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#0A0A0A]/50 mb-3">Recent</h3>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {recentTransactions.map((txn) => (
                    <motion.button
                      key={txn.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const contact = mockContacts.find((c) => c.name === txn.recipientName);
                        if (contact) {
                          setSelectedContact(contact);
                          setStep('amount');
                        }
                      }}
                      className="flex flex-col items-center gap-1.5 min-w-[70px]"
                    >
                      <img
                        src={txn.recipientAvatar}
                        alt={txn.recipientName}
                        className="w-14 h-14 rounded-full border-2 border-white/40"
                      />
                      <span className="text-xs text-[#0A0A0A]/70 text-center truncate w-16">
                        {txn.recipientName?.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts List */}
            <div>
              <h3 className="text-sm font-medium text-[#0A0A0A]/50 mb-3">All Contacts</h3>
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <motion.button
                    key={contact.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedContact(contact);
                      setStep('amount');
                    }}
                    className="w-full glass-card px-4 py-3 flex items-center gap-3 text-left hover:bg-white/20 transition-colors"
                  >
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-11 h-11 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0A0A0A]">{contact.name}</p>
                      <p className="text-xs text-[#0A0A0A]/40">{contact.phone}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#0A0A0A]/30" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Amount Entry */}
        {step === 'amount' && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Recipient Info */}
            {selectedContact && (
              <div className="flex items-center gap-3 glass-card px-4 py-3">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-[#0A0A0A]">{selectedContact.name}</p>
                  <p className="text-xs text-[#0A0A0A]/40">{selectedContact.phone}</p>
                </div>
                <button
                  onClick={() => setStep('recipient')}
                  className="ml-auto text-xs text-[#0A0A0A]/40 hover:text-[#0A0A0A]"
                >
                  Change
                </button>
              </div>
            )}

            {/* Amount Display */}
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  onClick={() => setCurrency(currency === 'USD' ? 'EUR' : currency === 'EUR' ? 'GBP' : 'USD')}
                  className="glass-pill px-3 py-1 text-xs font-medium"
                >
                  {currency}
                </button>
              </div>
              <p className="text-5xl font-light text-[#0A0A0A] tracking-tight">
                {amount ? `$${Number(amount).toLocaleString('en-US')}` : '$0'}
              </p>
              <p className="text-xs text-[#0A0A0A]/40 mt-2">
                Balance: ${user.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickAmounts.map((amt) => (
                <motion.button
                  key={amt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAmount(amt.toString())}
                  className="glass-pill px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  ${amt}
                </motion.button>
              ))}
            </div>

            {/* Note */}
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full glass-input px-4 py-3 rounded-xl text-[#0A0A0A] placeholder:text-[#0A0A0A]/30 text-center"
            />

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-3">
              {numericKeypad.flat().map((key) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (key === 'backspace') handleBackspace();
                    else handleNumberPress(key);
                  }}
                  className={`h-14 rounded-2xl flex items-center justify-center text-xl font-medium transition-colors ${
                    key === 'backspace'
                      ? 'glass-button'
                      : 'glass-surface hover:bg-white/25'
                  }`}
                >
                  {key === 'backspace' ? <X className="w-5 h-5" /> : key}
                </motion.button>
              ))}
            </div>

            {/* Send Button */}
            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              disabled={!amount || Number(amount) <= 0 || Number(amount) > user.balanceUsd}
              onClick={() => setStep('confirm')}
              className="rounded-2xl"
            >
              Continue
            </GlassButton>
          </motion.div>
        )}

        {/* Confirmation */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#A8E6CF]/30 flex items-center justify-center mx-auto">
                <img
                  src={selectedContact?.avatar}
                  alt=""
                  className="w-14 h-14 rounded-full"
                />
              </div>
              <div>
                <p className="text-lg font-medium text-[#0A0A0A]">{selectedContact?.name}</p>
                <p className="text-sm text-[#0A0A0A]/40">{selectedContact?.phone}</p>
              </div>
              <div className="py-4 border-t border-b border-white/20">
                <p className="text-3xl font-light text-[#0A0A0A]">${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                {note && <p className="text-sm text-[#0A0A0A]/40 mt-2">"{note}"</p>}
              </div>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-[#0A0A0A]/40">From</span>
                  <span className="text-[#0A0A0A]">Main Account</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#0A0A0A]/40">Fee</span>
                  <span className="text-[#0A0A0A]">$0.50</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-[#0A0A0A]/40">Total</span>
                  <span className="text-[#0A0A0A]">${(Number(amount) + 0.5).toFixed(2)}</span>
                </div>
              </div>
            </GlassCard>

            <GlassButton
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleTransfer}
              className="rounded-2xl"
            >
              <Check className="w-5 h-5" /> Confirm Transfer
            </GlassButton>
          </motion.div>
        )}

        {/* Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-[#2ECC71]/20 flex items-center justify-center mb-6"
            >
              <Check className="w-10 h-10 text-[#2ECC71]" />
            </motion.div>
            <h2 className="text-2xl font-medium text-[#0A0A0A] mb-2">Transfer Sent!</h2>
            <p className="text-[#0A0A0A]/50 text-center">
              ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} sent to {selectedContact?.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
