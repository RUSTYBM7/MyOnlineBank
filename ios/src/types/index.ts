// ============================================================
// OrbitPay Credit Union - Core Type Definitions
// ============================================================

export type AccountStatus = 'active' | 'suspended' | 'frozen' | 'closed' | 'pending';
export type KycStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';
export type AccountTier = 'basic' | 'standard' | 'premium';
export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'investment'
  | 'topup'
  | 'debit'
  | 'credit'
  | 'loan_payment'
  | 'card_payment'
  | 'bill_payment';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'held' | 'flagged';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC';
export type AccountType = 'checking' | 'savings' | 'joint';
export type CardType = 'debit' | 'credit';
export type CardStatus = 'active' | 'frozen' | 'blocked' | 'expired';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'paid_off' | 'defaulted';
export type LoanType = 'personal' | 'home' | 'auto' | 'student' | 'business';
export type NotificationType = 'transaction' | 'security' | 'chat' | 'kyc' | 'system' | 'promo';
export type BiometricType = 'FaceID' | 'TouchID' | 'Biometrics' | 'None';

// ---- User ---------------------------------------------------
export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  kycStatus: KycStatus;
  accountStatus: AccountStatus;
  tier: AccountTier;
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
  balanceUsd: number;
  balanceEur: number;
  balanceGbp: number;
  balanceBtc: number;
  btcPrice: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  isOnline: boolean;
  twoFactorEnabled: boolean;
  pushNotificationsEnabled: boolean;
  biometricEnabled: boolean;
}

// ---- Bank Account -------------------------------------------
export interface BankAccount {
  id: string;
  userId: string;
  type: AccountType;
  name: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: Currency;
  status: AccountStatus;
  interestRate: number;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
  color: string;
  availableBalance?: number;
  pendingBalance?: number;
}

// ---- Transaction --------------------------------------------
export interface Transaction {
  id: string;
  userId: string;
  accountId?: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  description: string;
  category?: string;
  recipientName?: string;
  recipientAvatar?: string;
  recipientAccountNumber?: string;
  senderName?: string;
  referenceNumber?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

// ---- Card ---------------------------------------------------
export interface Card {
  id: string;
  userId: string;
  accountId?: string;
  type: CardType;
  name: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  cvv?: string;
  status: CardStatus;
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
  dailyLimit: number;
  monthlyLimit: number;
  isVirtual: boolean;
  cardNetwork: 'visa' | 'mastercard' | 'amex';
  color: string;
  createdAt: string;
  updatedAt: string;
  contactlessEnabled: boolean;
  internationalEnabled: boolean;
  onlineEnabled: boolean;
}

// ---- Loan ---------------------------------------------------
export interface Loan {
  id: string;
  userId: string;
  type: LoanType;
  name: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  remainingBalance: number;
  totalPaid: number;
  status: LoanStatus;
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  collateral?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Bill Payment -------------------------------------------
export interface BillPayment {
  id: string;
  userId: string;
  billerName: string;
  billerCategory: string;
  billerLogo?: string;
  accountNumber: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  dueDate?: string;
  paidAt?: string;
  isAutoPay?: boolean;
  createdAt: string;
}

// ---- Scheduled Transfer -------------------------------------
export interface ScheduledTransfer {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountNumber: string;
  toAccountName: string;
  amount: number;
  currency: Currency;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  nextRunDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'cancelled';
  description: string;
  createdAt: string;
}

// ---- KYC Document ------------------------------------------
export interface KycDocument {
  id: string;
  userId: string;
  docType: 'id_card' | 'passport' | 'drivers_license' | 'selfie' | 'address_proof';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  uploadedAt: string;
  ocrData?: Record<string, string>;
}

// ---- Notification ------------------------------------------
export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  icon?: string;
  createdAt: string;
}

// ---- Auth --------------------------------------------------
export interface AuthCredentials {
  email?: string;
  phone?: string;
  memberId?: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  biometricType: BiometricType;
  lastAuthMethod: 'password' | 'biometric' | 'pin' | null;
}

// ---- Transfer Form -----------------------------------------
export interface TransferFormData {
  fromAccountId: string;
  toAccountNumber: string;
  toAccountName: string;
  amount: string;
  currency: Currency;
  description: string;
  transferType: 'internal' | 'external' | 'wire' | 'crypto';
  scheduledDate?: string;
  isRecurring?: boolean;
  frequency?: ScheduledTransfer['frequency'];
}

// ---- API Response ------------------------------------------
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ---- UI State ----------------------------------------------
export interface UIState {
  darkMode: boolean;
  activeTab: string;
  isOnboarding: boolean;
  networkStatus: 'online' | 'offline';
  appState: 'active' | 'background' | 'inactive';
}

// ---- Currency Rate -----------------------------------------
export interface CurrencyRate {
  code: Currency;
  name: string;
  symbol: string;
  rate: number;
  change: number;
  changePercent: number;
}

// ---- Support Chat ------------------------------------------
export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'user' | 'support' | 'bot';
  senderName: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'document' | 'audio';
  isRead: boolean;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  userId: string;
  status: 'active' | 'resolved' | 'flagged';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Spending Analytics ------------------------------------
export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  transactionCount: number;
}

export interface SpendingAnalytics {
  totalSpent: number;
  totalIncome: number;
  netChange: number;
  categories: SpendingCategory[];
  monthlyData: { month: string; spent: number; income: number }[];
}

// ---- Navigation Types --------------------------------------
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Login: undefined;
  Biometric: { reason?: string };
  PinEntry: { mode: 'setup' | 'verify'; onSuccess?: () => void };
  ForgotPassword: undefined;
  Main: undefined;
  TransactionDetail: { transactionId: string };
  AccountDetail: { accountId: string };
  CardDetail: { cardId: string };
  LoanDetail: { loanId: string };
  SendMoney: { fromAccountId?: string };
  RequestMoney: undefined;
  BillPayDetail: { billId?: string };
  KycVerification: { step?: string };
  AddCard: undefined;
  Notifications: undefined;
  Settings: undefined;
  Support: undefined;
  Profile: undefined;
  ChangePassword: undefined;
  LinkedAccounts: undefined;
  StatementDownload: { accountId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Accounts: undefined;
  Transfer: undefined;
  Cards: undefined;
  More: undefined;
};
