import express from 'express';
import { createLink, getLinks, getLinkStats, getLinkQRCode } from '../controllers/linkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to protected routes
router.route('/')
    .post(protect, createLink)
    .get(protect, getLinks);

router.get('/:linkId/stats', protect, getLinkStats);
router.get('/:linkId/qr', protect, getLinkQRCode);

export default router;
