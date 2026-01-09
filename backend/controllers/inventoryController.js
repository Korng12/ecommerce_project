const db = require('../models');
const { Op } = require('sequelize');

exports.getInventory = async (req, res) => {
  try {
    const { 
      low_stock, 
      out_of_stock,
      category_id,
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    const whereClause = {};
    const include = [{
      model: db.Category,
      attributes: ['id', 'name']
    }];

    // Low stock filter
    if (low_stock === 'true') {
      whereClause.stock = {
        [Op.lt]: 10,
        [Op.gt]: 0
      };
    }

    // Out of stock filter
    if (out_of_stock === 'true') {
      whereClause.stock = 0;
    }

    // Category filter
    if (category_id) {
      whereClause.category_id = category_id;
    }

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await db.Product.findAndCountAll({
      where: whereClause,
      include,
      order: [
        ['stock', 'ASC'],
        ['name', 'ASC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add stock status
    const productsWithStatus = rows.map(product => {
      let stock_status = 'in_stock';
      if (product.stock === 0) {
        stock_status = 'out_of_stock';
      } else if (product.stock < 10) {
        stock_status = 'low_stock';
      }
      
      return {
        ...product.toJSON(),
        stock_status,
        total_value: product.price * product.stock
      };
    });

    res.json({
      success: true,
      data: productsWithStatus,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { product_id, quantity, action, reason } = req.body;
    
    const product = await db.Product.findByPk(product_id, { transaction });
    
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    const oldStock = product.stock;
    let newStock;

    switch (action) {
      case 'add':
        newStock = oldStock + quantity;
        break;
      case 'subtract':
        if (oldStock < quantity) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: 'Insufficient stock available' 
          });
        }
        newStock = oldStock - quantity;
        break;
      case 'set':
        if (quantity < 0) {
          await transaction.rollback();
          return res.status(400).json({ 
            error: 'Stock cannot be negative' 
          });
        }
        newStock = quantity;
        break;
      default:
        await transaction.rollback();
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Update stock
    product.stock = newStock;
    await product.save({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      data: {
        product_id,
        product_name: product.name,
        old_stock: oldStock,
        new_stock: newStock,
        difference: newStock - oldStock,
        action
      },
      message: 'Stock updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getStockAlerts = async (req, res) => {
  try {
    const lowStockProducts = await db.Product.findAll({
      where: {
        stock: {
          [Op.lt]: 10,
          [Op.gt]: 0
        }
      },
      include: [{
        model: db.Category,
        attributes: ['name']
      }],
      order: [['stock', 'ASC']],
      limit: 20
    });

    const outOfStockProducts = await db.Product.findAll({
      where: { stock: 0 },
      include: [{
        model: db.Category,
        attributes: ['name']
      }],
      limit: 20
    });

    res.json({
      success: true,
      data: {
        low_stock: lowStockProducts,
        out_of_stock: outOfStockProducts,
        alerts: {
          low_stock_count: lowStockProducts.length,
          out_of_stock_count: outOfStockProducts.length,
          total_alerts: lowStockProducts.length + outOfStockProducts.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInventoryStats = async (req, res) => {
  try {
    // Total products
    const totalProducts = await db.Product.count();
    
    // Total inventory value
    const inventoryValue = await db.Product.findOne({
      attributes: [
        [db.sequelize.fn('SUM', db.sequelize.literal('price * stock')), 'total_value']
      ],
      raw: true
    });

    // Stock counts
    const lowStockCount = await db.Product.count({
      where: {
        stock: {
          [Op.lt]: 10,
          [Op.gt]: 0
        }
      }
    });

    const outOfStockCount = await db.Product.count({
      where: { stock: 0 }
    });

    const inStockCount = totalProducts - outOfStockCount;

    // Category stats
    const categoryStats = await db.Product.findAll({
      attributes: [
        'category_id',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'product_count'],
        [db.sequelize.fn('SUM', db.sequelize.col('stock')), 'total_stock']
      ],
      include: [{
        model: db.Category,
        attributes: ['name']
      }],
      group: ['category_id']
    });

    res.json({
      success: true,
      data: {
        overview: {
          total_products: totalProducts,
          total_value: inventoryValue.total_value || 0,
          low_stock_count: lowStockCount,
          out_of_stock_count: outOfStockCount,
          in_stock_count: inStockCount
        },
        category_stats: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};