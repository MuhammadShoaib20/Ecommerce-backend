// Quick test script to verify paymentController fallback without contacting Stripe
process.env.STRIPE_SECRET_KEY = '';
import { processPayment } from '../controllers/paymentController.js';

const req = { body: { amount: 12.5 } };
const res = {
  status(code) { this.statusCode = code; return this; },
  json(payload) { console.log('TEST RESPONSE:', { status: this.statusCode, payload }); }
};

processPayment(req, res).then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
