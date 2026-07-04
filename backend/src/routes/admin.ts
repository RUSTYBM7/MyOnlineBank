import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  adminRefreshToken,
  getDashboardStats,
  listUsers,
  adminGetUser,
  adminUpdateUser,
  adjustBalance,
  reviewKyc,
  listAllTransactions,
  flagTransaction,
  getAdminActions,
  getPendingKyc,
  listAdminUsers,
  getChatRooms,
  getChatMessages,
  sendAdminMessage,
  getCurrencyRates,
  updateCurrencyRate,
} from '../controllers/adminController';
import { adminAuthMiddleware, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authRateLimiter, adminRateLimiter } from '../middleware/rateLimiter';
import {
  adminLoginSchema,
  adminUpdateUserSchema,
  adminAdjustBalanceSchema,
  kycReviewSchema,
  transactionFlagSchema,
  refreshTokenSchema,
} from '../validators/schemas';

const router = Router();

// Public admin auth
router.post('/auth/login', authRateLimiter, validate(adminLoginSchema), adminLogin);
router.post('/auth/refresh', validate(refreshTokenSchema), adminRefreshToken);

// All subsequent routes require admin auth
router.use(adminAuthMiddleware);
router.use(adminRateLimiter);

// Auth
router.post('/auth/logout', adminLogout);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', listUsers);
router.get('/users/:id', adminGetUser);
router.put('/users/:id', validate(adminUpdateUserSchema), adminUpdateUser);

// Balance Adjustment (finance_admin or super_admin)
router.post(
  '/users/balance/adjust',
  requireRole('super_admin', 'finance_admin'),
  validate(adminAdjustBalanceSchema),
  adjustBalance
);

// KYC
router.get('/kyc/pending', getPendingKyc);
router.post('/kyc/review', validate(kycReviewSchema), reviewKyc);

// Transactions
router.get('/transactions', listAllTransactions);
router.post('/transactions/flag', validate(transactionFlagSchema), flagTransaction);

// Audit Logs
router.get('/audit-logs', requireRole('super_admin', 'finance_admin'), getAdminActions);

// Admin Users (super_admin only)
router.get('/admins', requireRole('super_admin'), listAdminUsers);

// Chat
router.get('/chat/rooms', getChatRooms);
router.get('/chat/rooms/:roomId/messages', getChatMessages);
router.post('/chat/rooms/:roomId/messages', sendAdminMessage);

// Currency Rates
router.get('/currency-rates', getCurrencyRates);
router.put('/currency-rates', requireRole('super_admin', 'finance_admin'), updateCurrencyRate);

export default router;
