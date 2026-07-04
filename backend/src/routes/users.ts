import { Router } from 'express';
import {
  getMe,
  updateProfile,
  getUserById,
  submitKyc,
  getKycStatus,
  getNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema, markNotificationsReadSchema } from '../validators/schemas';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for KYC uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `kyc-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  },
});

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Profile
router.get('/me', getMe);
router.put('/me', validate(updateUserSchema), updateProfile);
router.get('/:id', getUserById);

// KYC
router.post('/me/kyc', upload.single('document'), submitKyc);
router.get('/me/kyc', getKycStatus);

// Notifications
router.get('/me/notifications', getNotifications);
router.put('/me/notifications/read-all', markAllNotificationsRead);
router.put('/me/notifications/read', validate(markNotificationsReadSchema), markNotificationsRead);

export default router;
