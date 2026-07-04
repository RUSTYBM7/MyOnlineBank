// ============================================================
// OrbitPay - All API Services (Accounts, Transactions, etc.)
// ============================================================
import { api, apiClient } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';
import type {
  BankAccount, Transaction, Card, Loan, BillPayment,
  ScheduledTransfer, KycDocument, AppNotification,
  ChatRoom, ChatMessage, TransferFormData, PaginatedResponse,
  SpendingAnalytics, User,
} from '../types';

// ---- Account Service ---------------------------------------
export const AccountService = {
  getAccounts: (): Promise<BankAccount[]> =>
    api.get<BankAccount[]>(API_ENDPOINTS.ACCOUNTS),

  getAccount: (id: string): Promise<BankAccount> =>
    api.get<BankAccount>(API_ENDPOINTS.ACCOUNT_DETAIL(id)),

  setPrimary: (id: string): Promise<BankAccount> =>
    api.post<BankAccount>(API_ENDPOINTS.SET_PRIMARY(id)),

  downloadStatement: (id: string, format: 'pdf' | 'csv' = 'pdf'): Promise<string> =>
    api.get<string>(`${API_ENDPOINTS.ACCOUNT_STATEMENT(id)}?format=${format}`),
};

// ---- Transaction Service -----------------------------------
export const TransactionService = {
  getTransactions: (params?: {
    accountId?: string;
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    from?: string;
    to?: string;
    search?: string;
  }): Promise<PaginatedResponse<Transaction>> =>
    apiClient.get(API_ENDPOINTS.TRANSACTIONS, { params }).then(r => r.data.data),

  getTransaction: (id: string): Promise<Transaction> =>
    api.get<Transaction>(API_ENDPOINTS.TRANSACTION_DETAIL(id)),

  exportCsv: (params?: { from?: string; to?: string }): Promise<string> =>
    api.get<string>(API_ENDPOINTS.EXPORT_CSV, { params }),
};

// ---- Transfer Service --------------------------------------
export const TransferService = {
  initiateTransfer: (data: TransferFormData): Promise<Transaction> =>
    api.post<Transaction>(API_ENDPOINTS.TRANSFER, data),

  verifyRecipient: (accountNumber: string): Promise<{ name: string; bank: string }> =>
    api.post<{ name: string; bank: string }>(API_ENDPOINTS.TRANSFER_VERIFY, { accountNumber }),

  getScheduled: (): Promise<ScheduledTransfer[]> =>
    api.get<ScheduledTransfer[]>(API_ENDPOINTS.SCHEDULED),

  createScheduled: (data: Partial<ScheduledTransfer>): Promise<ScheduledTransfer> =>
    api.post<ScheduledTransfer>(API_ENDPOINTS.SCHEDULED, data),

  updateScheduled: (id: string, data: Partial<ScheduledTransfer>): Promise<ScheduledTransfer> =>
    api.patch<ScheduledTransfer>(API_ENDPOINTS.SCHEDULED_DETAIL(id), data),

  deleteScheduled: (id: string): Promise<void> =>
    api.delete(API_ENDPOINTS.SCHEDULED_DETAIL(id)),
};

// ---- Card Service ------------------------------------------
export const CardService = {
  getCards: (): Promise<Card[]> =>
    api.get<Card[]>(API_ENDPOINTS.CARDS),

  getCard: (id: string): Promise<Card> =>
    api.get<Card>(API_ENDPOINTS.CARD_DETAIL(id)),

  freezeCard: (id: string): Promise<Card> =>
    api.post<Card>(API_ENDPOINTS.CARD_FREEZE(id)),

  unfreezeCard: (id: string): Promise<Card> =>
    api.post<Card>(API_ENDPOINTS.CARD_UNFREEZE(id)),

  updateLimits: (id: string, daily: number, monthly: number): Promise<Card> =>
    api.patch<Card>(API_ENDPOINTS.CARD_LIMITS(id), { daily, monthly }),

  setPin: (id: string, pin: string): Promise<void> =>
    api.post(API_ENDPOINTS.CARD_PIN(id), { pin }),

  createVirtual: (): Promise<Card> =>
    api.post<Card>(API_ENDPOINTS.VIRTUAL_CARD),
};

// ---- Loan Service ------------------------------------------
export const LoanService = {
  getLoans: (): Promise<Loan[]> =>
    api.get<Loan[]>(API_ENDPOINTS.LOANS),

  getLoan: (id: string): Promise<Loan> =>
    api.get<Loan>(API_ENDPOINTS.LOAN_DETAIL(id)),

  applyForLoan: (data: Partial<Loan>): Promise<Loan> =>
    api.post<Loan>(API_ENDPOINTS.LOAN_APPLY, data),

  makePayment: (id: string, amount: number): Promise<Transaction> =>
    api.post<Transaction>(API_ENDPOINTS.LOAN_PAYMENT(id), { amount }),
};

// ---- Bill Service ------------------------------------------
export const BillService = {
  getBills: (): Promise<BillPayment[]> =>
    api.get<BillPayment[]>(API_ENDPOINTS.BILLS),

  payBill: (data: Partial<BillPayment>): Promise<BillPayment> =>
    api.post<BillPayment>(API_ENDPOINTS.BILL_PAY, data),

  setAutoPay: (id: string, enabled: boolean): Promise<BillPayment> =>
    api.post<BillPayment>(API_ENDPOINTS.BILL_AUTOPAY(id), { enabled }),
};

// ---- KYC Service -------------------------------------------
export const KycService = {
  getStatus: (): Promise<{ status: string; documents: KycDocument[] }> =>
    api.get(API_ENDPOINTS.KYC_STATUS),

  getPresignedUrl: (
    docType: string,
    mimeType: string,
  ): Promise<{ uploadUrl: string; fileKey: string }> =>
    api.post(API_ENDPOINTS.KYC_PRESIGN, { docType, mimeType }),

  /** Upload a KYC document directly to storage (presigned URL pattern) */
  uploadDocument: async (
    docType: string,
    fileUri: string,
    mimeType: string,
  ): Promise<KycDocument> => {
    const { uploadUrl, fileKey } = await KycService.getPresignedUrl(docType, mimeType);

    const fileData = await fetch(fileUri);
    const blob = await fileData.blob();

    await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': mimeType },
    });

    return api.post<KycDocument>(API_ENDPOINTS.KYC_UPLOAD, { docType, fileKey });
  },
};

// ---- Notification Service ----------------------------------
export const NotificationService = {
  getNotifications: (): Promise<AppNotification[]> =>
    api.get<AppNotification[]>(API_ENDPOINTS.NOTIFICATIONS),

  markRead: (id: string): Promise<void> =>
    api.post(API_ENDPOINTS.MARK_READ(id)),

  markAllRead: (): Promise<void> =>
    api.post(API_ENDPOINTS.MARK_ALL_READ),

  registerFcmToken: (token: string): Promise<void> =>
    api.post(API_ENDPOINTS.FCM_TOKEN, { token }),
};

// ---- Support Chat Service ----------------------------------
export const ChatService = {
  getRooms: (): Promise<ChatRoom[]> =>
    api.get<ChatRoom[]>(API_ENDPOINTS.CHAT_ROOMS),

  getMessages: (roomId: string): Promise<ChatMessage[]> =>
    api.get<ChatMessage[]>(API_ENDPOINTS.CHAT_MESSAGES(roomId)),

  sendMessage: (roomId: string, content: string): Promise<ChatMessage> =>
    api.post<ChatMessage>(API_ENDPOINTS.CHAT_SEND(roomId), { content }),
};

// ---- Analytics Service -------------------------------------
export const AnalyticsService = {
  getSpending: (params?: { from?: string; to?: string }): Promise<SpendingAnalytics> =>
    api.get<SpendingAnalytics>(API_ENDPOINTS.SPENDING, { params }),
};

// ---- User Service ------------------------------------------
export const UserService = {
  updateProfile: (data: Partial<User>): Promise<User> =>
    api.patch<User>(API_ENDPOINTS.UPDATE_PROFILE, data),

  updateSettings: (data: Partial<User>): Promise<User> =>
    api.patch<User>(API_ENDPOINTS.UPDATE_SETTINGS, data),

  updatePassword: (current: string, newPassword: string): Promise<void> =>
    api.post(API_ENDPOINTS.UPDATE_PASSWORD, { currentPassword: current, newPassword }),
};
