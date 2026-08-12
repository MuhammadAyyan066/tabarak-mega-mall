const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// 1. Fixed CORS Policy
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express 5 compatible wildcard options
app.options(/(.*)/, cors());

// 2. Body Parsers
app.use(express.json({ limit: '10mb' }));
// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`📥 Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Connect MongoDB
connectDB();

// 4. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Tabarak Mega Mall Backend API is Live & Running!' 
  });
});

// 5. Port & Host Assignment (CRITICAL FOR RAILWAY)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express Server running on port ${PORT}`);
});