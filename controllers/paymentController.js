import Stripe from 'stripe';
import Order from '../models/Order.js';

let stripeClient = null;
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key, { apiVersion: '2022-11-15' });
  return stripeClient;
};

// Process Payment - creates a PaymentIntent when Stripe secret present, otherwise returns a mock client_secret
export const processPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const stripe = getStripe();

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
      });

      return res.status(200).json({ success: true, client_secret: paymentIntent.client_secret });
    }

    // Fallback / Mock when no Stripe secret is configured (development)
    const mockClientSecret = `pi_mock_${Date.now()}`;
    return res.status(200).json({
      success: true,
      client_secret: mockClientSecret,
      mocked: true,
      amount: Math.round(amount * 100)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Stripe API Key (publishable key)
export const sendStripeApiKey = async (req, res) => {
  try {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook handler - verifies Stripe signature (when configured) and updates order/payment status
export const stripeWebhookHandler = async (req, res) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return res.status(400).json({ success: false, message: 'Stripe webhook not configured on this environment' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const raw = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const type = event.type;

  try {
    if (type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ 'paymentInfo.id': paymentIntent.id });
      if (order) {
        order.paymentInfo.status = paymentIntent.status || 'succeeded';
        order.orderStatus = order.orderStatus === 'Processing' ? 'Processing' : order.orderStatus;
        await order.save({ validateBeforeSave: false });
        console.log(`Order ${order._id} marked as paid via webhook.`);
      }
    } else if (type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ 'paymentInfo.id': paymentIntent.id });
      if (order) {
        order.paymentInfo.status = paymentIntent.status || 'failed';
        await order.save({ validateBeforeSave: false });
        console.log(`Order ${order._id} payment failed.`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing Stripe webhook:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create PaymentIntent — used by Stripe Elements on the frontend
// POST /api/payment/intent
// Body: { amount: number } ← amount in cents (e.g. $25.00 → 2500)
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log('📦 Creating payment intent with amount (cents):', amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const stripe = getStripe();

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: 'usd',
        metadata: { userId: req.user?._id?.toString() },
      });
      console.log('✅ Payment intent created:', paymentIntent.id);
      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
      });
    }

    // Fallback mock when Stripe is not configured (development)
    console.warn('⚠️ Stripe secret key missing – returning mock client secret.');
    return res.status(200).json({
      success: true,
      clientSecret: `pi_mock_secret_${Date.now()}`,
      mocked: true,
    });
  } catch (error) {
    console.error('❌ Payment intent error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};