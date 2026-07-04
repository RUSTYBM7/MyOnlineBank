import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, GlassButton, GlassBadge } from '@/components/glass';
import { useStore } from '@/store';
import {
  User, Shield, Fingerprint, Smartphone, Bell, Moon, Sun,
  Globe, Lock, Eye, EyeOff, ChevronRight, Check, X,
  CreditCard, Mail, Phone, MapPin, Camera, Languages,
  Printer, FileText, AlertTriangle, RefreshCw, Download
} from 'lucide-react';

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  action?: () => void;
  badge?: string;
}

export default function SettingsScreen() {
  const { user, toggleDarkMode, darkMode } = useStore();
  const [activeSection, setActiveSection] = useState<string>('account');
  const [biometrics, setBiometrics] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [travelMode, setTravelMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [language, setLanguage] = useState('English');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) return null;

  const sections = [
    { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Globe className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'cards', label: 'Cards', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'legal', label: 'Legal', icon: <FileText className="w-5 h-5" /> },
  ];

  const accountSettings: SettingItem[] = [
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'Personal Information',
      description: 'Name, email, phone, address',
      type: 'navigation',
      action: () => {},
    },
    {
      id: 'kyc',
      icon: <Shield className="w-5 h-5" />,
      label: 'KYC Verification',
      description: user.kycStatus === 'verified' ? 'Verified' : 'Pending verification',
      type: 'navigation',
      badge: user.kycStatus,
    },
    {
      id: 'photo',
      icon: <Camera className="w-5 h-5" />,
      label: 'Profile Photo',
      description: 'Update your profile picture',
      type: 'navigation',
    },
    {
      id: 'devices',
      icon: <Smartphone className="w-5 h-5" />,
      label: 'Connected Devices',
      description: '3 active devices',
      type: 'navigation',
    },
  ];

  const securitySettings: SettingItem[] = [
    {
      id: 'password',
      icon: <Lock className="w-5 h-5" />,
      label: 'Password',
      description: 'Last changed 30 days ago',
      type: 'navigation',
    },
    {
      id: '2fa',
      icon: <Shield className="w-5 h-5" />,
      label: 'Two-Factor Authentication',
      description: twoFactor ? 'Enabled' : 'Disabled',
      type: 'toggle',
      value: twoFactor,
      action: () => setTwoFactor(!twoFactor),
    },
    {
      id: 'biometrics',
      icon: <Fingerprint className="w-5 h-5" />,
      label: 'Biometric Login',
      description: biometrics ? 'Face ID enabled' : 'Disabled',
      type: 'toggle',
      value: biometrics,
      action: () => setBiometrics(!biometrics),
    },
    {
      id: 'limits',
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Transaction Limits',
      description: `$${user.dailyLimit.toLocaleString()}/day`,
      type: 'navigation',
    },
    {
      id: 'sessions',
      icon: <Smartphone className="w-5 h-5" />,
      label: 'Active Sessions',
      description: 'Manage logged-in devices',
      type: 'navigation',
    },
  ];

  const preferencesSettings: SettingItem[] = [
    {
      id: 'language',
      icon: <Languages className="w-5 h-5" />,
      label: 'Language',
      description: language,
      type: 'navigation',
      action: () => setShowLanguageModal(true),
    },
    {
      id: 'currency',
      icon: <Globe className="w-5 h-5" />,
      label: 'Default Currency',
      description: 'USD',
      type: 'navigation',
    },
    {
      id: 'darkmode',
      icon: darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: 'Dark Mode',
      description: darkMode ? 'On' : 'Off',
      type: 'toggle',
      value: darkMode,
      action: toggleDarkMode,
    },
    {
      id: 'travel',
      icon: <Globe className="w-5 h-5" />,
      label: 'Travel Mode',
      description: travelMode ? 'Enabled' : 'Disabled',
      type: 'toggle',
      value: travelMode,
      action: () => setTravelMode(!travelMode),
    },
  ];

  const notificationSettings: SettingItem[] = [
    {
      id: 'push',
      icon: <Bell className="w-5 h-5" />,
      label: 'Push Notifications',
      description: 'Transaction alerts',
      type: 'toggle',
      value: notifications,
      action: () => setNotifications(!notifications),
    },
    {
      id: 'email',
      icon: <Mail className="w-5 h-5" />,
      label: 'Email Notifications',
      description: 'Weekly summary',
      type: 'toggle',
      value: true,
      action: () => {},
    },
    {
      id: 'sms',
      icon: <Phone className="w-5 h-5" />,
      label: 'SMS Alerts',
      description: 'Security alerts',
      type: 'toggle',
      value: true,
      action: () => {},
    },
    {
      id: 'marketing',
      icon: <Bell className="w-5 h-5" />,
      label: 'Marketing',
      description: 'Promotions & offers',
      type: 'toggle',
      value: false,
      action: () => {},
    },
  ];

  const cardSettings: SettingItem[] = [
    {
      id: 'default',
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Default Card',
      description: 'Set primary card',
      type: 'navigation',
    },
    {
      id: 'limits',
      icon: <Shield className="w-5 h-5" />,
      label: 'Card Limits',
      description: 'Spending controls',
      type: 'navigation',
    },
    {
      id: 'atm',
      icon: <CreditCard className="w-5 h-5" />,
      label: 'ATM Withdrawals',
      description: 'Daily ATM limit: $500',
      type: 'navigation',
    },
  ];

  const legalSettings: SettingItem[] = [
    {
      id: 'terms',
      icon: <FileText className="w-5 h-5" />,
      label: 'Terms of Service',
      description: 'Last updated: Jan 2024',
      type: 'navigation',
    },
    {
      id: 'privacy',
      icon: <Lock className="w-5 h-5" />,
      label: 'Privacy Policy',
      description: 'How we handle your data',
      type: 'navigation',
    },
    {
      id: 'licenses',
      icon: <FileText className="w-5 h-5" />,
      label: 'Licenses',
      description: 'Open source licenses',
      type: 'navigation',
    },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const getSettings = () => {
    switch (activeSection) {
      case 'account': return accountSettings;
      case 'security': return securitySettings;
      case 'preferences': return preferencesSettings;
      case 'notifications': return notificationSettings;
      case 'cards': return cardSettings;
      case 'legal': return legalSettings;
      default: return accountSettings;
    }
  };

  return (
    <div className="p-5 space-y-5 animate-fade-in pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-[#0A0A0A]">Settings</h1>
          <p className="text-sm text-[#0A0A0A]/50">Customize your experience</p>
        </div>
        <GlassBadge variant="mint" size="sm">
          v1.0.0
        </GlassBadge>
      </div>

      {/* Profile Summary */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-14 h-14 rounded-full border-2 border-white/40"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2ECC71] border-2 border-white flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-[#0A0A0A]">{user.fullName}</p>
            <p className="text-sm text-[#0A0A0A]/50">{user.email}</p>
          </div>
          <GlassBadge
            variant={user.kycStatus === 'verified' ? 'green' : user.kycStatus === 'pending' ? 'yellow' : 'red'}
            size="sm"
          >
            {user.tier.toUpperCase()}
          </GlassBadge>
        </div>
      </GlassCard>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(section.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
              activeSection === section.id
                ? 'bg-[#0A0A0A] text-white'
                : 'bg-white/50 text-[#0A0A0A]/60'
            }`}
          >
            {section.icon}
            <span className="text-sm font-medium">{section.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Settings List */}
      <div className="space-y-2">
        {getSettings().map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={item.type === 'toggle' ? item.action : item.action}
            className="w-full flex items-center gap-4 p-4 bg-white/50 rounded-2xl transition-colors hover:bg-white/70"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F7F9F4] flex items-center justify-center text-[#0A0A0A]/60">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#0A0A0A]">{item.label}</p>
                {item.badge && (
                  <GlassBadge
                    variant={
                      item.badge === 'verified' ? 'green' :
                      item.badge === 'pending' ? 'yellow' : 'red'
                    }
                    size="sm"
                  >
                    {item.badge}
                  </GlassBadge>
                )}
              </div>
              <p className="text-xs text-[#0A0A0A]/40">{item.description}</p>
            </div>
            {item.type === 'toggle' ? (
              <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                item.value ? 'bg-[#A8E6CF]' : 'bg-[#0A0A0A]/10'
              }`}>
                <motion.div
                  animate={{ x: item.value ? 20 : 0 }}
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                />
              </div>
            ) : (
              <ChevronRight className="w-5 h-5 text-[#0A0A0A]/30" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="pt-4 border-t border-[#0A0A0A]/10">
        <GlassCard className="p-4 border-2 border-[#FF6B6B]/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0A0A0A]">Danger Zone</p>
              <p className="text-xs text-[#0A0A0A]/50">Irreversible actions</p>
            </div>
          </div>
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-3 bg-[#FF6B6B]/10 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-[#FF6B6B]" />
                <span className="text-sm text-[#FF6B6B]">Export Data</span>
              </div>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-3 bg-[#FF6B6B]/10 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-[#FF6B6B]" />
                <span className="text-sm text-[#FF6B6B]">Delete Account</span>
              </div>
            </motion.button>
          </div>
        </GlassCard>
      </div>

      {/* Version Info */}
      <div className="text-center py-4">
        <p className="text-xs text-[#0A0A0A]/30">OrbitPay Credit Union</p>
        <p className="text-xs text-[#0A0A0A]/20">Made with security in mind</p>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            onClick={() => setShowLanguageModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full bg-white rounded-t-3xl p-5 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-[#0A0A0A]/20 rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Select Language</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setLanguage(lang.name);
                      setShowLanguageModal(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      language === lang.name
                        ? 'bg-[#A8E6CF]/20 border-2 border-[#A8E6CF]'
                        : 'bg-[#F7F9F4]'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="flex-1 text-left text-sm font-medium text-[#0A0A0A]">
                      {lang.name}
                    </span>
                    {language === lang.name && (
                      <Check className="w-5 h-5 text-[#2ECC71]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full bg-white rounded-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-[#FF6B6B]" />
              </div>
              <h2 className="text-xl font-bold text-[#0A0A0A] text-center mb-2">
                Delete Account?
              </h2>
              <p className="text-sm text-[#0A0A0A]/50 text-center mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="space-y-3">
                <GlassButton
                  variant="danger"
                  fullWidth
                  onClick={() => setShowDeleteModal(false)}
                >
                  Delete Permanently
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  fullWidth
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
