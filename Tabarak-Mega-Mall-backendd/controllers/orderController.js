const Order = require('../models/Order');

// Create New Order
exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, customerAddress, city, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty!' });
        }

        const newOrder = new Order({
            customerName: customerName || 'Guest Customer',
            customerPhone: customerPhone || 'N/A',
            customerAddress: customerAddress || 'Karianwala',
            city: city || 'Karianwala',
            items: items,
            totalAmount: Number(totalAmount) || 0
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully!', order: newOrder });
    } catch (err) {
        console.error("Order Creation Detailed Error:", err);
        res.status(500).json({ message: 'Error creating order: ' + err.message });
    }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders: ' + err.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ message: 'Order status updated!', order: updatedOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error updating status: ' + err.message });
    }
};