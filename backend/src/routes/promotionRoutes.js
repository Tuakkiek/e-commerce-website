import express from 'express';
import { getActivePromotions, getAllPromotions, createPromotion, updatePromotion, deletePromotion } from '../controllers/promotion.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/active', getActivePromotions);

router.use(protect);
router.use(restrictTo('ADMIN'));

router.get('/', getAllPromotions);
router.post('/', createPromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;
