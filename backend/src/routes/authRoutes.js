import express from 'express';
import authController from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getCurrentUser);
router.put('/change-password', protect, authController.changePassword);

export default router;

