const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send Admin Email Function
async function sendAdminEmail(orderData) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: '🚀 New Order Received - Tabarak Mega Mall',
        html: `
            <h2>New Order Placed!</h2>
            <p><strong>Customer Name:</strong> ${orderData.customerName}</p>
            <p><strong>Phone:</strong> ${orderData.customerPhone}</p>
            <p><strong>Address:</strong> ${orderData.customerAddress}, ${orderData.city}</p>
            <p><strong>Total Amount:</strong> Rs. ${orderData.totalAmount}</p>
            <h3>Items:</h3>
            <ul>
                ${orderData.items.map(i => `<li>${i.name} x ${i.qty || i.quantity || 1} (Rs. ${(i.price || 0) * (i.qty || i.quantity || 1)})</li>`).join('')}
            </ul>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Admin email sent successfully!');
    } catch (error) {
        console.error('❌ Email sending failed:', error);
    }
}

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

        // 🚀 CALL EMAIL FUNCTION HERE AFTER SAVING ORDER
        await sendAdminEmail(newOrder);

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