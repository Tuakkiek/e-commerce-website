import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import orderController from '../controllers/order.controller';

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/', restrictTo('CUSTOMER'), orderController.createOrder);
router.get('/my-orders', restrictTo('CUSTOMER'), orderController.getMyOrders);
router.post('/:id/cancel', restrictTo('CUSTOMER'), orderController.cancelOrder);

// Order Manager routes
router.get('/all', 
  restrictTo('ORDER_MANAGER', 'ADMIN'), 
  orderController.getAllOrders
);

router.put('/:id/status', 
  restrictTo('ORDER_MANAGER', 'ADMIN'), 
  orderController.updateOrderStatus
);

// Shared routes
router.get('/:id', orderController.getOrderById);

export default router;
