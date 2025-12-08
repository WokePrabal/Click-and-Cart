// backend/routes/orderRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { noCache } from '../middleware/noCache.js';
import { createOrder, getMyOrders, getOrderById, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, noCache, getMyOrders);
router.route('/:id').get(protect, noCache, getOrderById);
router.delete('/:id', protect, noCache, deleteOrder);

export default router;


