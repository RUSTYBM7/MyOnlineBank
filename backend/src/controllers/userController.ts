import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { sanitizeUser, now } from '../utils/helpers';
import { auditLog } from '../utils/logger';

// ─── Get Current User ──────────────────────────────────────────────────────────

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: { status: { not: 'closed' } },
          orderBy: { isPrimary: 'desc' },
        },
        cards: { where: { status: { not: 'blocked' } } },
        loans: { where: { status: { not: 'rejected' } } },
        kycDocuments: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: now(), isOnline: true },
    });

    res.json({
      success: true,
      data: sanitizeUser(user as unknown as Record<string, unknown>),
    });
  } catch (error) {
    next(error);
  }
}

// ─── Update Profile ────────────────────────────────────────────────────────────

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { fullName, phone, avatar, dateOfBirth, address, city, state, zipCode, country } =
      req.body;

    if (phone) {
      const existing = await prisma.user.findFirst({
        where: { phone, id: { not: userId } },
      });
      if (existing) {
        res.status(409).json({ success: false, error: 'Phone number already in use' });
        return;
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(country && { country }),
        updatedAt: now(),
      },
    });

    auditLog({ action: 'USER_PROFILE_UPDATED', userId, ipAddress: req.ip });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizeUser(updated as unknown as Record<string, unknown>),
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get User by ID (Admin use + self) ────────────────────────────────────────

export async function getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const requestingUserId = req.user?.userId || req.admin?.adminId;
    const isAdmin = !!req.admin;

    // Regular users can only view themselves
    if (!isAdmin && id !== req.user?.userId) {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        kycDocuments: true,
        cards: true,
        loans: true,
        notifications: {
          where: { read: false },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    void requestingUserId;
    res.json({
      success: true,
      data: sanitizeUser(user as unknown as Record<string, unknown>),
    });
  } catch (error) {
    next(error);
  }
}

// ─── KYC Submission ────────────────────────────────────────────────────────────

export async function submitKyc(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { docType } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, error: 'Document file is required' });
      return;
    }

    const timestamp = now();
    const filePath = `/uploads/${file.filename}`;

    await prisma.kycDocument.create({
      data: {
        userId,
        docType,
        url: filePath,
        filePath,
        status: 'pending',
        uploadedAt: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    // Update KYC status to pending if it was not_submitted
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.kycStatus === 'not_submitted') {
      await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: 'pending', updatedAt: timestamp },
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'KYC Document Submitted',
        message: `Your ${docType.replace('_', ' ')} has been submitted for review`,
        type: 'kyc',
        read: false,
        createdAt: timestamp,
      },
    });

    auditLog({ action: 'KYC_DOCUMENT_SUBMITTED', userId, ipAddress: req.ip, metadata: { docType } });

    res.status(201).json({
      success: true,
      message: 'KYC document submitted successfully',
      data: { docType, filePath, status: 'pending' },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get KYC Status ────────────────────────────────────────────────────────────

export async function getKycStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });

    const documents = await prisma.kycDocument.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({
      success: true,
      data: {
        kycStatus: user?.kycStatus,
        documents,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get Notifications ─────────────────────────────────────────────────────────

export async function getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      userId,
      ...(unreadOnly === 'true' && { read: false }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { notificationIds } = req.body;

    await prisma.notification.updateMany({
      where: { id: { in: notificationIds }, userId },
      data: { read: true, readAt: now() },
    });

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
}

export async function markAllNotificationsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: now() },
    });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
}
