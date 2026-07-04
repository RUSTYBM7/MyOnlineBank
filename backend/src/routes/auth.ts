import { Router } from 'express';
import {
  register,
  login,
  mfaVerify,
  refreshToken,
  logout,
  setupMfa,
  enableMfa,
  disableMfa,
  changePassword,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authRateLimiter, sensitiveRateLimiter } from '../middleware/rateLimiter';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  mfaVerifySchema,
  mfaSetupSchema,
  changePasswordSchema,
} from '../validators/schemas';

const router = Router();

// Public routes
router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/mfa/verify', authRateLimiter, validate(mfaVerifySchema), mfaVerify);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.post('/mfa/setup', authMiddleware, setupMfa);
router.post('/mfa/enable', authMiddleware, validate(mfaSetupSchema), enableMfa);
router.post('/mfa/disable', authMiddleware, sensitiveRateLimiter, disableMfa);
router.post('/change-password', authMiddleware, sensitiveRateLimiter, validate(changePasswordSchema), changePassword);

export default router;
