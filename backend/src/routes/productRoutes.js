// routes/productRoutes.js
import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateQuantity } from '../controllers/productController.js';  // Import đúng các hàm
import { protect, restrictTo } from '../middleware/authMiddleware.js';  // Cập nhật đường dẫn đúng

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', protect, restrictTo('WAREHOUSE_STAFF', 'ADMIN'), createProduct);
router.put('/:id', protect, restrictTo('WAREHOUSE_STAFF', 'ADMIN'), updateProduct);
router.delete('/:id', protect, restrictTo('WAREHOUSE_STAFF'), deleteProduct);
router.patch('/:id/quantity', protect, restrictTo('WAREHOUSE_STAFF'), updateQuantity);

export default router;
