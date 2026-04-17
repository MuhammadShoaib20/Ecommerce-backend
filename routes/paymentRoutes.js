import express from 'express';
import {
  processPayment,
  createPaymentIntent,
  sendStripeApiKey,
  stripeWebhookHandler,
} from '../controllers/paymentController.js';
import { isAuthenticatedUser } from '../middleware/auth.js';

const router = express.Router();

// Create a PaymentIntent — used by Stripe Elements on the frontend
router.post('/payment/intent', isAuthenticatedUser, createPaymentIntent);

// Legacy charge endpoint (kept for backward compatibility)
router.post('/payment/process', isAuthenticatedUser, processPayment);

// Send publishable key to frontend
router.get('/stripeapikey', isAuthenticatedUser, sendStripeApiKey);

// Stripe webhook — raw body parsing must be applied in server.js before this route
router.post('/payment/webhook', stripeWebhookHandler);

// Dev-only: allow calling the payment processor without auth for quick local testing
// Controlled by ENABLE_DEV_ROUTES environment variable (set to 'true' to enable)
if (process.env.ENABLE_DEV_ROUTES === 'true') {
  router.post('/payment/process-debug', processPayment);
  console.warn('Dev payment route `/api/payment/process-debug` is enabled (ENABLE_DEV_ROUTES=true)');
}

export default router;