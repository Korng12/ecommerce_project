const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const verifyJwt = require('../middleware/authJwt')

router.get('/', verifyJwt, userController.getUsers)
router.post('/', verifyJwt, userController.createUser)
router.put('/:id', verifyJwt, userController.updateUser)
router.delete('/:id', verifyJwt, userController.deleteUser)

module.exports = router
