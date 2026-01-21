
const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const categoryController = require('../../controllers/categoryController');
const brandController = require('../../controllers/brandController');

// Product Routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/products/brand/:brandId', productController.getProductsByBrand);


// Category Routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Brand Routes
router.get('/brands', brandController.getAllBrands);
router.get('/brands/:id', brandController.getBrandById);
router.post('/brands', brandController.createBrand);
router.put('/brands/:id', brandController.updateBrand);
router.delete('/brands/:id', brandController.deleteBrand);

module.exports = router;
