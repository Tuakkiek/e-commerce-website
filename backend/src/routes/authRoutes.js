import express from 'express';
import { register, login, logout, changePassword, getCurrentUser } from '../controllers/authController.js'; // Đảm bảo bạn đã import getCurrentUser
import { protect } from '../middleware/authMiddleware.js'; // Đảm bảo đúng tên file

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser); // Lấy thông tin người dùng thay vì 'getProfile'
router.put('/change-password', protect, changePassword);

export default router;
