const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categoryController');
const  singleFileUpload  = require('../../middleware/upload');

// Category Routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', singleFileUpload('categories').single('image'), categoryController.createCategory);
router.put('/categories/:id', singleFileUpload('categories').single('image'), categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;