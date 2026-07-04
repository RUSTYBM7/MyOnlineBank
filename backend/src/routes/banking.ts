import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { generateCardNumber, generateCVV, now } from '../utils/helpers';
import { authMiddleware } from '../middleware/auth';
import { auditLog } from '../utils/logger';

// ─── Controller functions ──────────────────────────────────────────────────────

async function getCards(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const cards = await prisma.card.findMany({
      where: { userId, status: { not: 'blocked' } },
      orderBy: { createdAt: 'asc' },
    });
    // Mask sensitive data
    const safeCards = cards.map((c) => ({ ...c, cardNumber: undefined, cvv: undefined }));
    res.json({ success: true, data: safeCards });
  } catch (error) {
    next(error);
  }
}

async function getCardById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const card = await prisma.card.findFirst({ where: { id, userId } });
    if (!card) {
      res.status(404).json({ success: false, error: 'Card not found' });
      return;
    }
    const { cardNumber: _cn, cvv: _cvv, ...safe } = card;
    void _cn; void _cvv;
    res.json({ success: true, data: safe });
  } catch (error) {
    next(error);
  }
}

async function updateCardStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { status } = req.body;

    const card = await prisma.card.findFirst({ where: { id, userId } });
    if (!card) {
      res.status(404).json({ success: false, error: 'Card not found' });
      return;
    }

    const updated = await prisma.card.update({
      where: { id },
      data: { status, updatedAt: now() },
    });

    auditLog({ action: 'CARD_STATUS_UPDATED', userId, ipAddress: req.ip, metadata: { cardId: id, status } });

    const { cardNumber: _cn, cvv: _cvv, ...safe } = updated;
    void _cn; void _cvv;
    res.json({ success: true, data: safe });
  } catch (error) {
    next(error);
  }
}

// ─── Loans ─────────────────────────────────────────────────────────────────────

async function getLoans(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const loans = await prisma.loan.findMany({
      where: { userId },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: loans });
  } catch (error) {
    next(error);
  }
}

async function applyForLoan(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { type, amount, termMonths, purpose, collateral } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true, accountStatus: true },
    });

    if (user?.kycStatus !== 'verified') {
      res.status(403).json({ success: false, error: 'KYC verification required to apply for loans' });
      return;
    }

    // Calculate interest rate based on loan type
    const rateMap: Record<string, number> = {
      personal: 8.5, home: 4.2, auto: 5.9, student: 3.8, business: 7.5,
    };
    const interestRate = rateMap[type] || 8.0;
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);

    const timestamp = now();
    const loan = await prisma.loan.create({
      data: {
        userId,
        type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Loan`,
        principal: amount,
        interestRate,
        termMonths,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        remainingBalance: amount,
        totalPaid: 0,
        status: 'pending',
        applicationNotes: purpose,
        collateral,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Loan Application Submitted',
        message: `Your ${type} loan application for $${amount.toLocaleString()} is under review`,
        type: 'system',
        read: false,
        createdAt: timestamp,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: loan,
    });
  } catch (error) {
    next(error);
  }
}

// ─── Scheduled Transfers ───────────────────────────────────────────────────────

async function getScheduledTransfers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const transfers = await prisma.scheduledTransfer.findMany({
      where: { userId, status: { not: 'cancelled' } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: transfers });
  } catch (error) {
    next(error);
  }
}

async function createScheduledTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { fromAccountId, toAccountNumber, toAccountName, amount, currency, frequency, startDate, endDate, description } = req.body;

    const account = await prisma.bankAccount.findFirst({ where: { id: fromAccountId, userId } });
    if (!account) {
      res.status(404).json({ success: false, error: 'Account not found' });
      return;
    }

    const timestamp = now();
    const transfer = await prisma.scheduledTransfer.create({
      data: {
        userId,
        fromAccountId,
        toAccountNumber,
        toAccountName,
        amount,
        currency: currency || 'USD',
        frequency,
        nextRunDate: startDate,
        endDate,
        status: 'active',
        description,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    res.status(201).json({ success: true, data: transfer });
  } catch (error) {
    next(error);
  }
}

async function cancelScheduledTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const transfer = await prisma.scheduledTransfer.findFirst({ where: { id, userId } });
    if (!transfer) {
      res.status(404).json({ success: false, error: 'Scheduled transfer not found' });
      return;
    }

    await prisma.scheduledTransfer.update({
      where: { id },
      data: { status: 'cancelled', updatedAt: now() },
    });

    res.json({ success: true, message: 'Scheduled transfer cancelled' });
  } catch (error) {
    next(error);
  }
}

// ─── Bill Payments ─────────────────────────────────────────────────────────────

async function getBillPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const bills = await prisma.billPayment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: bills });
  } catch (error) {
    next(error);
  }
}

async function payBill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { billerName, billerCategory, accountNumber, amount, currency, dueDate, fromAccountId } = req.body;

    const account = await prisma.bankAccount.findFirst({ where: { id: fromAccountId, userId } });
    if (!account) {
      res.status(404).json({ success: false, error: 'Account not found' });
      return;
    }

    if (account.balance < amount) {
      res.status(400).json({ success: false, error: 'Insufficient funds', code: 'INSUFFICIENT_FUNDS' });
      return;
    }

    const timestamp = now();

    await prisma.$transaction([
      prisma.bankAccount.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount }, updatedAt: timestamp },
      }),
      prisma.billPayment.create({
        data: {
          userId,
          billerName,
          billerCategory,
          accountNumber,
          amount,
          currency: currency || 'USD',
          status: 'completed',
          dueDate,
          paidAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          accountId: fromAccountId,
          type: 'debit',
          amount: -amount,
          currency: currency || 'USD',
          status: 'completed',
          description: `Bill payment: ${billerName}`,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      }),
      prisma.notification.create({
        data: {
          userId,
          title: 'Bill Payment Successful',
          message: `$${amount} paid to ${billerName}`,
          type: 'transaction',
          read: false,
          createdAt: timestamp,
        },
      }),
    ]);

    res.status(201).json({ success: true, message: `Bill payment of $${amount} to ${billerName} completed` });
  } catch (error) {
    next(error);
  }
}

// ─── Currency Rates (public) ───────────────────────────────────────────────────

async function getCurrencyRates(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rates = await prisma.currencyRate.findMany();
    res.json({ success: true, data: rates });
  } catch (error) {
    next(error);
  }
}

// ─── Chat (user side) ──────────────────────────────────────────────────────────

async function getUserChatRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true, avatar: true } });

    let room = await prisma.chatRoom.findFirst({
      where: { userId, status: { not: 'resolved' } },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!room) {
      const timestamp = now();
      room = await prisma.chatRoom.create({
        data: {
          userId,
          userName: user?.fullName || 'User',
          userAvatar: user?.avatar,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        include: { messages: true },
      });
    }

    res.json({ success: true, data: room });
  } catch (error) {
    next(error);
  }
}

async function sendUserMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { content } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true } });
    let room = await prisma.chatRoom.findFirst({ where: { userId, status: { not: 'resolved' } } });

    const timestamp = now();
    if (!room) {
      const dbUser = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true, avatar: true } });
      room = await prisma.chatRoom.create({
        data: {
          userId,
          userName: dbUser?.fullName || 'User',
          userAvatar: dbUser?.avatar,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: room.id,
        senderId: userId,
        senderType: 'user',
        senderName: user?.fullName || 'User',
        content,
        createdAt: timestamp,
      },
    });

    await prisma.chatRoom.update({
      where: { id: room.id },
      data: {
        lastMessage: content,
        lastMessageAt: timestamp,
        unreadCount: { increment: 1 },
        updatedAt: timestamp,
      },
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

// ─── Router ────────────────────────────────────────────────────────────────────

const router = Router();
router.use(authMiddleware);

// Cards
router.get('/cards', getCards);
router.get('/cards/:id', getCardById);
router.put('/cards/:id/status', updateCardStatus);

// Loans
router.get('/loans', getLoans);
router.post('/loans/apply', applyForLoan);

// Scheduled Transfers
router.get('/scheduled-transfers', getScheduledTransfers);
router.post('/scheduled-transfers', createScheduledTransfer);
router.delete('/scheduled-transfers/:id', cancelScheduledTransfer);

// Bill Payments
router.get('/bills', getBillPayments);
router.post('/bills/pay', payBill);

// Currency Rates (public info)
router.get('/currency-rates', getCurrencyRates);

// Chat
router.get('/chat/room', getUserChatRoom);
router.post('/chat/messages', sendUserMessage);

export default router;
