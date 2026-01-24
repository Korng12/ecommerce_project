const db = require('../models/index.js');
const Category = db.category;
const Product = db.product;

// ================= GET ALL CATEGORIES =================
// const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll({
//       include: [{
//         model: Product,
//         as: 'products',
//         attributes: ['id', 'name', 'price'],
//         limit: 5
//       }],
//       order: [['name', 'ASC']]
//     });
//     res.json(categories);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
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
    res.json(categories);
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
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= CREATE CATEGORY =================
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      image
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= UPDATE CATEGORY =================
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update(req.body);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
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
    res.json({ message: 'Category deleted successfully' });
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

    res.json(categories);
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