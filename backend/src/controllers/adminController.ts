import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import {
  hashPassword,
  verifyPassword,
  sanitizeAdmin,
  sanitizeUser,
  now,
} from '../utils/helpers';
import {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyAdminToken,
  getRefreshTokenExpiryDate,
} from '../utils/jwt';
import { auditLog, logger } from '../utils/logger';

// ─── Admin Login ───────────────────────────────────────────────────────────────

export async function adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      res.status(401).json({ success: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
      return;
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      auditLog({ action: 'ADMIN_LOGIN_FAILED', adminId: admin.id, ipAddress: req.ip });
      res.status(401).json({ success: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
      return;
    }

    const timestamp = now();
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: timestamp, isOnline: true, updatedAt: timestamp },
    });

    const accessToken = generateAdminAccessToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });
    const refreshToken = generateAdminRefreshToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await prisma.adminRefreshToken.create({
      data: {
        token: refreshToken,
        adminUserId: admin.id,
        expiresAt: getRefreshTokenExpiryDate().toISOString(),
        createdAt: timestamp,
      },
    });

    auditLog({
      action: 'ADMIN_LOGIN',
      adminId: admin.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'success',
    });

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: sanitizeAdmin(admin as unknown as Record<string, unknown>),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Admin Logout ──────────────────────────────────────────────────────────────

export async function adminLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const adminId = req.admin?.adminId;

    if (refreshToken) {
      await prisma.adminRefreshToken.deleteMany({ where: { token: refreshToken } });
    }

    if (adminId) {
      await prisma.adminUser.update({
        where: { id: adminId },
        data: { isOnline: false, updatedAt: now() },
      });
      auditLog({ action: 'ADMIN_LOGOUT', adminId, ipAddress: req.ip });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

// ─── Admin Refresh Token ───────────────────────────────────────────────────────

export async function adminRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { refreshToken: token } = req.body;

    let payload;
    try {
      payload = verifyAdminToken(token);
    } catch {
      res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
      return;
    }

    const stored = await prisma.adminRefreshToken.findUnique({ where: { token } });
    if (!stored || new Date(stored.expiresAt) < new Date()) {
      res.status(401).json({ success: false, error: 'Refresh token not found or expired' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({ where: { id: payload.adminId } });
    if (!admin) {
      res.status(401).json({ success: false, error: 'Admin not found' });
      return;
    }

    const timestamp = now();
    await prisma.adminRefreshToken.delete({ where: { token } });

    const newAccessToken = generateAdminAccessToken({ adminId: admin.id, email: admin.email, role: admin.role });
    const newRefreshToken = generateAdminRefreshToken({ adminId: admin.id, email: admin.email, role: admin.role });

    await prisma.adminRefreshToken.create({
      data: {
        token: newRefreshToken,
        adminUserId: admin.id,
        expiresAt: getRefreshTokenExpiryDate().toISOString(),
        createdAt: timestamp,
      },
    });

    res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (error) {
    next(error);
  }
}

// ─── Dashboard Statistics ──────────────────────────────────────────────────────

export async function getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    const [
      totalUsers,
      activeUsers,
      pendingKyc,
      totalAccounts,
      totalTransactionsToday,
      totalTransactionsMonth,
      pendingTransactions,
      flaggedTransactions,
      totalVolume,
      recentTransactions,
      recentUsers,
      kycBreakdown,
      userStatusBreakdown,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { accountStatus: 'active' } }),
      prisma.user.count({ where: { kycStatus: 'pending' } }),
      prisma.bankAccount.count({ where: { status: 'active' } }),
      prisma.transaction.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.transaction.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.transaction.count({ where: { status: 'pending' } }),
      prisma.transaction.count({ where: { status: 'flagged' } }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'completed', createdAt: { gte: startOfMonth } },
      }),
      prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { fullName: true, avatar: true } } },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, fullName: true, email: true, kycStatus: true, accountStatus: true, createdAt: true, avatar: true },
      }),
      prisma.user.groupBy({
        by: ['kycStatus'],
        _count: true,
      }),
      prisma.user.groupBy({
        by: ['accountStatus'],
        _count: true,
      }),
    ]);

    // Total balances across all users
    const balanceSums = await prisma.user.aggregate({
      _sum: { balanceUsd: true, balanceEur: true, balanceGbp: true, balanceBtc: true },
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          pendingKyc,
          totalAccounts,
          totalTransactionsToday,
          totalTransactionsMonth,
          pendingTransactions,
          flaggedTransactions,
          totalVolumeThisMonth: Math.abs(totalVolume._sum.amount || 0),
          totalAssetsUsd: balanceSums._sum.balanceUsd || 0,
          totalAssetsEur: balanceSums._sum.balanceEur || 0,
          totalAssetsGbp: balanceSums._sum.balanceGbp || 0,
          totalAssetsBtc: balanceSums._sum.balanceBtc || 0,
        },
        recentTransactions,
        recentUsers,
        kycBreakdown: kycBreakdown.reduce((acc: Record<string, number>, item) => {
          acc[item.kycStatus] = item._count;
          return acc;
        }, {}),
        userStatusBreakdown: userStatusBreakdown.reduce((acc: Record<string, number>, item) => {
          acc[item.accountStatus] = item._count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── List All Users ────────────────────────────────────────────────────────────

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = 1, limit = 20, search, status, kycStatus, tier } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      ...(status && { accountStatus: status }),
      ...(kycStatus && { kycStatus }),
      ...(tier && { tier }),
      ...(search && {
        OR: [
          { fullName: { contains: search as string } },
          { email: { contains: search as string } },
          { phone: { contains: search as string } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          avatar: true,
          kycStatus: true,
          accountStatus: true,
          tier: true,
          balanceUsd: true,
          balanceEur: true,
          balanceGbp: true,
          balanceBtc: true,
          isOnline: true,
          lastActive: true,
          createdAt: true,
          updatedAt: true,
          dailyLimit: true,
          weeklyLimit: true,
          monthlyLimit: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get User Detail (admin) ───────────────────────────────────────────────────

export async function adminGetUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        transactions: { orderBy: { createdAt: 'desc' }, take: 30 },
        kycDocuments: true,
        cards: true,
        loans: true,
        notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: sanitizeUser(user as unknown as Record<string, unknown>) });
  } catch (error) {
    next(error);
  }
}

// ─── Update User (admin) ───────────────────────────────────────────────────────

export async function adminUpdateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const adminId = req.admin!.adminId;
    const { accountStatus, kycStatus, tier, dailyLimit, weeklyLimit, monthlyLimit, reason } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const timestamp = now();
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(accountStatus && { accountStatus }),
        ...(kycStatus && { kycStatus }),
        ...(tier && { tier }),
        ...(dailyLimit && { dailyLimit }),
        ...(weeklyLimit && { weeklyLimit }),
        ...(monthlyLimit && { monthlyLimit }),
        updatedAt: timestamp,
      },
    });

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId }, select: { fullName: true } });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminId,
        adminName: admin?.fullName || 'Admin',
        actionType: 'update_user',
        targetUserId: id,
        targetUserName: user.fullName,
        reason,
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'],
        createdAt: timestamp,
      },
    });

    auditLog({ action: 'ADMIN_UPDATE_USER', adminId, ipAddress: req.ip, metadata: { userId: id, changes: req.body } });

    // Notify user if status changed
    if (accountStatus && accountStatus !== user.accountStatus) {
      await prisma.notification.create({
        data: {
          userId: id,
          title: 'Account Status Updated',
          message: `Your account status has been updated to ${accountStatus}${reason ? `: ${reason}` : ''}`,
          type: 'system',
          read: false,
          createdAt: timestamp,
        },
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: sanitizeUser(updated as unknown as Record<string, unknown>),
    });
  } catch (error) {
    next(error);
  }
}

// ─── Adjust Balance ────────────────────────────────────────────────────────────

export async function adjustBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.admin!.adminId;
    const { userId, currency, amount, reason, type } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const fieldMap: Record<string, string> = {
      USD: 'balanceUsd',
      EUR: 'balanceEur',
      GBP: 'balanceGbp',
      BTC: 'balanceBtc',
    };

    const field = fieldMap[currency];
    if (!field) {
      res.status(400).json({ success: false, error: 'Invalid currency' });
      return;
    }

    const currentBalance = (user as Record<string, number>)[field];
    if (type === 'debit' && currentBalance < amount) {
      res.status(400).json({ success: false, error: 'Insufficient funds to debit' });
      return;
    }

    const timestamp = now();
    const delta = type === 'credit' ? amount : -amount;

    const [updated] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { [field]: { increment: delta }, updatedAt: timestamp },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: type === 'credit' ? 'credit' : 'debit',
          amount: delta,
          currency,
          status: 'completed',
          description: `Admin ${type}: ${reason}`,
          adminId,
          adminAction: `admin_${type}`,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      }),
      prisma.adminAction.create({
        data: {
          adminId,
          adminName: (await prisma.adminUser.findUnique({ where: { id: adminId }, select: { fullName: true } }))?.fullName || 'Admin',
          actionType: type === 'credit' ? 'add_funds' : 'deduct_funds',
          targetUserId: userId,
          targetUserName: user.fullName,
          amount,
          reason,
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'],
          createdAt: timestamp,
        },
      }),
      prisma.notification.create({
        data: {
          userId,
          title: type === 'credit' ? 'Funds Added' : 'Funds Deducted',
          message: `${type === 'credit' ? '+' : '-'}${amount} ${currency} ${type === 'credit' ? 'added to' : 'deducted from'} your account. Reason: ${reason}`,
          type: 'transaction',
          read: false,
          createdAt: timestamp,
        },
      }),
    ]);

    auditLog({
      action: `ADMIN_BALANCE_${type.toUpperCase()}`,
      adminId,
      ipAddress: req.ip,
      metadata: { userId, currency, amount, reason },
    });

    res.json({
      success: true,
      message: `Balance ${type} of ${amount} ${currency} applied successfully`,
      data: sanitizeUser(updated as unknown as Record<string, unknown>),
    });
  } catch (error) {
    next(error);
  }
}

// ─── KYC Review ────────────────────────────────────────────────────────────────

export async function reviewKyc(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.admin!.adminId;
    const { documentId, status, rejectionReason } = req.body;

    const doc = await prisma.kycDocument.findUnique({
      where: { id: documentId },
      include: { user: { select: { id: true, fullName: true, kycStatus: true } } },
    });

    if (!doc) {
      res.status(404).json({ success: false, error: 'KYC document not found' });
      return;
    }

    const timestamp = now();

    await prisma.kycDocument.update({
      where: { id: documentId },
      data: {
        status,
        reviewedBy: adminId,
        reviewedAt: timestamp,
        ...(rejectionReason && { rejectionReason }),
        updatedAt: timestamp,
      },
    });

    // Check all documents for this user
    const allDocs = await prisma.kycDocument.findMany({ where: { userId: doc.userId } });
    const allApproved = allDocs.every((d) => d.status === 'approved');
    const anyRejected = allDocs.some((d) => d.status === 'rejected');

    let newKycStatus = doc.user.kycStatus;
    if (status === 'approved' && allApproved) {
      newKycStatus = 'verified';
    } else if (status === 'rejected') {
      newKycStatus = 'rejected';
    }

    if (newKycStatus !== doc.user.kycStatus) {
      await prisma.user.update({
        where: { id: doc.userId },
        data: { kycStatus: newKycStatus, updatedAt: timestamp },
      });
    }

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId }, select: { fullName: true } });

    await Promise.all([
      prisma.adminAction.create({
        data: {
          adminId,
          adminName: admin?.fullName || 'Admin',
          actionType: status === 'approved' ? 'approve_kyc' : 'reject_kyc',
          targetUserId: doc.userId,
          targetUserName: doc.user.fullName,
          reason: rejectionReason,
          ipAddress: req.ip || 'unknown',
          createdAt: timestamp,
        },
      }),
      prisma.notification.create({
        data: {
          userId: doc.userId,
          title: `KYC Document ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          message:
            status === 'approved'
              ? `Your ${doc.docType.replace('_', ' ')} has been approved!`
              : `Your ${doc.docType.replace('_', ' ')} was rejected. ${rejectionReason || ''}`,
          type: 'kyc',
          read: false,
          createdAt: timestamp,
        },
      }),
    ]);

    void anyRejected;
    auditLog({ action: `KYC_${status.toUpperCase()}`, adminId, ipAddress: req.ip, metadata: { documentId, userId: doc.userId } });

    res.json({
      success: true,
      message: `KYC document ${status}`,
      data: { documentId, status, userKycStatus: newKycStatus },
    });
  } catch (error) {
    next(error);
  }
}

// ─── List All Transactions (admin) ─────────────────────────────────────────────

export async function listAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = 1, limit = 20, type, status, userId, search, startDate, endDate } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      ...(type && { type }),
      ...(status && { status }),
      ...(userId && { userId }),
      ...(startDate || endDate ? { createdAt: { ...(startDate && { gte: startDate }), ...(endDate && { lte: endDate }) } } : {}),
      ...(search && {
        OR: [
          { description: { contains: search } },
          { recipientName: { contains: search } },
          { referenceId: { contains: search } },
        ],
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { user: { select: { fullName: true, email: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Flag / Resolve Transaction ────────────────────────────────────────────────

export async function flagTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.admin!.adminId;
    const { transactionId, reason } = req.body;

    const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!tx) {
      res.status(404).json({ success: false, error: 'Transaction not found' });
      return;
    }

    const timestamp = now();

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'flagged', updatedAt: timestamp },
    });

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId }, select: { fullName: true } });

    await prisma.adminAction.create({
      data: {
        adminId,
        adminName: admin?.fullName || 'Admin',
        actionType: 'flag_transaction',
        targetUserId: tx.userId,
        amount: Math.abs(tx.amount),
        reason,
        ipAddress: req.ip || 'unknown',
        createdAt: timestamp,
      },
    });

    auditLog({ action: 'TRANSACTION_FLAGGED', adminId, ipAddress: req.ip, metadata: { transactionId, reason } });

    res.json({ success: true, message: 'Transaction flagged', data: { transactionId, status: 'flagged' } });
  } catch (error) {
    next(error);
  }
}

// ─── Get Audit Logs ────────────────────────────────────────────────────────────

export async function getAdminActions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = 1, limit = 50, adminId, actionType } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {
      ...(adminId && { adminId }),
      ...(actionType && { actionType }),
    };

    const [actions, total] = await Promise.all([
      prisma.adminAction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.adminAction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        actions,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Pending KYC Documents ─────────────────────────────────────────────────────

export async function getPendingKyc(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [documents, total] = await Promise.all([
      prisma.kycDocument.findMany({
        where: { status: 'pending' },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, avatar: true, kycStatus: true },
          },
        },
        orderBy: { uploadedAt: 'asc' },
        skip,
        take: Number(limit),
      }),
      prisma.kycDocument.count({ where: { status: 'pending' } }),
    ]);

    res.json({
      success: true,
      data: {
        documents,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get All Admin Users ───────────────────────────────────────────────────────

export async function listAdminUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        permissions: true,
        isOnline: true,
        lastLogin: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
}

// ─── Get Chat Rooms ────────────────────────────────────────────────────────────

export async function getChatRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { ...(status && { status }) };

    const [rooms, total] = await Promise.all([
      prisma.chatRoom.findMany({
        where,
        include: {
          messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.chatRoom.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        rooms,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get Chat Messages ─────────────────────────────────────────────────────────

export async function getChatMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roomId } = req.params;

    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ success: false, error: 'Chat room not found' });
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, data: { room, messages } });
  } catch (error) {
    next(error);
  }
}

// ─── Send Admin Chat Message ───────────────────────────────────────────────────

export async function sendAdminMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.admin!.adminId;
    const { roomId } = req.params;
    const { content } = req.body;

    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      res.status(404).json({ success: false, error: 'Chat room not found' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
    const timestamp = now();

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: adminId,
        senderType: 'admin',
        senderName: admin?.fullName || 'Support Team',
        content,
        createdAt: timestamp,
      },
    });

    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessage: content, lastMessageAt: timestamp, adminId, updatedAt: timestamp },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: room.userId,
        title: 'Support Reply',
        message: 'Support team has replied to your inquiry',
        type: 'chat',
        read: false,
        createdAt: timestamp,
      },
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

// ─── Currency Rates ────────────────────────────────────────────────────────────

export async function getCurrencyRates(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rates = await prisma.currencyRate.findMany();
    res.json({ success: true, data: rates });
  } catch (error) {
    next(error);
  }
}

export async function updateCurrencyRate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const adminId = req.admin!.adminId;
    const { code, rate, change } = req.body;

    const updated = await prisma.currencyRate.upsert({
      where: { code },
      update: { rate, change, updatedAt: now() },
      create: { code, name: code, symbol: code, rate, change, updatedAt: now() },
    });

    auditLog({ action: 'CURRENCY_RATE_UPDATED', adminId, ipAddress: req.ip, metadata: { code, rate } });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
}
