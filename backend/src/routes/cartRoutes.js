// routes/cartRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';  // Cập nhật đường dẫn chính xác
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';  // Import đúng các hàm

const router = express.Router();

router.use(protect);
router.use(restrictTo('CUSTOMER'));

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router;
