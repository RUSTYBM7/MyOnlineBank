import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassButton, GlassCard } from '@/components/glass';
import { useStore } from '@/store';
import { ArrowLeft, Search, QrCode, User, X, Check, ChevronRight, Bot, Shield, Zap, TrendingUp, Camera, Image, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TransferStep = 'recipient' | 'amount' | 'confirm' | 'success';

const mockContacts = [
  { id: 'c1', name: 'James Wilson', phone: '+1-555-0102', avatar: 'https://i.pravatar.cc/150?u=james', frequent: true },
  { id: 'c2', name: 'Maria Garcia', phone: '+1-555-0103', avatar: 'https://i.pravatar.cc/150?u=maria', frequent: true },
  { id: 'c3', name: 'Alex Morgan', phone: '+1-555-0104', avatar: 'https://i.pravatar.cc/150?u=alex', frequent: false },
  { id: 'c4', name: 'Priya Patel', phone: '+1-555-0105', avatar: 'https://i.pravatar.cc/150?u=priya', frequent: true },
  { id: 'c5', name: 'Eva Novak', phone: '+1-555-0150', avatar: 'https://i.pravatar.cc/150?u=eva', frequent: false },
  { id: 'c6', name: 'Henrik Jansen', phone: '+1-555-0160', avatar: 'https://i.pravatar.cc/150?u=henrik', frequent: false },
];

const quickAmounts = [10, 50, 100, 250, 500, 1000];

const aiInsights = [
  "You're within your weekly transfer limit",
  "James receives transfers every Friday",
  "Consider saving 10% of each transfer",
  "Low fee transfer window: 9 AM - 12 PM",
  "Your recipient received 3 transfers this week",
];

export default function TransferScreen() {
  const navigate = useNavigate();
  const { user, transactions } = useStore();
  const [step, setStep] = useState<TransferStep>('recipient');
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [aiTypingText, setAiTypingText] = useState('');
  const [showFraudCheck, setShowFraudCheck] = useState(false);
  const [fraudScore, setFraudScore] = useState(95);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  // AI typing effect
  useEffect(() => {
    if (step === 'amount') {
      const interval = setInterval(() => {
        const randomInsight = aiInsights[Math.floor(Math.random() * aiInsights.length)];
        setAiTypingText('');
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex <= randomInsight.length) {
            setAiTypingText(randomInsight.slice(0, charIndex));
            charIndex++;
          } else {
            clearInterval(typeInterval);
          }
        }, 30);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Fraud check animation
  useEffect(() => {
    if (showFraudCheck) {
      setFraudScore(0);
      const interval = setInterval(() => {
        setFraudScore((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showFraudCheck]);

  if (!user) return null;

  const filteredContacts = mockContacts.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const recentTransactions = transactions.filter((t) => t.userId === user.id && t.recipientName).slice(0, 3);
  const frequentContacts = mockContacts.filter((c) => c.frequent);

  const handleNumberPress = (num: string) => {
    if (amount.length < 10) {
      setAmount((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleTransfer = () => {
    setShowFraudCheck(true);
    setTimeout(() => {
      setShowFraudCheck(false);
      setStep('success');
      setTimeout(() => {
        navigate('/app');
      }, 2500);
    }, 2000);
  };

  const numericKeypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace'],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-5 pb-24 animate-fade-in">
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
        <h1 className="text-xl font-medium text-emerald-800">
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
            {/* AI Assistant Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ai-widget p-4 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-semibold text-cyan-600">AI Transfer Assistant</p>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-emerald-500"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <p className="text-sm text-emerald-800/80">
                    Smart transfers powered by AI fraud detection and insights
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-800/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or phone"
                className="w-full glass-input pl-12 pr-4 py-3.5 rounded-xl text-emerald-800 placeholder:text-emerald-800/30"
              />
            </div>

            {/* QR & Options */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQRScanner(true)}
                className="flex-1 glass-card py-3 flex items-center justify-center gap-2 card-hover hover:bg-white/20"
              >
                <QrCode className="w-5 h-5 text-emerald-800/60" />
                <span className="text-sm font-medium">Scan QR</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex-1 glass-card py-3 flex items-center justify-center gap-2 card-hover hover:bg-white/20"
              >
                <User className="w-5 h-5 text-emerald-800/60" />
                <span className="text-sm font-medium">By Username</span>
              </motion.button>
            </div>

            {/* Frequent Contacts */}
            {frequentContacts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-medium text-emerald-800/50">Frequent Contacts</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {frequentContacts.map((contact) => (
                    <motion.button
                      key={contact.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedContact(contact);
                        setStep('amount');
                      }}
                      className="flex flex-col items-center gap-1.5 min-w-[70px]"
                    >
                      <div className="relative">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-14 h-14 rounded-full border-2 border-white/40 shadow-lg"
                        />
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap className="w-3 h-3 text-white" />
                        </motion.div>
                      </div>
                      <span className="text-xs text-emerald-800/70 text-center truncate w-16">
                        {contact.name.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            {recentTransactions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-emerald-800/50 mb-3">Recent</h3>
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
                      <span className="text-xs text-emerald-800/70 text-center truncate w-16">
                        {txn.recipientName?.split(' ')[0]}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts List */}
            <div>
              <h3 className="text-sm font-medium text-emerald-800/50 mb-3">All Contacts</h3>
              <div className="space-y-2">
                {filteredContacts.map((contact, index) => (
                  <motion.button
                    key={contact.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
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
                      <p className="text-sm font-medium text-emerald-800">{contact.name}</p>
                      <p className="text-xs text-emerald-800/40">{contact.phone}</p>
                    </div>
                    {contact.frequent && (
                      <div className="px-2 py-1 bg-amber-100 rounded-full">
                        <Zap className="w-3 h-3 text-amber-600" />
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-emerald-800/30" />
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
            {/* AI Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ai-widget p-3 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="w-3 h-3 text-white" />
                </motion.div>
                <p className="text-xs text-emerald-800/80 flex-1">
                  {aiTypingText}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                </p>
              </div>
            </motion.div>

            {/* Recipient Info */}
            {selectedContact && (
              <div className="flex items-center gap-3 glass-card px-4 py-3">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-emerald-800">{selectedContact.name}</p>
                  <p className="text-xs text-emerald-800/40">{selectedContact.phone}</p>
                </div>
                <button
                  onClick={() => setStep('recipient')}
                  className="ml-auto text-xs text-emerald-800/40 hover:text-emerald-800"
                >
                  Change
                </button>
              </div>
            )}

            {/* Amount Display */}
            <div className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrency(currency === 'USD' ? 'EUR' : currency === 'EUR' ? 'GBP' : 'USD')}
                  className="glass-pill px-3 py-1 text-xs font-medium"
                >
                  {currency}
                </motion.button>
              </div>
              <motion.p
                key={amount}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-5xl font-light text-emerald-800 tracking-tight"
              >
                {amount ? `$${Number(amount).toLocaleString('en-US')}` : '$0'}
              </motion.p>
              <p className="text-xs text-emerald-800/40 mt-2">
                Balance: ${user.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickAmounts.map((amt) => (
                <motion.button
                  key={amt}
                  whileHover={{ scale: 1.05 }}
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
              className="w-full glass-input px-4 py-3 rounded-xl text-emerald-800 placeholder:text-emerald-800/30 text-center"
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
                <p className="text-lg font-medium text-emerald-800">{selectedContact?.name}</p>
                <p className="text-sm text-emerald-800/40">{selectedContact?.phone}</p>
              </div>
              <div className="py-4 border-t border-b border-white/20">
                <p className="text-3xl font-light text-emerald-800">${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                {note && <p className="text-sm text-emerald-800/40 mt-2">"{note}"</p>}
              </div>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-800/40">From</span>
                  <span className="text-emerald-800">Main Account</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-800/40">Fee</span>
                  <span className="text-emerald-800">$0.50</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-emerald-800/40">Total</span>
                  <span className="text-emerald-800">${(Number(amount) + 0.5).toFixed(2)}</span>
                </div>
              </div>
            </GlassCard>

            {/* AI Security Check */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-800">AI Security Check</p>
                  <p className="text-xs text-emerald-800/50">Transaction verified safe</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </motion.div>

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

        {/* Fraud Check Animation */}
        {showFraudCheck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="glass-card p-8 text-center max-w-xs"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Shield className="w-full h-full text-emerald-500" />
              </motion.div>
              <h3 className="text-lg font-medium text-emerald-800 mb-2">AI Security Scan</h3>
              <div className="relative w-full h-2 bg-[#0A0A0A]/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500"
                  style={{ width: `${fraudScore}%` }}
                  initial={{ width: 0 }}
                />
              </div>
              <p className="text-sm text-emerald-800/50">{Math.round(fraudScore)}% Secure</p>
            </motion.div>
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
            <h2 className="text-2xl font-medium text-emerald-800 mb-2">Transfer Sent!</h2>
            <p className="text-emerald-800/50 text-center">
              ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} sent to {selectedContact?.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowQRScanner(false);
                  setQrScanning(false);
                  setQrError(null);
                }}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
              <h2 className="text-white font-semibold">Scan QR Code</h2>
              <div className="w-10" />
            </div>

            {/* Camera View */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-sm aspect-square bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-3xl overflow-hidden border-2 border-emerald-400/50"
              >
                {/* Scanning Frame */}
                <div className="absolute inset-8 border-2 border-emerald-400/50 rounded-2xl">
                  <motion.div
                    animate={{ y: [0, 120, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                  />
                </div>

                {/* Corner Markers */}
                <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

                {/* Scan Animation */}
                {qrScanning && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Shield className="w-16 h-16 text-emerald-400/30" />
                  </motion.div>
                )}
              </motion.div>

              {/* Status Message */}
              <div className="mt-6 text-center">
                {qrError ? (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{qrError}</span>
                  </div>
                ) : qrScanning ? (
                  <p className="text-emerald-400/80 text-sm">Position QR code within the frame</p>
                ) : (
                  <p className="text-white/60 text-sm">Tap to start scanning</p>
                )}
              </div>

              {/* Options */}
              <div className="mt-8 flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setQrScanning(true);
                    setQrError(null);
                    // Simulate scan after 2 seconds
                    setTimeout(() => {
                      setQrScanning(false);
                      // Simulate finding a contact
                      const randomContact = mockContacts[Math.floor(Math.random() * mockContacts.length)];
                      setSelectedContact(randomContact);
                      setShowQRScanner(false);
                      setStep('amount');
                    }, 2000);
                  }}
                  className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
                >
                  <Camera className="w-6 h-6 text-white" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Simulate selecting from gallery
                    setQrError('Gallery QR scanning available on supported devices');
                    setTimeout(() => setQrError(null), 3000);
                  }}
                  className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Image className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <p className="text-white/40 text-xs mt-4">Scan OrbitPay QR codes to instantly transfer</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
