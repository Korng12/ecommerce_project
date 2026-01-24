const express = require('express');
const router = express.Router();

const productController = require('../../controllers/productController');
const upload = require('../../middleware/upload');

router.post(
  '/products',
  upload.single('image'),
  productController.createProduct
);

router.put(
  '/products/:id',
  upload.single('image'),
  productController.updateProduct
);

router.get('/products', productController.getAllProducts);

module.exports = router;
