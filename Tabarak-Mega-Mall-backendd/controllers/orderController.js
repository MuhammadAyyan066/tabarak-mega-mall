const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Transporter setup for Email
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

// Send WhatsApp Notification Function (UltraMsg)
async function sendWhatsAppNotification(orderData) {
    const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;
    
    const phoneClean = orderData.customerPhone ? orderData.customerPhone.replace(/[^0-9]/g, '') : '';
    const recipientPhone = phoneClean.startsWith('92') ? phoneClean : `92${phoneClean.startsWith('0') ? phoneClean.substring(1) : phoneClean}`;

    const message = `🚀 *New Order Placed - Tabarak Mega Mall*\n\n` +
                    `Order ID: #${orderData._id.toString().slice(-6)}\n` +
                    `Name: ${orderData.customerName}\n` +
                    `Phone: ${orderData.customerPhone}\n` +
                    `Address: ${orderData.customerAddress}, ${orderData.city}\n` +
                    `Total: Rs. ${orderData.totalAmount}\n\n` +
                    `Thank you for shopping with us!`;

    try {
        const response = await axios.post(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
            token: token,
            to: recipientPhone,
            body: message
        });
        console.log('📱 WhatsApp message sent:', response.data);
    } catch (error) {
        console.error('❌ WhatsApp sending failed:', error.response?.data || error.message);
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

        // 1. Order Save Karein Database Mein
        await newOrder.save();

        // 2. Email aur WhatsApp Notifications Send Karein
        await sendAdminEmail(newOrder);          // Email notification
        await sendWhatsAppNotification(newOrder); // WhatsApp notification

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