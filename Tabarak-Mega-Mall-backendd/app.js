const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Imports
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
    try {
        console.log("⏳ Connecting to MongoDB Atlas Cloud...");
        
        // Connect to MongoDB Atlas
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fast timeout agar network/credentials issue ho
        });
        
        console.log('✅ MongoDB Atlas Connected Successfully!');

        app.listen(PORT, () => {
            console.log(`🚀 Express Server running on http://localhost:5000`);
        });

    } catch (err) {
        console.error('❌ MongoDB Connection Error Details:', err.message);
        console.log('💡 Tip: Check if your MONGO_URI password is correct or if your internet is blocking Atlas.');
    }
}

startServer();