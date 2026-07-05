import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeftRight, CreditCard, Wallet, Settings, Scroll } from 'lucide-react';
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
import SettingsScreen from '@/components/user/SettingsScreen';
import SupportScreen from '@/components/user/SupportScreen';
import ReceiptScreen from '@/components/user/ReceiptScreen';
import StatementScreen from '@/components/user/StatementScreen';
import OnlineAccessScreen from '@/components/user/OnlineAccessScreen';
import AccountCreationWizard from '@/components/user/AccountCreationWizard';
import EnhancedOnboardingFlow from '@/components/user/EnhancedOnboardingFlow';
import OnboardingFlow from '@/components/user/OnboardingFlow';
import IDVerificationPage from '@/components/user/IDVerificationPage';
import QRScannerPage from '@/components/user/QRScannerPage';
// Settings sub-pages
import AccountSettings from '@/components/user/settings/AccountSettings';
import SecuritySettings from '@/components/user/settings/SecuritySettings';
import NotificationSettings from '@/components/user/settings/NotificationSettings';
import CardSettings from '@/components/user/settings/CardSettings';
import PrivacySettings from '@/components/user/settings/PrivacySettings';
import AppearanceSettings from '@/components/user/settings/AppearanceSettings';
import AboutSettings from '@/components/user/settings/AboutSettings';
import TransactionLimitsPage from '@/components/user/settings/TransactionLimitsPage';
import DevicesPage from '@/components/user/settings/DevicesPage';
// Scroll to top button
import { useState, useEffect } from 'react';

// 5-button bottom navigation: Home, Transfer, Accounts, Cards, Settings
const navItems = [
  { icon: Home, label: 'Home', path: '' },
  { icon: ArrowLeftRight, label: 'Transfer', path: 'transfer' },
  { icon: Wallet, label: 'Accounts', path: 'accounts' },
  { icon: CreditCard, label: 'Cards', path: 'cards' },
  { icon: Settings, label: 'Settings', path: 'settings' },
];

export default function UserApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { modalOpen } = useStore();
  useStore();
  const currentPath = location.pathname.split('/').pop() || '';

  // Check if we're on a detail page (no bottom nav)
  const isDetailPage = location.pathname.includes('/transaction/');
  const isModalPage = location.pathname.includes('/settings') ||
                      location.pathname.includes('/support') ||
                      location.pathname.includes('/receipt') ||
                      location.pathname.includes('/statement') ||
                      location.pathname.includes('/online-access') ||
                      location.pathname.includes('/onboarding') ||
                      location.pathname.includes('/id-verification') ||
                      location.pathname.includes('/qr-scanner');

  // Detect if any modal-like UI element is active (from body overflow or custom state)
  const [hasActiveModal, setHasActiveModal] = useState(false);

  useEffect(() => {
    // Check for modal presence via body overflow (set by EnterpriseModal)
    const checkModalPresence = () => {
      const bodyHasHiddenOverflow = document.body.style.overflow === 'hidden';
      setHasActiveModal(bodyHasHiddenOverflow);
    };

    // Initial check
    checkModalPresence();

    // Listen for changes
    const observer = new MutationObserver(checkModalPresence);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    // Also listen for custom events from modals
    const handleModalOpen = () => setHasActiveModal(true);
    const handleModalClose = () => setHasActiveModal(false);

    window.addEventListener('modalOpen', handleModalOpen);
    window.addEventListener('modalClose', handleModalClose);

    return () => {
      observer.disconnect();
      window.removeEventListener('modalOpen', handleModalOpen);
      window.removeEventListener('modalClose', handleModalClose);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-100/30 via-teal-100/20 to-cyan-100/30 pointer-events-none" />

      {/* Scroll Indicator - Shows current section */}
      <div className={`fixed right-0 top-0 bottom-0 w-1 flex flex-col transition-all duration-300 ${
        hasActiveModal ? 'z-[98]' : 'z-50'
      }`}>
        {/* Main page indicator */}
        {!isModalPage && (
          <div className="flex-1 bg-emerald-200/30 flex items-center justify-center">
            <div className="h-full w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 rounded-l-full shadow-lg shadow-emerald-500/30" />
          </div>
        )}

        {/* Modal/Popup page indicator */}
        {isModalPage && (
          <div className="absolute right-0 top-0 h-full w-1">
            <div className="h-full w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 rounded-l-full shadow-lg shadow-orange-500/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`relative max-w-lg mx-auto transition-all duration-300 ${
        hasActiveModal ? 'pb-0' : 'pb-24'
      }`}>
        {/* Page Type Indicator */}
        <div className={`sticky top-0 z-40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border-b border-emerald-200/30 px-4 py-2 transition-all duration-300 ${
          hasActiveModal ? 'z-[99]' : 'z-40'
        }`}>
          <div className="flex items-center gap-2">
            <Scroll className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">
              {isModalPage ? 'Detail View' : 'Main Dashboard'}
            </span>
            {isModalPage && (
              <button
                onClick={() => navigate(-1)}
                className="ml-auto text-xs text-emerald-600 hover:text-emerald-800 underline"
              >
                Back
              </button>
            )}
          </div>
        </div>

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
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="/settings/cards" element={<CardSettings />} />
            <Route path="/settings/privacy" element={<PrivacySettings />} />
            <Route path="/settings/appearance" element={<AppearanceSettings />} />
            <Route path="/settings/about" element={<AboutSettings />} />
            <Route path="/settings/transaction-limits" element={<TransactionLimitsPage />} />
            <Route path="/settings/devices" element={<DevicesPage />} />
            <Route path="/support" element={<SupportScreen />} />
            <Route path="/receipt" element={<ReceiptScreen />} />
            <Route path="/statement" element={<StatementScreen />} />
            <Route path="/online-access" element={<OnlineAccessScreen />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
            {/* Onboarding Routes */}
            <Route path="/onboarding" element={<EnhancedOnboardingFlow />} />
            <Route path="/onboarding/wizard" element={<AccountCreationWizard />} />
            <Route path="/onboarding/flow" element={<OnboardingFlow />} />
            <Route path="/id-verification" element={<IDVerificationPage />} />
            <Route path="/qr-scanner" element={<QRScannerPage />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation - 5 buttons - Hide when modal is active */}
      {!isDetailPage && !hasActiveModal && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-30"
        >
          <div className="max-w-lg mx-auto px-4 pb-4 pt-2">
            <div
              className="glass-surface-strong rounded-2xl px-2 py-3 flex items-center justify-around"
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))'
              }}
            >
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
                      'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                        : 'text-emerald-700/40 hover:text-emerald-700/70'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[9px] font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Scroll to Top Button removed from user portal - only on landing page */}
    </div>
  );
}
