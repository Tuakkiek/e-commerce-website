// routes/userRoutes.js
import express from 'express';
import { updateProfile, addAddress, updateAddress, deleteAddress, getAllEmployees, createEmployee, toggleEmployeeStatus, deleteEmployee } from '../controllers/userController.js';  // Sửa lại tên controller cho đúng
import { protect, restrictTo } from '../middleware/authMiddleware.js';  // Đảm bảo đường dẫn đúng

const router = express.Router();

router.use(protect);

// Customer routes
router.put('/profile', restrictTo('CUSTOMER'), updateProfile);
router.post('/addresses', restrictTo('CUSTOMER'), addAddress);
router.put('/addresses/:addressId', restrictTo('CUSTOMER'), updateAddress);
router.delete('/addresses/:addressId', restrictTo('CUSTOMER'), deleteAddress);

// Admin routes
router.get('/employees', restrictTo('ADMIN'), getAllEmployees);
router.post('/employees', restrictTo('ADMIN'), createEmployee);
router.patch('/employees/:id/toggle-status', restrictTo('ADMIN'), toggleEmployeeStatus);
router.delete('/employees/:id', restrictTo('ADMIN'), deleteEmployee);

export default router;
