import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'succeeded', 'failed', 'refunded', 'canceled'],
        default: 'pending'
    },
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        },
        name: String,
        quantity: Number,
        price: Number
    }],
    shippingAddress: {
        name: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postal_code: String,
            country: String
        }
    },
    paymentMethod: {
        type: String,
        default: 'card'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PaymentModel = mongoose.model('Payment', paymentSchema);

export default PaymentModel;