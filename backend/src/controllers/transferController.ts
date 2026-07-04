import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';
import { calculateTransferFee, generateReferenceNumber, now } from '../utils/helpers';
import { auditLog } from '../utils/logger';

// ─── Internal Transfer (between own accounts) ─────────────────────────────────

export async function internalTransfer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { fromAccountId, toAccountId, amount, currency, description } = req.body;

    if (fromAccountId === toAccountId) {
      res.status(400).json({ success: false, error: 'Cannot transfer to the same account' });
      return;
    }

    // Verify both accounts belong to user
    const [fromAccount, toAccount] = await Promise.all([
      prisma.bankAccount.findFirst({ where: { id: fromAccountId, userId } }),
      prisma.bankAccount.findFirst({ where: { id: toAccountId, userId } }),
    ]);

    if (!fromAccount) {
      res.status(404).json({ success: false, error: 'Source account not found' });
      return;
    }
    if (!toAccount) {
      res.status(404).json({ success: false, error: 'Destination account not found' });
      return;
    }

    if (fromAccount.status !== 'active') {
      res.status(400).json({ success: false, error: 'Source account is not active' });
      return;
    }

    if (fromAccount.balance < amount) {
      res.status(400).json({
        success: false,
        error: 'Insufficient funds',
        code: 'INSUFFICIENT_FUNDS',
      });
      return;
    }

    // Check daily limit
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && amount > user.dailyLimit) {
      res.status(400).json({
        success: false,
        error: `Transfer exceeds daily limit of $${user.dailyLimit.toLocaleString()}`,
        code: 'DAILY_LIMIT_EXCEEDED',
      });
      return;
    }

    const timestamp = now();
    const referenceNumber = generateReferenceNumber();

    // Atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Debit source
      await tx.bankAccount.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount }, updatedAt: timestamp },
      });

      // Credit destination
      await tx.bankAccount.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount }, updatedAt: timestamp },
      });

      // Create debit transaction record
      const debitTx = await tx.transaction.create({
        data: {
          userId,
          accountId: fromAccountId,
          type: 'transfer',
          amount: -amount,
          currency: currency || 'USD',
          status: 'completed',
          description: description || `Transfer to ${toAccount.name}`,
          referenceId: referenceNumber,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Create credit transaction record
      await tx.transaction.create({
        data: {
          userId,
          accountId: toAccountId,
          type: 'transfer',
          amount: amount,
          currency: currency || 'USD',
          status: 'completed',
          description: description || `Transfer from ${fromAccount.name}`,
          referenceId: referenceNumber,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Create transfer record
      const transfer = await tx.transfer.create({
        data: {
          senderId: userId,
          receiverId: userId,
          sourceAccountId: fromAccountId,
          destAccountId: toAccountId,
          type: 'internal',
          amount,
          currency: currency || 'USD',
          fee: 0,
          status: 'completed',
          description: description || `Internal transfer`,
          referenceNumber,
          completedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId,
          title: 'Transfer Completed',
          message: `$${amount.toLocaleString()} transferred from ${fromAccount.name} to ${toAccount.name}`,
          type: 'transaction',
          read: false,
          createdAt: timestamp,
        },
      });

      return { transfer, transaction: debitTx };
    });

    auditLog({
      action: 'INTERNAL_TRANSFER',
      userId,
      ipAddress: req.ip,
      metadata: { amount, fromAccountId, toAccountId, referenceNumber },
    });

    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        referenceNumber,
        amount,
        fee: 0,
        fromAccount: { id: fromAccountId, name: fromAccount.name },
        toAccount: { id: toAccountId, name: toAccount.name },
        status: 'completed',
        transferId: result.transfer.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── External Transfer (to another person / bank) ─────────────────────────────

export async function externalTransfer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const {
      fromAccountId,
      recipientName,
      recipientAccountNumber,
      recipientBankName,
      recipientRoutingNumber,
      amount,
      currency,
      description,
    } = req.body;

    const fromAccount = await prisma.bankAccount.findFirst({
      where: { id: fromAccountId, userId },
    });

    if (!fromAccount) {
      res.status(404).json({ success: false, error: 'Source account not found' });
      return;
    }

    if (fromAccount.status !== 'active') {
      res.status(400).json({ success: false, error: 'Source account is not active' });
      return;
    }

    const fee = calculateTransferFee(amount, 'external');
    const totalDebit = amount + fee;

    if (fromAccount.balance < totalDebit) {
      res.status(400).json({
        success: false,
        error: `Insufficient funds. Required: $${totalDebit.toFixed(2)} (includes $${fee.toFixed(2)} fee)`,
        code: 'INSUFFICIENT_FUNDS',
      });
      return;
    }

    // Check if recipient is an OrbitPay user (P2P)
    let receiverUser = await prisma.user.findFirst({
      where: {
        accounts: { some: { accountNumber: recipientAccountNumber } },
      },
    });

    const timestamp = now();
    const referenceNumber = generateReferenceNumber();

    const result = await prisma.$transaction(async (tx) => {
      // Debit sender
      await tx.bankAccount.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: totalDebit }, updatedAt: timestamp },
      });

      // If internal OrbitPay user, credit them
      if (receiverUser) {
        const receiverAccount = await tx.bankAccount.findFirst({
          where: { accountNumber: recipientAccountNumber, userId: receiverUser.id },
        });

        if (receiverAccount) {
          await tx.bankAccount.update({
            where: { id: receiverAccount.id },
            data: { balance: { increment: amount }, updatedAt: timestamp },
          });

          // Credit transaction for receiver
          await tx.transaction.create({
            data: {
              userId: receiverUser!.id,
              accountId: receiverAccount.id,
              type: 'transfer',
              amount: amount,
              currency: currency || 'USD',
              status: 'completed',
              description: `Received from ${(await tx.user.findUnique({ where: { id: userId }, select: { fullName: true } }))?.fullName}`,
              recipientName: (await tx.user.findUnique({ where: { id: userId }, select: { fullName: true } }))?.fullName,
              referenceId: referenceNumber,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          });

          // Notify receiver
          await tx.notification.create({
            data: {
              userId: receiverUser!.id,
              title: 'Money Received',
              message: `You received $${amount.toLocaleString()} from ${(await tx.user.findUnique({ where: { id: userId }, select: { fullName: true } }))?.fullName}`,
              type: 'transaction',
              read: false,
              createdAt: timestamp,
            },
          });
        }
      }

      // Debit transaction for sender
      const senderTx = await tx.transaction.create({
        data: {
          userId,
          accountId: fromAccountId,
          type: 'transfer',
          amount: -amount,
          currency: currency || 'USD',
          status: 'completed',
          description: description || `Transfer to ${recipientName}`,
          recipientName,
          referenceId: referenceNumber,
          fee,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Transfer record
      const transfer = await tx.transfer.create({
        data: {
          senderId: userId,
          receiverId: receiverUser?.id || null,
          sourceAccountId: fromAccountId,
          type: receiverUser ? 'internal' : 'external',
          amount,
          currency: currency || 'USD',
          fee,
          status: 'completed',
          description,
          recipientName,
          recipientBank: recipientBankName,
          recipientAccount: recipientAccountNumber,
          referenceNumber,
          completedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Notify sender
      await tx.notification.create({
        data: {
          userId,
          title: 'Transfer Sent',
          message: `$${amount.toLocaleString()} sent to ${recipientName}. Ref: ${referenceNumber}`,
          type: 'transaction',
          read: false,
          createdAt: timestamp,
        },
      });

      return { transfer, transaction: senderTx };
    });

    auditLog({
      action: 'EXTERNAL_TRANSFER',
      userId,
      ipAddress: req.ip,
      metadata: { amount, fee, recipientName, referenceNumber },
    });

    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        referenceNumber,
        amount,
        fee,
        totalDebit,
        recipientName,
        status: 'completed',
        transferId: result.transfer.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── P2P Transfer (by email) ───────────────────────────────────────────────────

export async function p2pTransfer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { fromAccountId, recipientEmail, amount, currency, description } = req.body;

    if (recipientEmail === req.user!.email) {
      res.status(400).json({ success: false, error: 'Cannot transfer to yourself' });
      return;
    }

    const [fromAccount, recipient] = await Promise.all([
      prisma.bankAccount.findFirst({ where: { id: fromAccountId, userId } }),
      prisma.user.findUnique({
        where: { email: recipientEmail },
        include: { accounts: { where: { isPrimary: true, status: 'active' }, take: 1 } },
      }),
    ]);

    if (!fromAccount) {
      res.status(404).json({ success: false, error: 'Source account not found' });
      return;
    }

    if (!recipient) {
      res.status(404).json({ success: false, error: 'Recipient not found' });
      return;
    }

    if (recipient.accountStatus !== 'active') {
      res.status(400).json({ success: false, error: 'Recipient account is not active' });
      return;
    }

    if (fromAccount.balance < amount) {
      res.status(400).json({ success: false, error: 'Insufficient funds', code: 'INSUFFICIENT_FUNDS' });
      return;
    }

    const recipientAccount = recipient.accounts[0];
    if (!recipientAccount) {
      res.status(400).json({ success: false, error: 'Recipient has no active accounts' });
      return;
    }

    const timestamp = now();
    const referenceNumber = generateReferenceNumber();

    await prisma.$transaction(async (tx) => {
      await tx.bankAccount.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount }, updatedAt: timestamp },
      });

      await tx.bankAccount.update({
        where: { id: recipientAccount.id },
        data: { balance: { increment: amount }, updatedAt: timestamp },
      });

      const sender = await tx.user.findUnique({ where: { id: userId }, select: { fullName: true } });

      await tx.transaction.create({
        data: {
          userId,
          accountId: fromAccountId,
          type: 'transfer',
          amount: -amount,
          currency: currency || 'USD',
          status: 'completed',
          description: description || `Transfer to ${recipient.fullName}`,
          recipientName: recipient.fullName,
          recipientAvatar: recipient.avatar,
          referenceId: referenceNumber,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await tx.transaction.create({
        data: {
          userId: recipient.id,
          accountId: recipientAccount.id,
          type: 'transfer',
          amount: amount,
          currency: currency || 'USD',
          status: 'completed',
          description: `Received from ${sender?.fullName}`,
          recipientName: sender?.fullName,
          referenceId: referenceNumber,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      await tx.transfer.create({
        data: {
          senderId: userId,
          receiverId: recipient.id,
          sourceAccountId: fromAccountId,
          destAccountId: recipientAccount.id,
          type: 'internal',
          amount,
          currency: currency || 'USD',
          fee: 0,
          status: 'completed',
          description,
          recipientName: recipient.fullName,
          referenceNumber,
          completedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });

      // Notifications
      await tx.notification.create({
        data: {
          userId,
          title: 'Transfer Sent',
          message: `$${amount.toLocaleString()} sent to ${recipient.fullName}`,
          type: 'transaction',
          read: false,
          createdAt: timestamp,
        },
      });

      await tx.notification.create({
        data: {
          userId: recipient.id,
          title: 'Money Received',
          message: `$${amount.toLocaleString()} received from ${sender?.fullName}`,
          type: 'transaction',
          read: false,
          createdAt: timestamp,
        },
      });
    });

    auditLog({
      action: 'P2P_TRANSFER',
      userId,
      ipAddress: req.ip,
      metadata: { amount, recipientEmail, referenceNumber },
    });

    res.status(201).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        referenceNumber,
        amount,
        fee: 0,
        recipientName: recipient.fullName,
        status: 'completed',
      },
    });
  } catch (error) {
    next(error);
  }
}

// ─── Get Transfer History ──────────────────────────────────────────────────────

export async function getTransferHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transfer.count({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      }),
    ]);

    res.json({
      success: true,
      data: {
        transfers,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (error) {
    next(error);
  }
}
