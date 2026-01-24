const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const verifyJWT = require('../../middleware/authJwt');
const verifyRole = require('../../middleware/verifyRoles');

router.post('/orders/create', verifyJWT, orderController.createOrderFromCart);
router.get('/orders', verifyJWT, orderController.getAllOrders);
router.get('/orders/admin/all', verifyJWT, verifyRole(1), orderController.getAllOrdersAdmin);

module.exports = router;