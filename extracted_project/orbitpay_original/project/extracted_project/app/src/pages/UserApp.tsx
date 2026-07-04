import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeftRight, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store';
import HomeScreen from '@/components/user/HomeScreen';
import TransferScreen from '@/components/user/TransferScreen';
import InvestmentScreen from '@/components/user/InvestmentScreen';
import CryptoScreen from '@/components/user/CryptoScreen';
import ChatScreen from '@/components/user/ChatScreen';
import ProfileScreen from '@/components/user/ProfileScreen';
import TransactionDetail from '@/components/user/TransactionDetail';
import CardsScreen from '@/components/user/CardsScreen';
import LoansScreen from '@/components/user/LoansScreen';
import AccountsScreen from '@/components/user/AccountsScreen';
import BillsScreen from '@/components/user/BillsScreen';
import ScheduledScreen from '@/components/user/ScheduledScreen';

// 4-button bottom navigation: Home, Transfer, Accounts, Cards
// Chat and Settings are moved to Profile page
const navItems = [
  { icon: Home, label: 'Home', path: '' },
  { icon: ArrowLeftRight, label: 'Transfer', path: 'transfer' },
  { icon: Wallet, label: 'Accounts', path: 'accounts' },
  { icon: CreditCard, label: 'Cards', path: 'cards' },
];

export default function UserApp() {
  const location = useLocation();
  const navigate = useNavigate();
  useStore();
  const currentPath = location.pathname.split('/').pop() || '';

  // Check if we're on a detail page (no bottom nav)
  const isDetailPage = location.pathname.includes('/transaction/');

  return (
    <div className="min-h-screen bg-[#F7F9F4] relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 gradient-blob-green pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto pb-24">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/transfer" element={<TransferScreen />} />
            <Route path="/invest" element={<InvestmentScreen />} />
            <Route path="/crypto" element={<CryptoScreen />} />
            <Route path="/accounts" element={<AccountsScreen />} />
            <Route path="/cards" element={<CardsScreen />} />
            <Route path="/loans" element={<LoansScreen />} />
            <Route path="/bills" element={<BillsScreen />} />
            <Route path="/scheduled" element={<ScheduledScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {!isDetailPage && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-lg mx-auto px-4 pb-4 pt-2">
            <div className="glass-surface-strong rounded-2xl px-4 py-3 flex items-center justify-around">
              {navItems.map((item) => {
                const isActive =
                  (item.path === '' && currentPath === '') ||
                  (item.path !== '' && currentPath === item.path);
                return (
                  <motion.button
                    key={item.path}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/app/${item.path}`)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-[#0A0A0A] text-white'
                        : 'text-[#0A0A0A]/40 hover:text-[#0A0A0A]/70'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
