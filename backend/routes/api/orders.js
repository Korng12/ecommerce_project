const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const verifyJWT = require('../../middleware/authJwt'); 

router.post('/orders/create', verifyJWT, orderController.createOrderFromCart);

module.exports = router;