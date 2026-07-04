// ============================================================
// OrbitPay - App Constants & Design Tokens
// ============================================================

export const APP_NAME = 'OrbitPay';
export const APP_DISPLAY_NAME = 'OrbitPay Credit Union';
export const BUNDLE_ID = 'com.orbitpay.creditunion';
export const API_BASE_URL = 'https://8145kvozdhay.space.minimax.io';
export const WS_BASE_URL = 'wss://8145kvozdhay.space.minimax.io';

// ---- Design Tokens -----------------------------------------
export const COLORS = {
  // Primary brand palette (emerald / teal / cyan)
  primary: {
    50:  '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',   // Emerald 500 — primary brand colour
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  teal: {
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
  },
  cyan: {
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#3B82F6',

  // Neutrals
  white:   '#FFFFFF',
  black:   '#0A0A0A',
  gray: {
    50:  '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Background gradients
  gradientStart: '#ECFDF5',
  gradientMid:   '#F0FDFA',
  gradientEnd:   '#ECFEFF',

  // Glass surfaces
  glassBg:           'rgba(255,255,255,0.7)',
  glassBgDark:        'rgba(17,24,39,0.7)',
  glassBorder:        'rgba(255,255,255,0.5)',
  glassBorderDark:    'rgba(255,255,255,0.1)',
  glassShadow:        'rgba(0,0,0,0.08)',
  glassShadowDark:    'rgba(0,0,0,0.3)',

  // Card gradients
  cardGradients: {
    emerald: ['#059669', '#047857'],
    teal:    ['#0D9488', '#0F766E'],
    cyan:    ['#0891B2', '#0E7490'],
    purple:  ['#7C3AED', '#5B21B6'],
    dark:    ['#1F2937', '#111827'],
    gold:    ['#D97706', '#B45309'],
  },

  // Transparent overlays
  overlay10: 'rgba(0,0,0,0.10)',
  overlay20: 'rgba(0,0,0,0.20)',
  overlay50: 'rgba(0,0,0,0.50)',
  overlay70: 'rgba(0,0,0,0.70)',
  white10:   'rgba(255,255,255,0.10)',
  white20:   'rgba(255,255,255,0.20)',
  white30:   'rgba(255,255,255,0.30)',
};

// ---- Typography --------------------------------------------
export const FONTS = {
  regular:     'System',
  medium:      'System',
  semiBold:    'System',
  bold:        'System',
  light:       'System',
  mono:        'Courier',
};

export const FONT_SIZES = {
  xs:    11,
  sm:    13,
  base:  15,
  md:    16,
  lg:    18,
  xl:    20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const LINE_HEIGHTS = {
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.75,
};

// ---- Spacing -----------------------------------------------
export const SPACING = {
  1:   4,
  2:   8,
  3:   12,
  4:   16,
  5:   20,
  6:   24,
  7:   28,
  8:   32,
  10:  40,
  12:  48,
  16:  64,
  20:  80,
};

// ---- Border Radius -----------------------------------------
export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  full: 9999,
};

// ---- Shadows -----------------------------------------------
export const SHADOWS = {
  sm: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius:  2,
    elevation:     2,
  },
  md: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius:  4,
    elevation:     4,
  },
  lg: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius:  8,
    elevation:     8,
  },
  emerald: {
    shadowColor:   '#10B981',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius:  8,
    elevation:     6,
  },
};

// ---- Keychain Keys -----------------------------------------
export const KEYCHAIN_KEYS = {
  AUTH_TOKEN:      'orbitpay_auth_token',
  REFRESH_TOKEN:   'orbitpay_refresh_token',
  BIOMETRIC_CREDS: 'orbitpay_biometric_creds',
  PIN_HASH:        'orbitpay_pin_hash',
  USER_DATA:       'orbitpay_user_data',
};

// ---- AsyncStorage Keys ------------------------------------
export const STORAGE_KEYS = {
  ONBOARDING_DONE:  '@orbitpay:onboarding_complete',
  REMEMBER_EMAIL:   '@orbitpay:remember_email',
  DARK_MODE:        '@orbitpay:dark_mode',
  LAST_CURRENCY:    '@orbitpay:last_currency',
  PUSH_ENABLED:     '@orbitpay:push_enabled',
  BIOMETRIC_ASKED:  '@orbitpay:biometric_asked',
  FCM_TOKEN:        '@orbitpay:fcm_token',
};

// ---- API Endpoints -----------------------------------------
export const API_ENDPOINTS = {
  // Auth
  LOGIN:              '/api/auth/login',
  LOGOUT:             '/api/auth/logout',
  REFRESH:            '/api/auth/refresh',
  REGISTER:           '/api/auth/register',
  FORGOT_PASSWORD:    '/api/auth/forgot-password',
  RESET_PASSWORD:     '/api/auth/reset-password',
  VERIFY_EMAIL:       '/api/auth/verify-email',
  SEND_OTP:           '/api/auth/send-otp',
  VERIFY_OTP:         '/api/auth/verify-otp',

  // User
  ME:                 '/api/user/me',
  UPDATE_PROFILE:     '/api/user/profile',
  UPDATE_PASSWORD:    '/api/user/password',
  UPDATE_SETTINGS:    '/api/user/settings',

  // Accounts
  ACCOUNTS:           '/api/accounts',
  ACCOUNT_DETAIL:     (id: string) => `/api/accounts/${id}`,
  ACCOUNT_STATEMENT:  (id: string) => `/api/accounts/${id}/statement`,
  SET_PRIMARY:        (id: string) => `/api/accounts/${id}/primary`,

  // Transactions
  TRANSACTIONS:       '/api/transactions',
  TRANSACTION_DETAIL: (id: string) => `/api/transactions/${id}`,
  EXPORT_CSV:         '/api/transactions/export',

  // Transfers
  TRANSFER:           '/api/transfers',
  TRANSFER_VERIFY:    '/api/transfers/verify',
  WIRE_TRANSFER:      '/api/transfers/wire',
  CRYPTO_TRANSFER:    '/api/transfers/crypto',
  SCHEDULED:          '/api/transfers/scheduled',
  SCHEDULED_DETAIL:   (id: string) => `/api/transfers/scheduled/${id}`,

  // Cards
  CARDS:              '/api/cards',
  CARD_DETAIL:        (id: string) => `/api/cards/${id}`,
  CARD_FREEZE:        (id: string) => `/api/cards/${id}/freeze`,
  CARD_UNFREEZE:      (id: string) => `/api/cards/${id}/unfreeze`,
  CARD_PIN:           (id: string) => `/api/cards/${id}/pin`,
  CARD_LIMITS:        (id: string) => `/api/cards/${id}/limits`,
  VIRTUAL_CARD:       '/api/cards/virtual',

  // Bills
  BILLS:              '/api/bills',
  BILL_PAY:           '/api/bills/pay',
  BILL_AUTOPAY:       (id: string) => `/api/bills/${id}/autopay`,

  // Loans
  LOANS:              '/api/loans',
  LOAN_DETAIL:        (id: string) => `/api/loans/${id}`,
  LOAN_APPLY:         '/api/loans/apply',
  LOAN_PAYMENT:       (id: string) => `/api/loans/${id}/payment`,

  // KYC
  KYC_STATUS:         '/api/kyc/status',
  KYC_UPLOAD:         '/api/kyc/upload',
  KYC_PRESIGN:        '/api/kyc/presign',

  // Notifications
  NOTIFICATIONS:      '/api/notifications',
  MARK_READ:          (id: string) => `/api/notifications/${id}/read`,
  MARK_ALL_READ:      '/api/notifications/read-all',
  FCM_TOKEN:          '/api/notifications/fcm-token',

  // Support
  CHAT_ROOMS:         '/api/support/rooms',
  CHAT_MESSAGES:      (roomId: string) => `/api/support/rooms/${roomId}/messages`,
  CHAT_SEND:          (roomId: string) => `/api/support/rooms/${roomId}/send`,

  // Analytics
  SPENDING:           '/api/analytics/spending',
  INSIGHTS:           '/api/analytics/insights',
};

// ---- Transaction Category Icons ----------------------------
export const TRANSACTION_ICONS: Record<string, string> = {
  transfer:     'swap-horiz',
  deposit:      'arrow-downward',
  withdrawal:   'arrow-upward',
  investment:   'trending-up',
  topup:        'add-circle',
  debit:        'remove-circle',
  credit:       'add-circle',
  loan_payment: 'account-balance',
  card_payment: 'credit-card',
  bill_payment: 'receipt',
};

export const TRANSACTION_CATEGORY_COLORS: Record<string, string> = {
  food:          '#F59E0B',
  transport:     '#3B82F6',
  shopping:      '#8B5CF6',
  utilities:     '#10B981',
  entertainment: '#EC4899',
  health:        '#EF4444',
  travel:        '#06B6D4',
  investment:    '#059669',
  other:         '#9CA3AF',
};

// ---- Biometric -------------------------------------------------
export const BIOMETRIC_REASON = 'Authenticate to access OrbitPay';
export const BIOMETRIC_PROMPT = {
  title:             'OrbitPay Authentication',
  subtitle:          'Use biometrics to securely access your account',
  description:       'Confirm your identity to continue',
  fallbackLabel:     'Use PIN instead',
  cancelLabel:       'Cancel',
};

// ---- Misc --------------------------------------------------
export const MAX_PIN_LENGTH = 6;
export const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
export const REFRESH_INTERVAL_MS = 30 * 1000;     // 30 seconds
export const MAX_TRANSFER_AMOUNT = 50000;
export const MIN_TRANSFER_AMOUNT = 0.01;

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'BTC'] as const;
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  BTC: '₿',
};

export const BILLER_CATEGORIES = [
  { id: 'electricity', label: 'Electricity', icon: 'flash-on' },
  { id: 'water',       label: 'Water',       icon: 'opacity' },
  { id: 'internet',   label: 'Internet',    icon: 'wifi' },
  { id: 'phone',      label: 'Phone',       icon: 'phone' },
  { id: 'gas',        label: 'Gas',         icon: 'local-fire-department' },
  { id: 'insurance',  label: 'Insurance',   icon: 'security' },
  { id: 'streaming',  label: 'Streaming',   icon: 'play-circle' },
  { id: 'gym',        label: 'Gym',         icon: 'fitness-center' },
  { id: 'other',      label: 'Other',       icon: 'receipt' },
];
