const express = require("express");
const router = express.Router();

const productController = require("../../controllers/productController");
const upload = require("../../middleware/upload"); // function

router.post(
  "/products",
  upload("/products").single("image"), // ✅ CORRECT
  productController.createProduct,
);

// UPDATE PRODUCT
router.put(
  "/products/:id",
  upload("/products").single("image"),
  productController.updateProduct,
);

// DELETE PRODUCT
router.delete("/products/:id", productController.deleteProduct);

// GET - IMPORTANT: specific routes must come before parameterized routes
router.get("/products/low-stock", productController.getLowStockProducts);
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);

module.exports = router;
