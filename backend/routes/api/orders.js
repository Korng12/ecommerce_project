const express = require("express");
const router = express.Router();
const orderController = require("../../controllers/orderController");
const verifyJWT = require("../../middleware/authJwt");
const verifyRole = require("../../middleware/verifyRoles");

router.post("/orders/create", verifyJWT, orderController.createOrderFromCart);
router.get("/orders", verifyJWT, orderController.getAllOrders);
router.get("/orders/:orderId/receipt", verifyJWT, orderController.getReceipt);
// Allow user to reopen a completed cart after payment if needed
router.post("/orders/reactivate", verifyJWT, orderController.reactivateCart);
// Cancel pending order and reactivate cart (when user leaves checkout)
router.post("/orders/abandon", verifyJWT, orderController.abandonPendingOrder);
router.get(
  "/orders/admin/all",
  verifyJWT,
  verifyRole(1),
  orderController.getAllOrdersAdmin,
);

module.exports = router;
