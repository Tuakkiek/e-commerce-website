import express from 'express';
import { getProductReviews, createReview, updateReview, deleteReview } from '../controllers/review.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.use(protect);
router.use(restrictTo('CUSTOMER'));

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
