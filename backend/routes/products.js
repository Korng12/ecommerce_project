const express = require('express')
const router = express.Router()
const controller = require('../controllers/productController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRole = require('../middleware/verifyRole')

// GET products
router.get('/', verifyJWT, controller.getAllProducts)

// ADMIN only
router.post('/', verifyJWT, verifyRole(1), controller.createProduct)
router.put('/:id', verifyJWT, verifyRole(1), controller.updateProduct)
router.delete('/:id', verifyJWT, verifyRole(1), controller.deleteProduct)

module.exports = router
