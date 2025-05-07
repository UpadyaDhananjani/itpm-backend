import express from 'express';
import {
    getPublicKey,
    createPaymentIntent,
    processPayment,
    getPaymentHistory,
    handleWebhook
} from '../controllers/paymentController.js';
import authMiddleware from '../middleware/auth.js';

const paymentRouter = express.Router();

// Public routes
paymentRouter.get('/public-key', getPublicKey);

// Special route for Stripe webhooks (must be before any JSON parsing middleware)
// This is why we define it directly here instead of in the main app
paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes that require authentication
paymentRouter.post('/create-payment-intent', authMiddleware, createPaymentIntent);
paymentRouter.post('/process-payment', authMiddleware, processPayment);
paymentRouter.get('/history', authMiddleware, getPaymentHistory);

export default paymentRouter;