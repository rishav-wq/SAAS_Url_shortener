import express from 'express';
import {
  getPlans,
  initiatePayment,
  uploadPaymentProof,
  verifyPayment,
  getPaymentHistory,
  getCurrentSubscription,
  cancelSubscription,
  getAllPayments
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payment-proofs/');
  },
  filename: (req, file, cb) => {
    cb(null, `payment-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.get('/plans', getPlans);

// Protected routes
router.use(protect);

// Payment routes
router.post('/initiate', initiatePayment);
router.post('/:paymentId/proof', upload.single('paymentProof'), uploadPaymentProof);
router.get('/history', getPaymentHistory);
router.get('/subscription', getCurrentSubscription);
router.post('/cancel-subscription', cancelSubscription);

// Admin routes
router.get('/admin/all', getAllPayments);
router.post('/admin/:paymentId/verify', verifyPayment);

export default router;
