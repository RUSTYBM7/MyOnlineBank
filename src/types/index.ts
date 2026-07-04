export type AccountStatus = 'active' | 'suspended' | 'frozen' | 'closed' | 'pending';
export type KycStatus = 'verified' | 'pending' | 'rejected' | 'not_submitted';
export type AccountTier = 'basic' | 'standard' | 'premium';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'topup' | 'debit' | 'credit' | 'loan_payment' | 'card_payment';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'held' | 'flagged';
export type AdminRole = 'super_admin' | 'support_admin' | 'finance_admin' | 'viewer';
export type ChatStatus = 'active' | 'resolved' | 'flagged';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC';
export type AccountType = 'checking' | 'savings';
export type CardType = 'debit' | 'credit';
export type CardStatus = 'active' | 'frozen' | 'blocked' | 'expired';
export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'paid_off' | 'defaulted';
export type LoanType = 'personal' | 'home' | 'auto' | 'student' | 'business';
export type OnboardingStep = 'welcome' | 'phone' | 'otp' | 'personal_info' | 'id_verification' | 'selfie' | 'address' | 'account_type' | 'review' | 'complete';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
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
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  isOnline: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  description: string;
  recipientName?: string;
  recipientAvatar?: string;
  metadata?: Record<string, any>;
  adminId?: string;
  adminAction?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoom {
  id: string;
  userId: string;
  adminId?: string;
  status: ChatStatus;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isUserOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  senderName: string;
  content: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  actionType: string;
  targetUserId?: string;
  targetUserName?: string;
  amount?: number;
  reason?: string;
  ipAddress: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions: string[];
  lastLogin: string;
  ipWhitelist: string[];
  isOnline: boolean;
  avatar?: string;
}

export interface KycDocument {
  id: string;
  userId: string;
  docType: 'id_card' | 'passport' | 'selfie' | 'address_proof';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  uploadedAt: string;
  ocrData?: Record<string, string>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'chat' | 'kyc' | 'system';
  read: boolean;
  createdAt: string;
}

export interface CurrencyRate {
  code: Currency;
  name: string;
  symbol: string;
  rate: number;
  change: number;
}

export interface AuthState {
  user: User | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
}

export interface QuickReply {
  id: string;
  label: string;
  message: string;
}

export interface AppConfig {
  brandName: string;
  brandColors: {
    mint: string;
    lavender: string;
    yellow: string;
    black: string;
  };
  glassOpacity: number;
  transferFee: number;
  withdrawalFee: number;
  investmentFee: number;
  enabledCurrencies: Currency[];
}

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
}

export interface Card {
  id: string;
  userId: string;
  type: CardType;
  name: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
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
}

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

export interface LoanPayment {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  status: TransactionStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface OnboardingData {
  step: OnboardingStep;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  idType?: 'id_card' | 'passport' | 'drivers_license';
  idNumber?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  selfieUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  selectedAccountType?: AccountType;
  agreedToTerms: boolean;
}

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

export interface BillPayment {
  id: string;
  userId: string;
  billerName: string;
  billerCategory: string;
  accountNumber: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}
