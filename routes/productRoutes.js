import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts
} from '../controllers/productController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/product/:id', getProductDetails);
router.get('/reviews', getProductReviews);

router.put('/review', isAuthenticatedUser, createProductReview);

router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);
router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.delete('/admin/review', isAuthenticatedUser, authorizeRoles('admin'), deleteReview);

export default router;
