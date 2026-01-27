const express = require("express");
const router = express.Router();

const productController = require("../../controllers/productController");
const upload = require("../../middleware/upload"); // function

router.post(
  "/products",
  upload("/products").single("image"), // ✅ CORRECT
  productController.createProduct
);

// UPDATE PRODUCT
router.put(
  "/products/:id",
  upload("/products").single("image"),
  productController.updateProduct
);

// DELETE PRODUCT
router.delete(
  "/products/:id",
  productController.deleteProduct
);

// GET
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.get("/products/low-stock", productController.getLowStockProducts);

module.exports = router;
