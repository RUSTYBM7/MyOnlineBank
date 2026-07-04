import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyAdminToken } from '../utils/jwt';
import { prisma } from '../utils/database';
import { logger } from '../utils/logger';

// Extend Request type with user context
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
      admin?: {
        adminId: string;
        email: string;
        role: string;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'NO_TOKEN',
      });
      return;
    }

    const token = authHeader.substring(7);

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
        });
        return;
      }
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
      return;
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, accountStatus: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
      return;
    }

    if (user.accountStatus === 'closed') {
      res.status(403).json({
        success: false,
        error: 'Account has been closed',
        code: 'ACCOUNT_CLOSED',
      });
      return;
    }

    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export async function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Admin authentication required',
        code: 'NO_TOKEN',
      });
      return;
    }

    const token = authHeader.substring(7);

    let payload;
    try {
      payload = verifyAdminToken(token);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: 'Admin token expired',
          code: 'TOKEN_EXPIRED',
        });
        return;
      }
      res.status(401).json({
        success: false,
        error: 'Invalid admin token',
        code: 'INVALID_TOKEN',
      });
      return;
    }

    // Verify admin still exists
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.adminId },
      select: { id: true, email: true, role: true, permissions: true },
    });

    if (!admin) {
      res.status(401).json({
        success: false,
        error: 'Admin not found',
        code: 'ADMIN_NOT_FOUND',
      });
      return;
    }

    req.admin = { adminId: payload.adminId, email: payload.email, role: payload.role };
    next();
  } catch (error) {
    logger.error('Admin auth middleware error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    if (!roles.includes(req.admin.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
      });
      return;
    }
    next();
  };
}

export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.admin) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    if (req.admin.role === 'super_admin') {
      next();
      return;
    }
    const admin = await prisma.adminUser.findUnique({
      where: { id: req.admin.adminId },
      select: { permissions: true },
    });
    const perms: string[] = JSON.parse(admin?.permissions || '[]');
    if (!perms.includes(permission) && !perms.includes('all')) {
      res.status(403).json({
        success: false,
        error: `Permission '${permission}' required`,
        code: 'FORBIDDEN',
      });
      return;
    }
    next();
  };
}
