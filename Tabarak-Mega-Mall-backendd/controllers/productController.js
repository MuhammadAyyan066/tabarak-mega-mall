const Product = require('../models/Product');

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
};

// Add New Product
exports.addProduct = async (req, res) => {
    try {
        const { name, category, price, oldPrice, image } = req.body;
        const newProduct = new Product({ name, category, price, oldPrice: oldPrice || null, image });
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (err) {
        res.status(400).json({ message: 'Error adding product', error: err.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
    } catch (err) {
        res.status(400).json({ message: 'Error updating product', error: err.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found!' });
        }
        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting product', error: err.message });
    }
};