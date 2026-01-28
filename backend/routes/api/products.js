const express = require("express");
const router = express.Router();

const productController = require("../../controllers/productController");
const upload = require("../../middleware/upload");

// CREATE PRODUCT
router.post(
  "/products",
  upload("products").single("image"), // ✅ NO SLASH
  productController.createProduct
);

// UPDATE PRODUCT
router.put(
  "/products/:id",
  upload("products").single("image"), // ✅ NO SLASH
  productController.updateProduct
);

// DELETE PRODUCT
router.delete(
  "/products/:id",
  productController.deleteProduct
);

// GET ALL
router.get("/products", productController.getAllProducts);

// GET ONE
router.get("/products/:id", productController.getProductById);

module.exports = router;
