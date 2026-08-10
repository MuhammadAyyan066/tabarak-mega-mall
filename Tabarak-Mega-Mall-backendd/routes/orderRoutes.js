const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST: Create Order
router.post('/', orderController.createOrder);

// GET: Fetch All Orders (Admin)
router.get('/', orderController.getAllOrders);

// PUT: Update Order Status
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;