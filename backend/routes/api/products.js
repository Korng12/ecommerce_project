
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const categoryController = require('../../controllers/categoryController');
const brandController = require('../../controllers/brandController');

// Product Routes
router.get('/products', productController.getAllProducts);
router.get('/products/low-stock', productController.getLowStockProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/products/brand/:brandId', productController.getProductsByBrand);


module.exports = router;
