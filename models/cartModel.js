import CartModel from "../models/cartModel.js";
import foodModel from "../models/foodModel.js";

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity = 1 } = req.body;
        
        // Find the food item to get details
        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }
        
        // Find user's cart or create a new one
        let cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            // Create new cart if doesn't exist
            cart = new CartModel({ userId, items: [] });
        }
        
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.foodId.toString() === itemId
        );
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += Number(quantity);
        } else {
            // Add new item to cart
            cart.items.push({
                foodId: itemId,
                quantity: Number(quantity),
                price: foodItem.price,
                name: foodItem.name,
                image: foodItem.image
            });
        }
        
        await cart.save();
        res.json({ 
            success: true, 
            message: "Added to cart",
            cartTotal: cart.calculateTotal(),
            itemCount: cart.items.length,
            cartItems: cart.items
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, quantity = 1, removeAll = false } = req.body;
        
        // Find user's cart
        let cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        
        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => 
            item.foodId.toString() === itemId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not in cart" });
        }
        
        // Handle item removal logic
        if (removeAll || cart.items[itemIndex].quantity <= quantity) {
            // Remove the entire item
            cart.items.splice(itemIndex, 1);
        } else {
            // Decrease the quantity
            cart.items[itemIndex].quantity -= Number(quantity);
        }
        
        // Save the updated cart
        await cart.save();
        
        res.json({ 
            success: true, 
            message: "Item removed from cart",
            cartTotal: cart.calculateTotal(),
            itemCount: cart.items.length,
            cartItems: cart.items
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }
        
        // Find user's cart
        let cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        
        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => 
            item.foodId.toString() === itemId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not in cart" });
        }
        
        // Update the quantity
        cart.items[itemIndex].quantity = Number(quantity);
        
        // Save the updated cart
        await cart.save();
        
        res.json({ 
            success: true, 
            message: "Cart updated",
            cartTotal: cart.calculateTotal(),
            itemCount: cart.items.length,
            cartItems: cart.items
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating cart" });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Find and update user's cart
        const cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        
        // Empty the items array
        cart.items = [];
        await cart.save();
        
        res.json({ 
            success: true, 
            message: "Cart cleared",
            cartItems: []
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error clearing cart" });
    }
};

// Get cart contents
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Find user's cart
        const cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            // Return empty cart if not found
            return res.json({ 
                success: true, 
                cartTotal: 0,
                itemCount: 0,
                cartItems: [] 
            });
        }
        
        res.json({ 
            success: true, 
            cartTotal: cart.calculateTotal(),
            itemCount: cart.items.length,
            cartItems: cart.items 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error retrieving cart" });
    }
};

export default{ 
    addToCart, 
    removeFromCart, 
    updateCartItem, 
    clearCart, 
    getCart 
};