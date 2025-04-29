import express from 'express';
import { 
    addToCart, 
    removeFromCart, 
    updateCartItem, 
    clearCart, 
    getCart 
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

// Cart CRUD operations
cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/update", authMiddleware, updateCartItem);
cartRouter.post("/clear", authMiddleware, clearCart);
cartRouter.get("/get", authMiddleware, getCart);

export default cartRouter;