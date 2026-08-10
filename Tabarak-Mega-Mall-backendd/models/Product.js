const Order = require('../models/Order');
const Product = require('../models/Product');

// Create New Order & Auto Deduct Stock
exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, customerAddress, city, items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty!' });
        }

        // Check & Deduct Stock
        for (let item of items) {
            const product = await Product.findOne({ name: item.name });
            if (product) {
                if (product.stock < item.qty) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
                }
                product.stock -= item.qty;
                await product.save();
            }
        }

        const newOrder = new Order({
            customerName,
            customerPhone,
            customerAddress,
            city,
            items,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order placed and stock updated successfully!', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error placing order', error: err.message });
    }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found!' });

        res.status(200).json({ message: 'Order status updated!', order: updatedOrder });
    } catch (err) {
        res.status(500).json({ message: 'Error updating order status', error: err.message });
    }
};