import { Router } from 'express';
import {
  getAccounts,
  getAccountById,
  createAccount,
  getAccountTransactions,
  getUserTransactions,
  getTransactionById,
} from '../controllers/accountController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAccountSchema, transactionQuerySchema } from '../validators/schemas';

const router = Router();

router.use(authMiddleware);

// Accounts
router.get('/', getAccounts);
router.post('/', validate(createAccountSchema), createAccount);
router.get('/:id', getAccountById);
router.get('/:id/transactions', validate(transactionQuerySchema, 'query'), getAccountTransactions);

export default router;
