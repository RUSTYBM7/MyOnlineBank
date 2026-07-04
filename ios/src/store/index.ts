// ============================================================
// OrbitPay - Zustand Store (App State)
// ============================================================
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import type {
  User, BankAccount, Transaction, Card, Loan, BillPayment,
  ScheduledTransfer, KycDocument, AppNotification, ChatMessage,
  ChatRoom, AuthTokens, BiometricType, UIState, CurrencyRate,
} from '../types';

enableMapSet();

// ---- Auth Slice --------------------------------------------
interface AuthSlice {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  biometricType: BiometricType;
  biometricEnabled: boolean;

  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (val: boolean) => void;
  setAuthLoading: (val: boolean) => void;
  setBiometricType: (type: BiometricType) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  logout: () => void;
}

// ---- Data Slices -------------------------------------------
interface DataSlice {
  accounts: BankAccount[];
  transactions: Transaction[];
  cards: Card[];
  loans: Loan[];
  bills: BillPayment[];
  scheduledTransfers: ScheduledTransfer[];
  kycDocuments: KycDocument[];
  notifications: AppNotification[];
  chatRooms: ChatRoom[];
  chatMessages: Record<string, ChatMessage[]>;
  currencyRates: CurrencyRate[];

  setAccounts: (accounts: BankAccount[]) => void;
  updateAccount: (id: string, updates: Partial<BankAccount>) => void;
  setTransactions: (transactions: Transaction[]) => void;
  prependTransaction: (t: Transaction) => void;
  setCards: (cards: Card[]) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  setLoans: (loans: Loan[]) => void;
  setBills: (bills: BillPayment[]) => void;
  addBill: (bill: BillPayment) => void;
  setScheduledTransfers: (transfers: ScheduledTransfer[]) => void;
  addScheduledTransfer: (t: ScheduledTransfer) => void;
  removeScheduledTransfer: (id: string) => void;
  setKycDocuments: (docs: KycDocument[]) => void;
  setNotifications: (n: AppNotification[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setChatRooms: (rooms: ChatRoom[]) => void;
  setChatMessages: (roomId: string, messages: ChatMessage[]) => void;
  appendChatMessage: (roomId: string, message: ChatMessage) => void;
  setCurrencyRates: (rates: CurrencyRate[]) => void;
}

// ---- UI Slice ----------------------------------------------
interface UiSlice {
  darkMode: boolean;
  networkStatus: 'online' | 'offline';
  activeTab: string;
  isLoading: boolean;
  toastMessage: { type: 'success' | 'error' | 'info'; text: string } | null;

  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  setNetworkStatus: (status: 'online' | 'offline') => void;
  setActiveTab: (tab: string) => void;
  setLoading: (val: boolean) => void;
  showToast: (type: 'success' | 'error' | 'info', text: string) => void;
  clearToast: () => void;
}

type AppStore = AuthSlice & DataSlice & UiSlice;

export const useAppStore = create<AppStore>()(
  immer((set) => ({
    // ---- Auth state ----------------------------------------
    user: null,
    tokens: null,
    isAuthenticated: false,
    isAuthLoading: false,
    biometricType: 'None',
    biometricEnabled: false,

    setUser: (user) => set((s) => { s.user = user; }),
    setTokens: (tokens) => set((s) => { s.tokens = tokens; }),
    setAuthenticated: (val) => set((s) => { s.isAuthenticated = val; }),
    setAuthLoading: (val) => set((s) => { s.isAuthLoading = val; }),
    setBiometricType: (type) => set((s) => { s.biometricType = type; }),
    setBiometricEnabled: (enabled) => set((s) => { s.biometricEnabled = enabled; }),
    logout: () =>
      set((s) => {
        s.user = null;
        s.tokens = null;
        s.isAuthenticated = false;
        s.accounts = [];
        s.transactions = [];
        s.cards = [];
        s.loans = [];
        s.bills = [];
        s.notifications = [];
        s.chatRooms = [];
        s.chatMessages = {};
      }),

    // ---- Data state ----------------------------------------
    accounts: [],
    transactions: [],
    cards: [],
    loans: [],
    bills: [],
    scheduledTransfers: [],
    kycDocuments: [],
    notifications: [],
    chatRooms: [],
    chatMessages: {},
    currencyRates: [
      { code: 'USD', name: 'US Dollar',      symbol: '$', rate: 1,        change: 0,    changePercent: 0 },
      { code: 'EUR', name: 'Euro',           symbol: '€', rate: 0.92,     change: 0.15, changePercent: 0.15 },
      { code: 'GBP', name: 'British Pound',  symbol: '£', rate: 0.79,     change: -0.08,changePercent: -0.08 },
      { code: 'BTC', name: 'Bitcoin',        symbol: '₿', rate: 0.000015, change: 2.34, changePercent: 2.34 },
    ],

    setAccounts: (accounts) => set((s) => { s.accounts = accounts; }),
    updateAccount: (id, updates) =>
      set((s) => {
        const idx = s.accounts.findIndex((a) => a.id === id);
        if (idx !== -1) Object.assign(s.accounts[idx], updates);
      }),
    setTransactions: (transactions) => set((s) => { s.transactions = transactions; }),
    prependTransaction: (t) => set((s) => { s.transactions.unshift(t); }),
    setCards: (cards) => set((s) => { s.cards = cards; }),
    updateCard: (id, updates) =>
      set((s) => {
        const idx = s.cards.findIndex((c) => c.id === id);
        if (idx !== -1) Object.assign(s.cards[idx], updates);
      }),
    setLoans: (loans) => set((s) => { s.loans = loans; }),
    setBills: (bills) => set((s) => { s.bills = bills; }),
    addBill: (bill) => set((s) => { s.bills.unshift(bill); }),
    setScheduledTransfers: (transfers) => set((s) => { s.scheduledTransfers = transfers; }),
    addScheduledTransfer: (t) => set((s) => { s.scheduledTransfers.push(t); }),
    removeScheduledTransfer: (id) =>
      set((s) => { s.scheduledTransfers = s.scheduledTransfers.filter((t) => t.id !== id); }),
    setKycDocuments: (docs) => set((s) => { s.kycDocuments = docs; }),
    setNotifications: (n) => set((s) => { s.notifications = n; }),
    markNotificationRead: (id) =>
      set((s) => {
        const n = s.notifications.find((x) => x.id === id);
        if (n) n.read = true;
      }),
    markAllNotificationsRead: () =>
      set((s) => { s.notifications.forEach((n) => { n.read = true; }); }),
    setChatRooms: (rooms) => set((s) => { s.chatRooms = rooms; }),
    setChatMessages: (roomId, messages) =>
      set((s) => { s.chatMessages[roomId] = messages; }),
    appendChatMessage: (roomId, message) =>
      set((s) => {
        if (!s.chatMessages[roomId]) s.chatMessages[roomId] = [];
        s.chatMessages[roomId].push(message);
      }),
    setCurrencyRates: (rates) => set((s) => { s.currencyRates = rates; }),

    // ---- UI state ------------------------------------------
    darkMode: false,
    networkStatus: 'online',
    activeTab: 'Home',
    isLoading: false,
    toastMessage: null,

    setDarkMode: (val) => set((s) => { s.darkMode = val; }),
    toggleDarkMode: () => set((s) => { s.darkMode = !s.darkMode; }),
    setNetworkStatus: (status) => set((s) => { s.networkStatus = status; }),
    setActiveTab: (tab) => set((s) => { s.activeTab = tab; }),
    setLoading: (val) => set((s) => { s.isLoading = val; }),
    showToast: (type, text) => set((s) => { s.toastMessage = { type, text }; }),
    clearToast: () => set((s) => { s.toastMessage = null; }),
  })),
);

// ---- Derived selectors (computed values) -------------------
export const useUnreadCount = () =>
  useAppStore((s) => s.notifications.filter((n) => !n.read).length);

export const usePrimaryAccount = () =>
  useAppStore((s) => s.accounts.find((a) => a.isPrimary) ?? s.accounts[0] ?? null);

export const useTotalBalance = () =>
  useAppStore((s) => s.accounts.reduce((sum, a) => sum + a.balance, 0));

export const useActiveCards = () =>
  useAppStore((s) => s.cards.filter((c) => c.status === 'active'));
