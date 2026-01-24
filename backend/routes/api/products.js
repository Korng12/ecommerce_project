const express = require('express');
const router = express.Router();

const productController = require('../../controllers/productController');
const upload = require('../../middleware/upload');

// Create Product
router.post(
  '/products',
  upload.single('image'),
  productController.createProduct
);

// Update Product
router.put(
  '/products/:id',
  upload.single('image'),
  productController.updateProduct
);

// Delete Product
router.delete(
  '/products/:id',
  productController.deleteProduct
);

// Get Products by Category
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);

module.exports = router;
