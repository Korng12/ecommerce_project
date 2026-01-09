const db = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Get counts
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories
    ] = await Promise.all([
      db.User.count(),
      db.Product.count(),
      db.Order.count(),
      db.Category.count()
    ]);

    // Revenue calculations
    const totalRevenue = await db.Order.sum('total_amount') || 0;
    const todayRevenue = await db.Order.sum('total_amount', {
      where: { createdAt: { [Op.gte]: today } }
    }) || 0;
    
    const yesterdayRevenue = await db.Order.sum('total_amount', {
      where: { 
        createdAt: { 
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    }) || 0;

    const revenueChange = yesterdayRevenue > 0 
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(2)
      : todayRevenue > 0 ? 100 : 0;

    // Order counts
    const todayOrders = await db.Order.count({
      where: { createdAt: { [Op.gte]: today } }
    });
    
    const yesterdayOrders = await db.Order.count({
      where: { 
        createdAt: { 
          [Op.gte]: yesterday,
          [Op.lt]: today
        }
      }
    });

    const orderChange = yesterdayOrders > 0 
      ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100).toFixed(2)
      : todayOrders > 0 ? 100 : 0;

    // Inventory alerts
    const lowStockProducts = await db.Product.count({
      where: {
        stock: {
          [Op.lt]: 10,
          [Op.gt]: 0
        }
      }
    });

    const outOfStockProducts = await db.Product.count({
      where: { stock: 0 }
    });

    // Recent orders
    const recentOrders = await db.Order.findAll({
      include: [{
        model: db.User,
        attributes: ['username', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Top products
    const topProducts = await db.OrderItem.findAll({
      attributes: [
        'product_id',
        [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_sold'],
        [db.sequelize.fn('SUM', db.sequelize.literal('quantity * price')), 'total_revenue']
      ],
      include: [{
        model: db.Product,
        attributes: ['name', 'price', 'image_url']
      }],
      group: ['product_id'],
      order: [[db.sequelize.literal('total_sold'), 'DESC']],
      limit: 5
    });

    // Sales chart data
    const salesData = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orders'],
        [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'revenue']
      ],
      where: {
        createdAt: { [Op.gte]: last7Days }
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        overview: {
          total_users: totalUsers,
          total_products: totalProducts,
          total_orders: totalOrders,
          total_categories: totalCategories,
          total_revenue: totalRevenue,
          today_revenue: todayRevenue,
          revenue_change: parseFloat(revenueChange),
          today_orders: todayOrders,
          order_change: parseFloat(orderChange),
          low_stock_products: lowStockProducts,
          out_of_stock_products: outOfStockProducts
        },
        recent_orders: recentOrders,
        top_products: topProducts,
        sales_chart: salesData
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};