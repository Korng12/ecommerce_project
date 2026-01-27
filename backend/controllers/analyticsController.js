// backend/controllers/analyticsController.js
const db = require("../models/index.js");
const { Op } = require("sequelize");

const sequelize = db.sequelize; // Get the sequelize instance from models
const Order = db.order;
const OrderItem = db.orderItem;
const Product = db.product;
const Cart = db.cart;
const CartItem = db.cartItem;
const Category = db.category;
const Brand = db.brand;
const User = db.user;

// Get key metrics (Total Revenue, Orders, Users, Cart Abandonment)
const getKeyMetrics = async (req, res) => {
  try {
    // Total Revenue from paid orders
    const totalRevenueData = await Order.findAll({
      where: { status: "paid" },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalRevenue"],
      ],
      raw: true,
    });

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    // Total Orders (paid)
    const totalOrders = await Order.count({
      where: { status: "paid" },
    });

    // Total Users with at least one paid order
    const totalUsers = await sequelize.query(
      `SELECT COUNT(DISTINCT userId) AS count FROM orders WHERE status = 'paid'`,
      { type: sequelize.QueryTypes.SELECT },
    );
    const userCount = totalUsers[0]?.count || 0;

    // Cart Abandonment Rate
    const totalCarts = await Cart.count();
    const completedCarts = await Cart.count({ where: { status: "completed" } });
    const abandonedCarts = totalCarts - completedCarts;
    const abandonmentRate =
      totalCarts > 0 ? ((abandonedCarts / totalCarts) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalRevenue: parseFloat(totalRevenue),
      totalOrders,
      totalUsers: userCount,
      cartAbandonmentRate: parseFloat(abandonmentRate),
    });
  } catch (err) {
    console.error("getKeyMetrics error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Top Performing Products
const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await sequelize.query(
      `SELECT 
        p.id,
        p.name,
        COALESCE(SUM(oi.quantity), 0) as totalSales,
        COALESCE(SUM(CAST(oi.price AS DECIMAL(10,2)) * oi.quantity), 0) as totalRevenue
      FROM products p
      INNER JOIN orderItems oi ON p.id = oi.productId
      INNER JOIN orders o ON oi.orderId = o.id AND o.status = 'paid'
      GROUP BY p.id, p.name
      ORDER BY totalSales DESC
      LIMIT ?`,
      {
        replacements: [limit],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Calculate growth (for now, using mock data - can be enhanced)
    const productsWithGrowth = topProducts.map((product, index) => ({
      id: product.id,
      name: product.name,
      sales: parseInt(product.totalSales) || 0,
      revenue: `$${(parseFloat(product.totalRevenue) || 0).toFixed(2)}`,
      growth: 15 - index * 3, // Mock growth for demo
    }));

    res.status(200).json(productsWithGrowth);
  } catch (err) {
    console.error("getTopProducts error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Revenue by Category
const getRevenueByCategory = async (req, res) => {
  try {
    const categoryRevenue = await sequelize.query(
      `SELECT 
        c.id,
        c.name,
        COALESCE(SUM(oi.quantity), 0) as totalSales,
        COALESCE(SUM(CAST(oi.price AS DECIMAL(10,2)) * oi.quantity), 0) as totalRevenue
      FROM categories c
      LEFT JOIN products p ON c.id = p.categoryId
      LEFT JOIN orderItems oi ON p.id = oi.productId
      LEFT JOIN orders o ON oi.orderId = o.id AND o.status = 'paid'
      GROUP BY c.id, c.name
      ORDER BY totalRevenue DESC`,
      { type: sequelize.QueryTypes.SELECT },
    );

    const result = categoryRevenue.map((cat) => ({
      name: cat.name,
      sales: parseInt(cat.totalSales) || 0,
      revenue: parseFloat(cat.totalRevenue) || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getRevenueByCategory error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Revenue by Brand
const getRevenueByBrand = async (req, res) => {
  try {
    const brandRevenue = await sequelize.query(
      `SELECT 
        b.id,
        b.name,
        COALESCE(SUM(oi.quantity), 0) as totalSales,
        COALESCE(SUM(CAST(oi.price AS DECIMAL(10,2)) * oi.quantity), 0) as totalRevenue
      FROM brands b
      LEFT JOIN products p ON b.id = p.brandId
      LEFT JOIN orderItems oi ON p.id = oi.productId
      LEFT JOIN orders o ON oi.orderId = o.id AND o.status = 'paid'
      GROUP BY b.id, b.name
      ORDER BY totalRevenue DESC`,
      { type: sequelize.QueryTypes.SELECT },
    );

    const result = brandRevenue.map((brand) => ({
      name: brand.name,
      sales: parseInt(brand.totalSales) || 0,
      revenue: parseFloat(brand.totalRevenue) || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getRevenueByBrand error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Revenue Trend (last 6 months)
const getRevenueTrend = async (req, res) => {
  try {
    const revenueTrend = await sequelize.query(
      `SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COALESCE(SUM(totalAmount), 0) as revenue
      FROM orders
      WHERE status = 'paid' AND createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const result = revenueTrend.map((item) => ({
      month: item.month,
      revenue: parseFloat(item.revenue) || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getRevenueTrend error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get Daily Orders (last 7 days)
const getDailyOrders = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyOrders = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "orders"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "revenue"],
      ],
      where: {
        status: "paid",
        createdAt: { [Op.gte]: sevenDaysAgo },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.literal("date"), "ASC"]],
      raw: true,
    });

    const result = dailyOrders.map((item) => ({
      date: item.date,
      orders: parseInt(item.orders) || 0,
      revenue: parseFloat(item.revenue) || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getDailyOrders error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getKeyMetrics,
  getTopProducts,
  getRevenueByCategory,
  getRevenueByBrand,
  getRevenueTrend,
  getDailyOrders,
};
