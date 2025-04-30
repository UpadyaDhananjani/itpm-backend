const Order = require("../Models/OrderModel");

// Get all orders
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        return res.status(200).json({ orders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching orders" });
    }
};

// Add an order
const addOrders = async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, address, city, orderId, specialInstructions, pickupTime, orderStatus } = req.body;

    try {
        const order = new Order({
            firstName, lastName, email, phoneNumber, address, city, orderId, specialInstructions, pickupTime, orderStatus
        });
        await order.save();
        return res.status(201).json({ order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding order" });
    }
};

// Get order by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching order by ID" });
    }
};

// Update order details
const updateOrder = async (req, res, next) => {
    const id = req.params.id;
    const { firstName, lastName, email, phoneNumber, address, city, orderId, specialInstructions, pickupTime, orderStatus } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { firstName, lastName, email, phoneNumber, address, city, orderId, specialInstructions, pickupTime, orderStatus },
            { new: true } // This returns the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Unable to update order details" });
        }

        return res.status(200).json({ updatedOrder });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating order" });
    }
};

//delete order details
const deleteOrder = async (req, res, next) => {
    const id = req.params.id;

    let order;

    try{
        order = await Order.findByIdAndDelete(id)

    }catch (err) {
        console.log(err);
    }
    if (!order) {
        return res.status(404).json({ message: "Unable to delete order details" });
    }

    return res.status(200).json({ order });
};

// Export functions
exports.getAllOrders = getAllOrders;
exports.addOrders = addOrders;
exports.getById = getById;
exports.updateOrder = updateOrder;
exports.deleteOrder = deleteOrder;
