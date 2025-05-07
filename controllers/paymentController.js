import Stripe from 'stripe';
import dotenv from 'dotenv';
import CartModel from '../models/cartModel.js';
import PaymentModel from '../models/paymentModel.js';
import UserModel from '../models/userModel.js';

dotenv.config();

// Initialize Stripe with the secret key (with fallback for missing env variable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key');

// Get Stripe public key for frontend
const getPublicKey = async (req, res) => {
    try {
        // Ensure a public key is configured
        if (!process.env.STRIPE_PUBLIC_KEY) {
            console.error("Missing Stripe public key in environment variables");
            return res.status(500).json({
                success: false,
                message: "Payment system is not properly configured"
            });
        }
        
        // Return the public key from env
        res.json({
            success: true,
            publicKey: process.env.STRIPE_PUBLIC_KEY
        });
    } catch (error) {
        console.error("Error getting public key:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving Stripe public key"
        });
    }
};

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Validate user ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        
        // Get user's cart
        const cart = await CartModel.findOne({ userId });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }
        
        // Get user details for the payment
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Calculate amount in cents for Stripe
        const amount = Math.round(cart.calculateTotal() * 100);
        
        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                userId: userId.toString(),
                cartId: cart._id.toString()
            }
        });
        
        // Create a record in our database
        const payment = new PaymentModel({
            userId,
            paymentIntentId: paymentIntent.id,
            amount: amount / 100, // Store in dollars in our DB
            status: 'pending',
            items: cart.items.map(item => ({
                foodId: item.foodId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        });
        
        await payment.save();
        
        // Return client secret to frontend
        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amount / 100 // Return in dollars
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({
            success: false,
            message: "Error creating payment intent"
        });
    }
};

// Process a completed payment
const processPayment = async (req, res) => {
    try {
        const { userId, paymentIntentId } = req.body;
        
        // Validate input
        if (!paymentIntentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }
        
        // Retrieve the payment from Stripe to confirm status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: "Payment has not been completed"
            });
        }
        
        // Update our payment record
        const payment = await PaymentModel.findOne({ paymentIntentId });
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }
        
        // Update payment status
        payment.status = 'succeeded';
        await payment.save();
        
        // Clear the user's cart
        const cart = await CartModel.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        
        // Return success
        res.json({
            success: true,
            message: "Payment processed successfully",
            orderId: payment._id
        });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({
            success: false,
            message: "Error processing payment"
        });
    }
};

// Get payment history for a user
const getPaymentHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        
        const payments = await PaymentModel.find({ 
            userId, 
            status: 'succeeded' 
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            payments
        });
    } catch (error) {
        console.error("Error retrieving payment history:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving payment history"
        });
    }
};

// Handle Stripe webhook events
const handleWebhook = async (req, res) => {
    let event;
    
    try {
        // Make sure webhook signing secret is configured
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.warn("Webhook secret not configured - webhook event validation skipped");
            event = req.body;
        } else {
            const sig = req.headers['stripe-signature'];
            
            if (!sig) {
                return res.status(400).send(`Webhook Error: No Stripe signature found`);
            }
            
            // Verify webhook signature
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        }
    } catch (error) {
        console.error("Webhook signature verification failed:", error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    
    // Handle specific events
    try {
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log(`Payment intent ${paymentIntent.id} succeeded`);
            
            // Update payment status in our database
            await PaymentModel.findOneAndUpdate(
                { paymentIntentId: paymentIntent.id },
                { 
                    status: 'succeeded',
                    updatedAt: new Date()
                }
            );
            
            // Get user ID from payment metadata
            if (paymentIntent.metadata && paymentIntent.metadata.userId) {
                // Clear user's cart after successful payment
                await CartModel.findOneAndUpdate(
                    { userId: paymentIntent.metadata.userId },
                    { items: [] }
                );
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            console.log(`Payment intent ${paymentIntent.id} failed`);
            
            // Update payment status in our database
            await PaymentModel.findOneAndUpdate(
                { paymentIntentId: paymentIntent.id },
                { 
                    status: 'failed',
                    updatedAt: new Date()
                }
            );
        }
        
        res.json({ received: true });
    } catch (error) {
        console.error("Error handling webhook event:", error);
        res.status(500).json({ error: "Error processing webhook" });
    }
};

export {
    getPublicKey,
    createPaymentIntent,
    processPayment,
    getPaymentHistory,
    handleWebhook
};