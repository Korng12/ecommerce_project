const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const verifyJWT = require('../../middleware/authJwt'); // Add auth!
const cart = require('../../models/cart');

// Protect routes with JWT
router.get('/carts', verifyJWT, cartController.getCartByUserId);
router.post('/carts/add/', verifyJWT, cartController.AddToCart);
router.patch('/carts/update',verifyJWT,cartController.updateCartItem);
router.delete('/carts/remove',verifyJWT,cartController.removeFromCart);
router.delete('/carts/clear',verifyJWT,cartController.clearCart);
module.exports = router;