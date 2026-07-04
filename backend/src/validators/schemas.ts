import { z } from 'zod';

// ─── Auth Validators ───────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
  mfaCode: z.string().length(6).optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string().min(2, 'Full name is required').max(100).trim(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number')
    .optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const mfaVerifySchema = z.object({
  userId: z.string().uuid(),
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

export const mfaSetupSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// ─── User Validators ───────────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/).optional(),
  avatar: z.string().url().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().length(2).optional(),
});

// ─── Account Validators ────────────────────────────────────────────────────────

export const createAccountSchema = z.object({
  type: z.enum(['checking', 'savings']),
  name: z.string().min(1).max(100).trim(),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  isPrimary: z.boolean().default(false),
});

// ─── Transfer Validators ───────────────────────────────────────────────────────

export const internalTransferSchema = z.object({
  fromAccountId: z.string().uuid(),
  toAccountId: z.string().uuid(),
  amount: z.number().positive().max(1000000),
  currency: z.enum(['USD', 'EUR', 'GBP', 'BTC']).default('USD'),
  description: z.string().max(255).optional(),
});

export const externalTransferSchema = z.object({
  fromAccountId: z.string().uuid(),
  recipientName: z.string().min(1).max(100),
  recipientAccountNumber: z.string().min(6).max(20),
  recipientBankName: z.string().optional(),
  recipientRoutingNumber: z.string().optional(),
  amount: z.number().positive().max(1000000),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  description: z.string().max(255).optional(),
});

export const p2pTransferSchema = z.object({
  fromAccountId: z.string().uuid(),
  recipientEmail: z.string().email(),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'BTC']).default('USD'),
  description: z.string().max(255).optional(),
});

// ─── Notification Validators ───────────────────────────────────────────────────

export const markNotificationsReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1),
});

// ─── Admin Validators ──────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
  mfaCode: z.string().length(6).optional(),
});

export const adminUpdateUserSchema = z.object({
  accountStatus: z
    .enum(['active', 'suspended', 'frozen', 'closed', 'pending'])
    .optional(),
  kycStatus: z.enum(['verified', 'pending', 'rejected', 'not_submitted']).optional(),
  tier: z.enum(['basic', 'standard', 'premium']).optional(),
  dailyLimit: z.number().positive().optional(),
  weeklyLimit: z.number().positive().optional(),
  monthlyLimit: z.number().positive().optional(),
  reason: z.string().optional(),
});

export const adminAdjustBalanceSchema = z.object({
  userId: z.string().uuid(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'BTC']),
  amount: z.number(),
  reason: z.string().min(5, 'Reason is required (min 5 chars)'),
  type: z.enum(['credit', 'debit']),
});

export const kycReviewSchema = z.object({
  documentId: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

export const transactionFlagSchema = z.object({
  transactionId: z.string().uuid(),
  reason: z.string().min(5),
});

// ─── KYC Validators ────────────────────────────────────────────────────────────

export const kycUploadSchema = z.object({
  docType: z.enum(['id_card', 'passport', 'selfie', 'address_proof', 'drivers_license']),
});

// ─── Card Validators ───────────────────────────────────────────────────────────

export const updateCardStatusSchema = z.object({
  status: z.enum(['active', 'frozen', 'blocked']),
  reason: z.string().optional(),
});

// ─── Loan Validators ───────────────────────────────────────────────────────────

export const loanApplicationSchema = z.object({
  type: z.enum(['personal', 'home', 'auto', 'student', 'business']),
  amount: z.number().positive().max(1000000),
  termMonths: z.number().int().min(6).max(360),
  purpose: z.string().min(10).max(500),
  collateral: z.string().optional(),
});

// ─── Scheduled Transfer Validators ────────────────────────────────────────────

export const scheduledTransferSchema = z.object({
  fromAccountId: z.string().uuid(),
  toAccountNumber: z.string().min(6).max(20),
  toAccountName: z.string().min(1).max(100),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().max(255).optional(),
});

// ─── Bill Payment Validators ───────────────────────────────────────────────────

export const billPaymentSchema = z.object({
  billerName: z.string().min(1).max(100),
  billerCategory: z.string().min(1).max(50),
  accountNumber: z.string().min(1).max(50),
  amount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'GBP']).default('USD'),
  dueDate: z.string().optional(),
  fromAccountId: z.string().uuid(),
});

// ─── Query Validators ──────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const transactionQuerySchema = paginationSchema.extend({
  type: z
    .enum([
      'deposit',
      'withdrawal',
      'transfer',
      'investment',
      'topup',
      'debit',
      'credit',
      'loan_payment',
      'card_payment',
    ])
    .optional(),
  status: z.enum(['completed', 'pending', 'failed', 'held', 'flagged']).optional(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'BTC']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  search: z.string().optional(),
});

export const userQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  status: z.enum(['active', 'suspended', 'frozen', 'closed', 'pending']).optional(),
  kycStatus: z.enum(['verified', 'pending', 'rejected', 'not_submitted']).optional(),
  tier: z.enum(['basic', 'standard', 'premium']).optional(),
});
