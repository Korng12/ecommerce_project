const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const  singleFileUpload  = require('../../middleware/upload');
const verifyRole = require('../../middleware/verifyRoles');
const verifyJwt = require('../../middleware/authJwt');
// Category Routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories',verifyJwt, verifyRole(1), singleFileUpload('categories').single('image'), categoryController.createCategory);
router.put('/categories/:id', verifyJwt, verifyRole(1), singleFileUpload('categories').single('image'), categoryController.updateCategory);
router.delete('/categories/:id', verifyJwt, verifyRole(1), categoryController.deleteCategory);

module.exports = router;