import express from 'express';
import productController from '../controllers/product.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', 
  protect, 
  restrictTo('WAREHOUSE_STAFF', 'ADMIN'), 
  productController.createProduct
);

router.put('/:id', 
  protect, 
  restrictTo('WAREHOUSE_STAFF', 'ADMIN'), 
  productController.updateProduct
);

router.delete('/:id', 
  protect, 
  restrictTo('WAREHOUSE_STAFF'), 
  productController.deleteProduct
);

router.patch('/:id/quantity', 
  protect, 
  restrictTo('WAREHOUSE_STAFF'), 
  productController.updateQuantity
);

export default router;
