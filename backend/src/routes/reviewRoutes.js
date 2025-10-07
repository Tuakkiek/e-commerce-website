// routes/reviewRoutes.js
import express from 'express';
import { getProductReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';  // Sửa lại tên controller cho đúng
import { protect, restrictTo } from '../middleware/authMiddleware.js';  // Cập nhật đường dẫn chính xác

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.use(protect);
router.use(restrictTo('CUSTOMER'));

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
