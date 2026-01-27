const db = require('../models/index.js');
const Brand = db.brand;
const Product=db.product;

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price'],
        limit: 5
      }]
    });
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        include: [{
          model: db.category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      }]
    });
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    
    const brand = await Brand.create({ name, description, logo });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    
    await brand.update(req.body);
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    
    await brand.destroy();
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand };