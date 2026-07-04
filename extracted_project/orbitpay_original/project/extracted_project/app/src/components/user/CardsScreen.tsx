import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassBadge, GlassButton } from '@/components/glass';
import { useStore } from '@/store';
import {
  CreditCard, Plus, Snowflake, Eye, EyeOff,
  Shield, Sparkles, Smartphone, Globe, Settings, Trash2, Copy
} from 'lucide-react';

export default function CardsScreen() {
  const navigate = useNavigate();
  const { cards, user, freezeCard, unfreezeCard, blockCard } = useStore();
  const [showCVV, setShowCVV] = useState<string | null>(null);
  const [showCardNumber, setShowCardNumber] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'debit' | 'credit'>('all');
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [travelMode, setTravelMode] = useState<Record<string, boolean>>({});
  const [cardLimit, setCardLimit] = useState<Record<string, number>>({});

  const userCards = cards.filter((c) => c.userId === user?.id);
  const filteredCards = activeTab === 'all'
    ? userCards
    : userCards.filter((c) => c.type === activeTab);

  const getCardGradient = (card: typeof cards[0]) => {
    const gradients: Record<string, string> = {
      mint: 'from-[#A8E6CF] to-[#88D4AB]',
      purple: 'from-[#DDA0DD] to-[#C48BC4]',
      gold: 'from-[#F4F7C0] to-[#E5EB8A]',
      navy: 'from-[#1a1a2e] to-[#16213e]',
      coral: 'from-[#FF6B6B] to-[#EE5A5A]',
    };
    return gradients[card.color] || gradients.navy;
  };

  const handleFreeze = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card?.status === 'frozen') {
      unfreezeCard(cardId);
    } else {
      freezeCard(cardId);
    }
    setShowCardMenu(null);
  };

  const handleBlock = (cardId: string) => {
    blockCard(cardId);
    setShowCardMenu(null);
  };

  const handleTravelMode = (cardId: string) => {
    setTravelMode((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const copyCardInfo = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAddCard = () => {
    setShowAddCardModal(false);
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">My Cards</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddCardModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] text-white rounded-full text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </motion.button>
      </div>

      {/* Tab Filter */}
      <div className="flex gap-2 p-1 bg-white/50 rounded-full">
        {(['all', 'debit', 'credit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#0A0A0A] text-white'
                : 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Card */}
              <div
                className={`relative h-48 rounded-3xl bg-gradient-to-br ${getCardGradient(card)} p-5 overflow-hidden cursor-pointer`}
                onClick={() => navigate(`/app/card/${card.id}`)}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {card.isVirtual && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                          <Smartphone className="w-3 h-3" />
                          <span className="text-xs text-white">Virtual</span>
                        </div>
                      )}
                      <span className="text-white/80 text-xs uppercase tracking-wider">
                        {card.cardNetwork}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      card.status === 'active' ? 'bg-[#2ECC71]/80 text-white' :
                      card.status === 'frozen' ? 'bg-[#3498DB]/80 text-white' :
                      'bg-[#E74C3C]/80 text-white'
                    }`}>
                      {card.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-white/60 text-xs mb-1">Card Number</p>
                    <p className="text-white text-lg font-mono tracking-wider">
                      {showCardNumber === card.id ? `•••• •••• •••• ${card.lastFourDigits}` : '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-xs">Card Holder</p>
                      <p className="text-white text-sm font-medium">{card.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Expires</p>
                      <p className="text-white text-sm font-medium">
                        {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Frozen Overlay */}
                {card.status === 'frozen' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <div className="text-center text-white">
                      <Snowflake className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                      <p className="font-medium">Card Frozen</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-3 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFreeze(card.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                    card.status === 'frozen'
                      ? 'border-[#2ECC71] text-[#2ECC71]'
                      : 'border-[#0A0A0A]/20 text-[#0A0A0A]/60'
                  }`}
                >
                  {card.status === 'frozen' ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Unfreeze</span>
                    </>
                  ) : (
                    <>
                      <Snowflake className="w-4 h-4" />
                      <span className="text-sm font-medium">Freeze</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCVV(showCVV === card.id ? null : card.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#0A0A0A]/20 text-[#0A0A0A]/60"
                >
                  {showCVV === card.id ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Hide CVV</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Show CVV</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCardMenu(showCardMenu === card.id ? null : card.id)}
                  className="w-12 flex items-center justify-center py-3 rounded-xl border border-[#0A0A0A]/20 text-[#0A0A0A]/60"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>

              {/* CVV Display */}
              {showCVV === card.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0A0A0A] text-white rounded-lg text-sm font-mono shadow-lg z-30"
                >
                  CVV: {card.cvv}
                </motion.div>
              )}

              {/* Card Menu */}
              <AnimatePresence>
                {showCardMenu === card.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#0A0A0A]/10 overflow-hidden z-40 w-48"
                  >
                    <button
                      onClick={() => copyCardInfo(`•••• •••• •••• ${card.lastFourDigits}`)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F7F9F4] transition-colors"
                    >
                      <Copy className="w-4 h-4 text-[#0A0A0A]/60" />
                      <span className="text-sm text-[#0A0A0A]">Copy Number</span>
                    </button>
                    <button
                      onClick={() => handleTravelMode(card.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F7F9F4] transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[#0A0A0A]/60" />
                      <span className="text-sm text-[#0A0A0A]">
                        Travel Mode {travelMode[card.id] ? 'On' : 'Off'}
                      </span>
                    </button>
                    <button
                      onClick={() => navigate(`/app/card/${card.id}/spending`)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F7F9F4] transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-[#0A0A0A]/60" />
                      <span className="text-sm text-[#0A0A0A]">Spending History</span>
                    </button>
                    <button
                      onClick={() => navigate(`/app/card/${card.id}/limits`)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#F7F9F4] transition-colors"
                    >
                      <Shield className="w-4 h-4 text-[#0A0A0A]/60" />
                      <span className="text-sm text-[#0A0A0A]">Set Limits</span>
                    </button>
                    <button
                      onClick={() => handleBlock(card.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Block Card</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CreditCard className="w-16 h-16 mx-auto text-[#0A0A0A]/20 mb-4" />
            <p className="text-[#0A0A0A]/50">No cards found</p>
            <GlassButton className="mt-4" onClick={() => setShowAddCardModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Request a Card
            </GlassButton>
          </motion.div>
        )}
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            onClick={() => setShowAddCardModal(false)}
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
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Add New Card</h2>

              {/* Card Type Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="p-4 rounded-2xl border-2 border-[#A8E6CF] bg-[#A8E6CF]/10 text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-[#0A0A0A]" />
                  <span className="text-sm font-medium text-[#0A0A0A]">Debit Card</span>
                </button>
                <button className="p-4 rounded-2xl border-2 border-[#0A0A0A]/10 text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-[#0A0A0A]/40" />
                  <span className="text-sm font-medium text-[#0A0A0A]/40">Credit Card</span>
                </button>
              </div>

              {/* Card Design Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#0A0A0A] mb-3">Card Color</h3>
                <div className="flex gap-3">
                  {['mint', 'purple', 'gold', 'navy', 'coral'].map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        color === 'mint' ? 'from-[#A8E6CF] to-[#88D4AB]' :
                        color === 'purple' ? 'from-[#DDA0DD] to-[#C48BC4]' :
                        color === 'gold' ? 'from-[#F4F7C0] to-[#E5EB8A]' :
                        color === 'navy' ? 'from-[#1a1a2e] to-[#16213e]' :
                        'from-[#FF6B6B] to-[#EE5A5A]'
                      } border-2 border-transparent`}
                    />
                  ))}
                </div>
              </div>

              {/* Card Options */}
              <div className="space-y-4 mb-6">
                <label className="flex items-center gap-3 p-4 bg-[#F7F9F4] rounded-xl cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#0A0A0A]/60" />
                    <span className="text-sm text-[#0A0A0A]">Create Virtual Card</span>
                  </div>
                </label>
              </div>

              <div className="flex gap-3">
                <GlassButton
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowAddCardModal(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  className="flex-1"
                  onClick={handleAddCard}
                >
                  Add Card
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Benefits */}
      <GlassCard className="p-5">
        <h3 className="font-medium text-[#0A0A0A] mb-4">Card Benefits</h3>
        <div className="space-y-3">
          {[
            { icon: Shield, title: 'Zero Liability Protection', desc: 'Your card is protected against unauthorized transactions' },
            { icon: Smartphone, title: 'Contactless Payments', desc: 'Pay securely with tap-to-pay anywhere' },
            { icon: CreditCard, title: 'Instant Notifications', desc: 'Real-time alerts for every transaction' },
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A8E6CF]/20 flex items-center justify-center">
                <benefit.icon className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#0A0A0A]">{benefit.title}</p>
                <p className="text-xs text-[#0A0A0A]/50">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Spending Summary */}
      {userCards.length > 0 && (
        <div>
          <h3 className="font-medium text-[#0A0A0A] mb-3">Spending This Month</h3>
          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="p-4">
              <p className="text-xs text-[#0A0A0A]/50 mb-1">Total Spent</p>
              <p className="text-xl font-bold text-[#FF6B6B]">
                ${userCards.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
              </p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-xs text-[#0A0A0A]/50 mb-1">Available Credit</p>
              <p className="text-xl font-bold text-[#2ECC71]">
                ${userCards.reduce((sum, c) => sum + (c.availableCredit || 0), 0).toLocaleString()}
              </p>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
