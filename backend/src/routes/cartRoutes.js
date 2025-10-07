import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import cartController from '../controllers/cart.controller';

const router = express.Router();

router.use(protect);
router.use(restrictTo('CUSTOMER'));

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;
