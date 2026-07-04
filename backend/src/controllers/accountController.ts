import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { generateAccountNumber, now } from '../utils/helpers';

// ─── List Accounts ─────────────────────────────────────────────────────────────

export async function getAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;

    const accounts = await prisma.bankAccount.findMany({
      where: { userId, status: { not: 'closed' } },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });

    res.json({ success: true, data: accounts });
  } catch (error) {
    next(error);
  }
}

// ─── Get Single Account ────────────────────────────────────────────────────────

export async function getAccountById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const account = await prisma.bankAccount.findFirst({
      where: { id, userId },
    });

    if (!account) {
      res.status(404).json({ success: false, error: 'Account not found' });
      return;
    }

    res.json({ success: true, data: account });
  } catch (error) {
    next(error);
  }
}

// ─── Create Account ────────────────────────────────────────────────────────────

export async function createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { type, name, currency, isPrimary } = req.body;

    // Check user KYC
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true, accountStatus: true },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    if (user.accountStatus !== 'active') {
      res.status(403).json({
        success: false,
        error: 'Account creation not allowed for your current account status',
      });
      return;
    }

    const timestamp = now();

    // If isPrimary, unset existing primary
    if (isPrimary) {
      await prisma.bankAccount.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const account = await prisma.bankAccount.create({
      data: {
        userId,
        type,
        name,
        accountNumber: generateAccountNumber(),
        routingNumber: '021000021',
        balance: 0,
        currency: currency || 'USD',
        status: 'active',
        interestRate: type === 'savings' ? 4.5 : 0.5,
        isPrimary: isPrimary || false,
        color: type === 'savings' ? 'purple' : 'mint',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: account,
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get Transactions for Account ─────────────────────────────────────────────

export async function getAccountTransactions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;

    // Verify account belongs to user
    const account = await prisma.bankAccount.findFirst({ where: { id, userId } });
    if (!account) {
      res.status(404).json({ success: false, error: 'Account not found' });
      return;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {
      accountId: id,
      userId,
      ...(type && { type }),
      ...(status && { status }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate as string }),
              ...(endDate && { lte: endDate as string }),
            },
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        account,
        transactions,
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

// ─── Get All User Transactions ─────────────────────────────────────────────────

export async function getUserTransactions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const {
      page = 1,
      limit = 20,
      type,
      status,
      currency,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {
      userId,
      ...(type && { type }),
      ...(status && { status }),
      ...(currency && { currency }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
      ...(minAmount || maxAmount
        ? {
            amount: {
              ...(minAmount && { gte: Number(minAmount) }),
              ...(maxAmount && { lte: Number(maxAmount) }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { description: { contains: search as string } },
          { recipientName: { contains: search as string } },
        ],
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
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

// ─── Get Single Transaction ────────────────────────────────────────────────────

export async function getTransactionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      res.status(404).json({ success: false, error: 'Transaction not found' });
      return;
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
}
