import { Router } from 'express';
import {
  getUserTransactions,
  getTransactionById,
} from '../controllers/accountController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { transactionQuerySchema } from '../validators/schemas';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(transactionQuerySchema, 'query'), getUserTransactions);
router.get('/:id', getTransactionById);

export default router;
