const express = require('express')
const router = express.Router()
const controller = require('../controllers/productController')
const verifyJWT = require('../middleware/verifyJWT')
const roleCheck = require('../middleware/roleCheck')

// GET products
router.get('/', verifyJWT, controller.getAll)

// ADMIN only
router.post('/', verifyJWT, roleCheck('ADMIN'), controller.create)
router.put('/:id', verifyJWT, roleCheck('ADMIN'), controller.update)
router.delete('/:id', verifyJWT, roleCheck('ADMIN'), controller.remove)

module.exports = router
