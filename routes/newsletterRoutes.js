import express from 'express';
import { 
  subscribeNewsletter, 
  unsubscribeNewsletter, 
  getAllSubscribers,
  deleteSubscription 
} from '../controllers/newsletterController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/newsletter/subscribe', subscribeNewsletter);
router.post('/newsletter/unsubscribe', unsubscribeNewsletter);

// Admin routes
router.get('/admin/newsletter/subscribers', isAuthenticatedUser, authorizeRoles('admin'), getAllSubscribers);
router.delete('/admin/subscription/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteSubscription);

export default router;