const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const upload = require('../../middleware/upload'); // multer

// GET
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);

// CREATE (with image)
router.post(
  '/products',
  upload.single('image'),
  productController.createProduct
);

// UPDATE (with image)
router.put(
  '/products/:id',
  upload.single('image'),
  productController.updateProduct
);

// ✅ DELETE (THIS FIXES YOUR ERROR)
router.delete('/products/:id', productController.deleteProduct);

router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/products/brand/:brandId', productController.getProductsByBrand);

module.exports = router;
