const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');
const verifyAdminToken = require('../middleware/auth');

// Public route to view products
router.get('/', getAllProducts);

// Protected routes (JWT required)
router.post('/', verifyAdminToken, addProduct);
router.put('/:id', verifyAdminToken, updateProduct);
router.delete('/:id', verifyAdminToken, deleteProduct);

module.exports = router;