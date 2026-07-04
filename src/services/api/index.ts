/**
 * OrbitPay API Service Layer
 * Production-ready API client for the OrbitPay Banking Platform
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types
export interface LoginRequest {
  email?: string;
  memberId?: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  accountType: 'personal' | 'business';
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  kycStatus: 'verified' | 'pending' | 'rejected' | 'not_submitted';
  accountStatus: 'active' | 'suspended' | 'frozen' | 'closed' | 'pending';
  balanceUSD: number;
  balanceEUR: number;
  balanceGBP: number;
  balanceBTC: number;
}

export interface Account {
  id: string;
  type: 'checking' | 'savings';
  name: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: string;
  status: string;
  isPrimary: boolean;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'topup';
  amount: number;
  currency: string;
  status: string;
  description: string;
  recipientName?: string;
  createdAt: string;
}

export interface TransferRequest {
  toAccountId?: string;
  toExternalAccount?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };
  amount: number;
  currency: string;
  description?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Token Management
let authToken: string | null = localStorage.getItem('orbitpay_token');
let refreshToken: string | null = localStorage.getItem('orbitpay_refresh_token');

export const setAuthTokens = (token: string, refresh: string) => {
  authToken = token;
  refreshToken = refresh;
  localStorage.setItem('orbitpay_token', token);
  localStorage.setItem('orbitpay_refresh_token', refresh);
};

export const clearAuthTokens = () => {
  authToken = null;
  refreshToken = null;
  localStorage.removeItem('orbitpay_token');
  localStorage.removeItem('orbitpay_refresh_token');
};

export const getAuthHeader = () => {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

// API Client
async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAuthToken();
        if (refreshed) {
          // Retry original request
          headers['Authorization'] = `Bearer ${authToken}`;
          const retryResponse = await fetch(url, { ...options, headers });
          const retryData = await retryResponse.json();
          return retryResponse.ok ? { success: true, data: retryData } : { success: false, error: retryData.message };
        }
        clearAuthTokens();
        window.location.href = '/';
      }
      return { success: false, error: data.message || 'Request failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

async function refreshAuthToken(): Promise<boolean> {
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthTokens(data.token, data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient<{ user: User; token: string; refreshToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    apiClient<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyMfa: (code: string) =>
    apiClient<{ user: User; token: string }>('/auth/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  logout: () =>
    apiClient('/auth/logout', { method: 'POST' }),

  forgotPassword: (email: string) =>
    apiClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// User API
export const userApi = {
  getProfile: () => apiClient<User>('/users/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${API_BASE_URL}/users/me/avatar`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });

    return response.json();
  },

  getKycStatus: () => apiClient('/users/me/kyc'),

  submitKyc: async (documents: { type: string; file: File }[]) => {
    const formData = new FormData();
    documents.forEach((doc, index) => {
      formData.append(`document_${index}`, doc.file);
      formData.append(`type_${index}`, doc.type);
    });

    const response = await fetch(`${API_BASE_URL}/users/me/kyc`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });

    return response.json();
  },
};

// Account API
export const accountApi = {
  getAccounts: () => apiClient<Account[]>('/accounts'),

  getAccount: (id: string) => apiClient<Account>(`/accounts/${id}`),

  createAccount: (data: { type: string; name: string; currency?: string }) =>
    apiClient<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  setPrimaryAccount: (id: string) =>
    apiClient(`/accounts/${id}/primary`, { method: 'PUT' }),
};

// Transaction API
export const transactionApi = {
  getTransactions: (params?: { accountId?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient<{ transactions: Transaction[]; total: number }>(`/transactions${query ? `?${query}` : ''}`);
  },

  getTransaction: (id: string) => apiClient<Transaction>(`/transactions/${id}`),

  getTransactionStats: (period?: 'day' | 'week' | 'month') =>
    apiClient<{ income: number; expenses: number; balance: number }>(`/transactions/stats${period ? `?period=${period}` : ''}`),
};

// Transfer API
export const transferApi = {
  internal: (data: TransferRequest) =>
    apiClient<{ transferId: string; status: string }>('/transfers/internal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  external: (data: TransferRequest) =>
    apiClient<{ transferId: string; status: string }>('/transfers/external', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  wire: (data: TransferRequest & { wireDetails: { intermediaryBank?: string; purpose?: string } }) =>
    apiClient<{ transferId: string; status: string }>('/transfers/wire', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  crypto: (data: { toAddress: string; amount: number; currency: 'BTC' | 'ETH' }) =>
    apiClient<{ transferId: string; status: string }>('/transfers/crypto', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getScheduled: () => apiClient('/transfers/scheduled'),

  cancelScheduled: (id: string) =>
    apiClient(`/transfers/scheduled/${id}`, { method: 'DELETE' }),
};

// Banking API (Cards, Loans, Bills)
export const bankingApi = {
  // Cards
  getCards: () => apiClient('/banking/cards'),

  createVirtualCard: (data: { name: string; currency: string; limit?: number }) =>
    apiClient('/banking/cards/virtual', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  freezeCard: (id: string) =>
    apiClient(`/banking/cards/${id}/freeze`, { method: 'PUT' }),

  unfreezeCard: (id: string) =>
    apiClient(`/banking/cards/${id}/unfreeze`, { method: 'PUT' }),

  // Loans
  getLoans: () => apiClient('/banking/loans'),

  applyForLoan: (data: { type: string; amount: number; termMonths: number; collateral?: string }) =>
    apiClient('/banking/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Bills
  getBills: () => apiClient('/banking/bills'),

  payBill: (id: string, amount?: number) =>
    apiClient(`/banking/bills/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),

  addPayee: (data: { name: string; accountNumber: string; category: string }) =>
    apiClient('/banking/bills/payees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Notifications API
export const notificationApi = {
  getNotifications: () => apiClient('/notifications'),

  markAsRead: (id: string) =>
    apiClient(`/notifications/${id}/read`, { method: 'PUT' }),

  markAllAsRead: () =>
    apiClient('/notifications/read-all', { method: 'PUT' }),
};

// Chat API
export const chatApi = {
  getChatRooms: () => apiClient('/banking/chat/rooms'),

  getMessages: (roomId: string) =>
    apiClient(`/banking/chat/rooms/${roomId}/messages`),

  sendMessage: (roomId: string, content: string) =>
    apiClient(`/banking/chat/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  createRoom: () =>
    apiClient<{ roomId: string }>('/banking/chat/rooms', { method: 'POST' }),
};

// AI Assistant API
export const aiApi = {
  chat: (message: string, context?: { type: string; id?: string }) =>
    apiClient<{ response: string; suggestions?: string[] }>('/banking/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    }),
};

// Currency API
export const currencyApi = {
  getRates: () => apiClient<{ USD: number; EUR: number; GBP: number; BTC: number }>('/banking/currency/rates'),

  convert: (from: string, to: string, amount: number) =>
    apiClient<{ result: number; rate: number }>(`/banking/currency/convert?from=${from}&to=${to}&amount=${amount}`),
};

export default {
  auth: authApi,
  user: userApi,
  account: accountApi,
  transaction: transactionApi,
  transfer: transferApi,
  banking: bankingApi,
  notification: notificationApi,
  chat: chatApi,
  ai: aiApi,
  currency: currencyApi,
};
