import { Router } from 'express';
import {
  internalTransfer,
  externalTransfer,
  p2pTransfer,
  getTransferHistory,
} from '../controllers/transferController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { transferRateLimiter } from '../middleware/rateLimiter';
import {
  internalTransferSchema,
  externalTransferSchema,
  p2pTransferSchema,
} from '../validators/schemas';

const router = Router();

router.use(authMiddleware);
router.use(transferRateLimiter);

router.post('/internal', validate(internalTransferSchema), internalTransfer);
router.post('/external', validate(externalTransferSchema), externalTransfer);
router.post('/p2p', validate(p2pTransferSchema), p2pTransfer);
router.get('/history', getTransferHistory);

export default router;
