const db = require('../models/index.js');
const { Op } = require('sequelize');
const Category = db.category;
const Product = db.product;
const path = require('path');
const fs = require('fs');

// ================= GET ALL CATEGORIES =================
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product,
        as: 'products',
        include: [
          {
            model: db.brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      }],
      order: [['name', 'ASC']]
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= GET SINGLE CATEGORY =================
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        include: [
          {
            model: db.brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      }]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= CREATE CATEGORY =================
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : null;
    
    // Check for existing category with the same name
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      // Clean up uploaded file if name already exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Category name already exists' });
    }
    const category = await Category.create({
      name,
      description: description || null,
      image: imagePath
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= UPDATE CATEGORY =================
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      // Clean up uploaded file if category not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description } = req.body;
    const updateData = {};

    // Update name if provided
    if (name) {
      // Check if new name is unique
      const existingCategory = await Category.findOne({ 
        where: { name, id: { [Op.ne]: req.params.id } }
      });
      if (existingCategory) {
        // Clean up uploaded file if name already exists
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: 'Category name already exists' });
      }
      updateData.name = name;
    }

    // Update description if provided
    if (description !== undefined) {
      updateData.description = description || null;
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'categories', path.basename(category.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      // Store new image path
      updateData.image = `/uploads/categories/${req.file.filename}`;
    }

    await category.update(updateData);

    res.status(200).json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= DELETE CATEGORY =================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.count({ where: { categoryId: category.id } });
    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products',
        productCount 
      });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= GET CATEGORY STATS =================
const getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: [
        'id',
        'name',
        [db.sequelize.fn('COUNT', db.sequelize.col('products.id')), 'productCount'],
        [db.sequelize.fn('AVG', db.sequelize.col('products.price')), 'averagePrice']
      ],
      include: [{
        model: Product,
        as: 'products',
        attributes: []
      }],
      group: ['Category.id'],
      raw: true
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
};