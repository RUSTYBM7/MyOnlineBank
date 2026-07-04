// ============================================================
// OrbitPay - Mock Data Service
// Seeds the Zustand store with realistic demo data so the app
// is fully functional even without a live API connection.
// ============================================================
import { useAppStore } from '../store';
import type {
  User, BankAccount, Transaction, Card, Loan,
  BillPayment, AppNotification, ScheduledTransfer,
} from '../types';

const NOW  = new Date();
const days = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();

// ─── Seed User ─────────────────────────────────────────────
const SEED_USER: User = {
  id:                    'u_demo_001',
  email:                 'alex.morgan@orbitpay.demo',
  username:              'alexmorgan',
  fullName:              'Alex Morgan',
  phone:                 '+1 (555) 867-5309',
  kycStatus:             'verified',
  tier:                  'premium',
  accountStatus:         'active',
  twoFactorEnabled:      true,
  pushNotificationsEnabled: true,
  createdAt:             days(365),
  updatedAt:             days(1),
};

// ─── Seed Accounts ─────────────────────────────────────────
const SEED_ACCOUNTS: BankAccount[] = [
  {
    id:             'acc_checking_001',
    userId:         'u_demo_001',
    name:           'Primary Checking',
    accountNumber:  '****7842',
    routingNumber:  '021000021',
    type:           'checking',
    balance:        12847.53,
    currency:       'USD',
    status:         'active',
    isPrimary:      true,
    color:          'mint',
    interestRate:   0.05,
    createdAt:      days(365),
    updatedAt:      days(0),
  },
  {
    id:             'acc_savings_001',
    userId:         'u_demo_001',
    name:           'High-Yield Savings',
    accountNumber:  '****3291',
    routingNumber:  '021000021',
    type:           'savings',
    balance:        48200.00,
    currency:       'USD',
    status:         'active',
    isPrimary:      false,
    color:          'teal',
    interestRate:   4.85,
    createdAt:      days(300),
    updatedAt:      days(0),
  },
  {
    id:             'acc_joint_001',
    userId:         'u_demo_001',
    name:           'Joint Account',
    accountNumber:  '****5508',
    routingNumber:  '021000021',
    type:           'joint',
    balance:        3540.20,
    currency:       'USD',
    status:         'active',
    isPrimary:      false,
    color:          'purple',
    interestRate:   0.01,
    createdAt:      days(180),
    updatedAt:      days(2),
  },
];

// ─── Seed Transactions ─────────────────────────────────────
const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx001', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'food_dining',   merchantName: 'Whole Foods Market', description: 'Grocery shopping',     amount: 87.42,   currency: 'USD', status: 'completed', reference: 'TXN20240101A', createdAt: days(0) },
  { id: 'tx002', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'credit',  category: 'salary',        merchantName: 'Acme Corp',           description: 'Monthly salary',       amount: 5200.00, currency: 'USD', status: 'completed', reference: 'TXN20240102A', createdAt: days(1) },
  { id: 'tx003', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'transport',     merchantName: 'Uber',                description: 'Ride share',           amount: 18.50,   currency: 'USD', status: 'completed', reference: 'TXN20240103A', createdAt: days(1) },
  { id: 'tx004', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'entertainment', merchantName: 'Netflix',             description: 'Monthly subscription', amount: 15.99,   currency: 'USD', status: 'completed', reference: 'TXN20240104A', createdAt: days(2) },
  { id: 'tx005', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'shopping',      merchantName: 'Amazon',              description: 'Online purchase',      amount: 134.99,  currency: 'USD', status: 'completed', reference: 'TXN20240105A', createdAt: days(3) },
  { id: 'tx006', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'transfer', category: 'transfer',     merchantName: 'High-Yield Savings',  description: 'Transfer to savings',  amount: 500.00,  currency: 'USD', status: 'completed', reference: 'TXN20240106A', createdAt: days(4) },
  { id: 'tx007', accountId: 'acc_savings_001',  userId: 'u_demo_001', type: 'credit',  category: 'investment',    merchantName: 'OrbitPay Interest',   description: 'Monthly interest',     amount: 194.57,  currency: 'USD', status: 'completed', reference: 'TXN20240107A', createdAt: days(4) },
  { id: 'tx008', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'utilities',     merchantName: 'Con Edison',          description: 'Electric bill',        amount: 112.80,  currency: 'USD', status: 'completed', reference: 'TXN20240108A', createdAt: days(5) },
  { id: 'tx009', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'healthcare',    merchantName: 'CVS Pharmacy',        description: 'Prescription',         amount: 32.45,   currency: 'USD', status: 'completed', reference: 'TXN20240109A', createdAt: days(6) },
  { id: 'tx010', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'food_dining',   merchantName: 'Starbucks',           description: 'Coffee',               amount: 6.75,    currency: 'USD', status: 'completed', reference: 'TXN20240110A', createdAt: days(6) },
  { id: 'tx011', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'refund',  category: 'refund',        merchantName: 'Apple Store',         description: 'Return refund',        amount: 299.00,  currency: 'USD', status: 'completed', reference: 'TXN20240111A', createdAt: days(7) },
  { id: 'tx012', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'travel',        merchantName: 'Delta Airlines',      description: 'Flight booking',       amount: 387.00,  currency: 'USD', status: 'pending',   reference: 'TXN20240112A', createdAt: days(0) },
  { id: 'tx013', accountId: 'acc_joint_001',    userId: 'u_demo_001', type: 'debit',   category: 'shopping',      merchantName: 'Target',              description: 'Household items',      amount: 73.28,   currency: 'USD', status: 'completed', reference: 'TXN20240113A', createdAt: days(8) },
  { id: 'tx014', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'debit',   category: 'food_dining',   merchantName: 'DoorDash',            description: 'Food delivery',        amount: 45.20,   currency: 'USD', status: 'completed', reference: 'TXN20240114A', createdAt: days(9) },
  { id: 'tx015', accountId: 'acc_checking_001', userId: 'u_demo_001', type: 'credit',  category: 'deposit',       merchantName: 'Venmo Transfer',      description: 'P2P receive',          amount: 120.00,  currency: 'USD', status: 'completed', reference: 'TXN20240115A', createdAt: days(10) },
];

// ─── Seed Cards ─────────────────────────────────────────────
const SEED_CARDS: Card[] = [
  {
    id:           'card_001',
    userId:       'u_demo_001',
    accountId:    'acc_checking_001',
    cardNumber:   '4532789012347842',
    maskedNumber: '•••• •••• •••• 7842',
    cardholderName: 'ALEX MORGAN',
    expiryMonth:  12,
    expiryYear:   2027,
    cvv:          '***',
    type:         'debit',
    network:      'visa',
    status:       'active',
    color:        'mint',
    isVirtual:    false,
    dailyLimit:   5000,
    monthlyLimit: 25000,
    contactlessEnabled:   true,
    internationalEnabled: true,
    onlineEnabled:        true,
    createdAt:    days(365),
    updatedAt:    days(0),
  },
  {
    id:           'card_002',
    userId:       'u_demo_001',
    accountId:    'acc_checking_001',
    cardNumber:   '5425233430109903',
    maskedNumber: '•••• •••• •••• 9903',
    cardholderName: 'ALEX MORGAN',
    expiryMonth:  8,
    expiryYear:   2026,
    cvv:          '***',
    type:         'credit',
    network:      'mastercard',
    status:       'active',
    color:        'teal',
    isVirtual:    true,
    dailyLimit:   10000,
    monthlyLimit: 50000,
    contactlessEnabled:   true,
    internationalEnabled: false,
    onlineEnabled:        true,
    createdAt:    days(200),
    updatedAt:    days(0),
  },
];

// ─── Seed Bills ─────────────────────────────────────────────
const SEED_BILLS: BillPayment[] = [
  { id: 'bill_001', userId: 'u_demo_001', billerName: 'Con Edison',    category: 'utilities',   amount: 112.80, currency: 'USD', dueDate: days(-3), status: 'overdue',   autoPay: false, accountNumber: 'CEI-7842901', createdAt: days(30) },
  { id: 'bill_002', userId: 'u_demo_001', billerName: 'Verizon',       category: 'phone',       amount: 89.99,  currency: 'USD', dueDate: days(-7), status: 'pending',   autoPay: true,  accountNumber: 'VZN-331-9020', createdAt: days(60) },
  { id: 'bill_003', userId: 'u_demo_001', billerName: 'Netflix',       category: 'streaming',   amount: 15.99,  currency: 'USD', dueDate: days(-14), status: 'paid',     paidAt: days(-14), autoPay: true,  createdAt: days(90) },
  { id: 'bill_004', userId: 'u_demo_001', billerName: 'Spotify',       category: 'streaming',   amount: 9.99,   currency: 'USD', dueDate: days(-10), status: 'paid',     paidAt: days(-10), autoPay: true,  createdAt: days(120) },
  { id: 'bill_005', userId: 'u_demo_001', billerName: 'State Farm',    category: 'insurance',   amount: 245.00, currency: 'USD', dueDate: days(-5), status: 'scheduled', autoPay: false, accountNumber: 'SF-ALEX-9928', createdAt: days(180) },
  { id: 'bill_006', userId: 'u_demo_001', billerName: 'Comcast Xfinity', category: 'internet', amount: 79.99,  currency: 'USD', dueDate: days(-2), status: 'pending',   autoPay: false, accountNumber: 'CMC-44490-1', createdAt: days(200) },
];

// ─── Seed Loans ─────────────────────────────────────────────
const SEED_LOANS: Loan[] = [
  {
    id:             'loan_001',
    userId:         'u_demo_001',
    type:           'mortgage',
    amount:         320000,
    balance:        287450.30,
    interestRate:   3.75,
    termMonths:     360,
    monthlyPayment: 1481.50,
    nextPaymentDate: days(-15),
    status:         'active',
    currency:       'USD',
    createdAt:      days(730),
    updatedAt:      days(0),
  },
  {
    id:             'loan_002',
    userId:         'u_demo_001',
    type:           'auto',
    amount:         28000,
    balance:        14320.88,
    interestRate:   5.25,
    termMonths:     60,
    monthlyPayment: 531.90,
    nextPaymentDate: days(-8),
    status:         'active',
    currency:       'USD',
    createdAt:      days(400),
    updatedAt:      days(0),
  },
];

// ─── Seed Notifications ────────────────────────────────────
const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'notif_001', userId: 'u_demo_001', type: 'security',    title: 'New Device Login',           message: 'A new device logged into your account from San Francisco, CA. If this wasn\'t you, change your password immediately.', read: false, createdAt: days(0) },
  { id: 'notif_002', userId: 'u_demo_001', type: 'transaction', title: 'Large Transaction Alert',    message: 'A debit of $387.00 from Delta Airlines was charged to your checking account.',   read: false, createdAt: days(0) },
  { id: 'notif_003', userId: 'u_demo_001', type: 'transaction', title: 'Salary Received',            message: 'Your monthly salary of $5,200.00 from Acme Corp has been credited.',             read: true,  createdAt: days(1) },
  { id: 'notif_004', userId: 'u_demo_001', type: 'kyc',         title: 'Identity Verified',          message: 'Your identity has been successfully verified. All features are now unlocked.',    read: true,  createdAt: days(2) },
  { id: 'notif_005', userId: 'u_demo_001', type: 'system',      title: 'Scheduled Maintenance',      message: 'OrbitPay will undergo scheduled maintenance on Sunday 2:00 AM - 4:00 AM ET.',    read: true,  createdAt: days(3) },
  { id: 'notif_006', userId: 'u_demo_001', type: 'promo',       title: 'Earn 4.85% APY',             message: 'Move your savings to our High-Yield account and earn 10x the national average.',  read: false, createdAt: days(4) },
  { id: 'notif_007', userId: 'u_demo_001', type: 'transaction', title: 'Bill Payment Due',           message: 'Your Con Edison bill of $112.80 is overdue. Pay now to avoid late fees.',         read: false, createdAt: days(4) },
];

// ─── MockDataService ───────────────────────────────────────
export const MockDataService = {
  /**
   * Seeds the Zustand store with demo data.
   * Called from App.tsx during initialization.
   * Only seeds data that's not already populated.
   */
  seed: () => {
    const store = useAppStore.getState();

    // Only seed if store is empty (first launch or after clear)
    if (store.accounts.length === 0) {
      store.setAccounts(SEED_ACCOUNTS);
    }
    if (store.transactions.length === 0) {
      store.setTransactions(SEED_TRANSACTIONS);
    }
    if (store.cards.length === 0) {
      store.setCards(SEED_CARDS);
    }
    if (store.bills.length === 0) {
      store.setBills(SEED_BILLS);
    }
    if (store.loans.length === 0) {
      store.setLoans(SEED_LOANS);
    }
    if (store.notifications.length === 0) {
      store.setNotifications(SEED_NOTIFICATIONS);
    }

    // Seed user only if not authenticated
    if (!store.user) {
      store.setUser(SEED_USER);
      store.setTokens({
        accessToken:  'demo_access_token_orbitpay',
        refreshToken: 'demo_refresh_token_orbitpay',
        expiresIn:    3600,
      });
    }
  },

  /**
   * Returns fresh seed data without writing to store.
   * Useful for resetting state in tests.
   */
  getData: () => ({
    user:          SEED_USER,
    accounts:      SEED_ACCOUNTS,
    transactions:  SEED_TRANSACTIONS,
    cards:         SEED_CARDS,
    bills:         SEED_BILLS,
    loans:         SEED_LOANS,
    notifications: SEED_NOTIFICATIONS,
  }),
};
