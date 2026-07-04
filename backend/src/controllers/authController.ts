import { Request, Response, NextFunction } from 'express';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { prisma } from '../utils/database';
import {
  hashPassword,
  verifyPassword,
  sanitizeUser,
  generateAccountNumber,
  now,
} from '../utils/helpers';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
} from '../utils/jwt';
import { auditLog } from '../utils/logger';

// ─── Register ──────────────────────────────────────────────────────────────────

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, fullName, phone, dateOfBirth, address } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'An account with this email already exists',
        code: 'EMAIL_TAKEN',
      });
      return;
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) {
        res.status(409).json({
          success: false,
          error: 'Phone number is already registered',
          code: 'PHONE_TAKEN',
        });
        return;
      }
    }

    const passwordHash = await hashPassword(password);
    const timestamp = now();

    // Create user with default checking account
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          phone: phone || null,
          dateOfBirth: dateOfBirth || null,
          address: address || null,
          kycStatus: 'not_submitted',
          accountStatus: 'active',
          tier: 'basic',
          balanceUsd: 0,
          balanceEur: 0,
          balanceGbp: 0,
          balanceBtc: 0,
          dailyLimit: 5000,
          weeklyLimit: 20000,
          monthlyLimit: 50000,
          createdAt: timestamp,
          updatedAt: timestamp,
          lastActive: timestamp,
        },
      });

      // Create a default checking account
      await tx.bankAccount.create({
        data: {
          userId: newUser.id,
          type: 'checking',
          name: 'Primary Checking',
          accountNumber: generateAccountNumber(),
          routingNumber: '021000021',
          balance: 0,
          currency: 'USD',
          status: 'active',
          interestRate: 0.5,
          isPrimary: true,
          color: 'mint',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          title: 'Welcome to OrbitPay!',
          message: `Welcome ${fullName}! Your account has been created. Complete your KYC verification to unlock all features.`,
          type: 'system',
          read: false,
          createdAt: timestamp,
        },
      });

      return newUser;
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiryDate().toISOString(),
        createdAt: timestamp,
      },
    });

    auditLog({
      action: 'USER_REGISTERED',
      userId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: sanitizeUser(user as unknown as Record<string, unknown>),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Login ─────────────────────────────────────────────────────────────────────

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, mfaCode } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
      return;
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remaining = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
      );
      res.status(423).json({
        success: false,
        error: `Account temporarily locked. Try again in ${remaining} minutes`,
        code: 'ACCOUNT_LOCKED',
      });
      return;
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if (!passwordValid) {
      // Increment failed attempts
      const failedAttempts = user.failedLoginAttempts + 1;
      const lockData =
        failedAttempts >= 5
          ? { lockedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString() }
          : {};

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: failedAttempts, ...lockData },
      });

      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
        attemptsRemaining: Math.max(0, 5 - failedAttempts),
      });
      return;
    }

    // MFA check
    if (user.mfaEnabled && user.mfaSecret) {
      if (!mfaCode) {
        res.status(200).json({
          success: true,
          mfaRequired: true,
          userId: user.id,
          message: 'MFA code required',
        });
        return;
      }

      const mfaValid = authenticator.verify({
        token: mfaCode,
        secret: user.mfaSecret,
      });

      if (!mfaValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid MFA code',
          code: 'INVALID_MFA',
        });
        return;
      }
    }

    // Check account status
    if (user.accountStatus === 'closed') {
      res.status(403).json({
        success: false,
        error: 'This account has been closed',
        code: 'ACCOUNT_CLOSED',
      });
      return;
    }

    // Reset failed attempts on successful login
    const timestamp = now();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastActive: timestamp,
        isOnline: true,
        updatedAt: timestamp,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiryDate().toISOString(),
        createdAt: timestamp,
      },
    });

    auditLog({
      action: 'USER_LOGIN',
      userId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user as unknown as Record<string, unknown>),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── MFA Verify (standalone step) ─────────────────────────────────────────────

export async function mfaVerify(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId, code } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) {
      res.status(404).json({ success: false, error: 'User not found or MFA not configured' });
      return;
    }

    const valid = authenticator.verify({ token: code, secret: user.mfaSecret });
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid MFA code', code: 'INVALID_MFA' });
      return;
    }

    const timestamp = now();
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: timestamp, isOnline: true, updatedAt: timestamp },
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiryDate().toISOString(),
        createdAt: timestamp,
      },
    });

    res.json({
      success: true,
      message: 'MFA verified',
      data: {
        user: sanitizeUser(user as unknown as Record<string, unknown>),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Refresh Token ─────────────────────────────────────────────────────────────

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
      return;
    }

    // Verify token exists in DB (token rotation)
    const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      res.status(401).json({ success: false, error: 'Refresh token not found or expired' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    // Rotate refresh token
    const timestamp = now();
    await prisma.refreshToken.delete({ where: { token } });

    const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiryDate().toISOString(),
        createdAt: timestamp,
      },
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Logout ────────────────────────────────────────────────────────────────────

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: token } = req.body;
    const userId = req.user?.userId;

    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline: false, updatedAt: now() },
      });

      auditLog({
        action: 'USER_LOGOUT',
        userId,
        ipAddress: req.ip,
      });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

// ─── MFA Setup ─────────────────────────────────────────────────────────────────

export async function setupMfa(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, process.env.MFA_ISSUER || 'OrbitPay', secret);
    const qrCode = await QRCode.toDataURL(otpauth);

    // Store secret temporarily (not yet enabled until verified)
    await prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret, updatedAt: now() },
    });

    res.json({
      success: true,
      data: { secret, qrCode, otpauth },
    });
  } catch (error) {
    next(error);
  }
}

export async function enableMfa(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { code } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.mfaSecret) {
      res.status(400).json({ success: false, error: 'MFA not set up. Call /setup first.' });
      return;
    }

    const valid = authenticator.verify({ token: code, secret: user.mfaSecret });
    if (!valid) {
      res.status(400).json({ success: false, error: 'Invalid MFA code', code: 'INVALID_MFA' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true, updatedAt: now() },
    });

    auditLog({
      action: 'MFA_ENABLED',
      userId,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'MFA enabled successfully' });
  } catch (error) {
    next(error);
  }
}

export async function disableMfa(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Invalid password' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: false, mfaSecret: null, updatedAt: now() },
    });

    res.json({ success: true, message: 'MFA disabled successfully' });
  } catch (error) {
    next(error);
  }
}

// ─── Change Password ───────────────────────────────────────────────────────────

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Current password is incorrect' });
      return;
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash, updatedAt: now() },
    });

    // Invalidate all refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId } });

    auditLog({
      action: 'PASSWORD_CHANGED',
      userId,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Password changed successfully. Please log in again.' });
  } catch (error) {
    next(error);
  }
}
