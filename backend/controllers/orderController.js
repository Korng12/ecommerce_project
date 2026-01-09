const db = require('../models');
const { Op } = require('sequelize');

exports.getAllOrders = async (req, res) => {
  try {
    const { 
      status, 
      user_id,
      start_date, 
      end_date,
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    const whereClause = {};
    const include = [{
      model: db.User,
      attributes: ['id', 'username', 'email']
    }, {
      model: db.Transaction,
      attributes: ['id', 'payment_method', 'status', 'transaction_id']
    }];

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // User filter
    if (user_id) {
      whereClause.user_id = user_id;
    }

    // Date range filter
    if (start_date || end_date) {
      whereClause.createdAt = {};
      if (start_date) whereClause.createdAt[Op.gte] = new Date(start_date);
      if (end_date) whereClause.createdAt[Op.lte] = new Date(end_date);
    }

    // Search filter
    if (search) {
      include[0].where = {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await db.Order.findAndCountAll({
      where: whereClause,
      include,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
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

exports.getOrderById = async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.id, {
      include: [{
        model: db.User,
        attributes: ['id', 'username', 'email']
      }, {
        model: db.OrderItem,
        include: [{
          model: db.Product,
          attributes: ['id', 'name', 'image_url', 'price']
        }]
      }, {
        model: db.Transaction,
        attributes: ['id', 'payment_method', 'status', 'transaction_id', 'amount', 'createdAt']
      }]
    });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { status, notes } = req.body;
    const orderId = req.params.id;
    
    const order = await db.Order.findByPk(orderId, { 
      transaction,
      include: [{
        model: db.OrderItem,
        include: [db.Product]
      }]
    });
    
    if (!order) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;

    // If order is failed, restore stock
    if (oldStatus !== 'failed' && status === 'failed') {
      for (const orderItem of order.OrderItems) {
        const product = await db.Product.findByPk(orderItem.product_id, { transaction });
        if (product) {
          product.stock += orderItem.quantity;
          await product.save({ transaction });
        }
      }
    }

    // If order was failed and now success, deduct stock
    if (oldStatus === 'failed' && status === 'success') {
      for (const orderItem of order.OrderItems) {
        const product = await db.Product.findByPk(orderItem.product_id, { transaction });
        if (product) {
          if (product.stock < orderItem.quantity) {
            await transaction.rollback();
            return res.status(400).json({ 
              error: 'Insufficient stock to process order' 
            });
          }
          product.stock -= orderItem.quantity;
          await product.save({ transaction });
        }
      }
    }

    await order.save({ transaction });
    await transaction.commit();

    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Order counts
    const totalOrders = await db.Order.count();
    
    const todaysOrders = await db.Order.count({
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

    const thisMonthOrders = await db.Order.count({
      where: { createdAt: { [Op.gte]: thisMonth } }
    });

    // Revenue
    const totalRevenue = await db.Order.sum('total_amount') || 0;
    const todayRevenue = await db.Order.sum('total_amount', {
      where: { createdAt: { [Op.gte]: today } }
    }) || 0;

    const thisMonthRevenue = await db.Order.sum('total_amount', {
      where: { createdAt: { [Op.gte]: thisMonth } }
    }) || 0;

    // Status counts
    const statusCounts = await db.Order.findAll({
      attributes: [
        'status',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'revenue']
      ],
      group: ['status'],
      raw: true
    });

    // Top products
    const topProducts = await db.OrderItem.findAll({
      attributes: [
        'product_id',
        [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_sold'],
        [db.sequelize.fn('SUM', db.sequelize.literal('quantity * price')), 'revenue']
      ],
      include: [{
        model: db.Product,
        attributes: ['name', 'image_url']
      }],
      group: ['product_id'],
      order: [[db.sequelize.literal('total_sold'), 'DESC']],
      limit: 10
    });

    // Daily sales for last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const dailySales = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'order_count'],
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
          total_orders: totalOrders,
          todays_orders: todaysOrders,
          yesterdays_orders: yesterdayOrders,
          this_month_orders: thisMonthOrders,
          total_revenue: totalRevenue,
          today_revenue: todayRevenue,
          this_month_revenue: thisMonthRevenue
        },
        status_counts: statusCounts.reduce((acc, curr) => {
          acc[curr.status] = {
            count: parseInt(curr.count),
            revenue: parseFloat(curr.revenue) || 0
          };
          return acc;
        }, {}),
        top_products: topProducts,
        daily_sales: dailySales
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { 
      user_id, 
      items, 
      payment_method = 'cash',
      shipping_address 
    } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Check stock and calculate total
    for (const item of items) {
      const product = await db.Product.findByPk(item.product_id, { transaction });
      
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ 
          error: `Product not found: ${item.product_id}` 
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `Insufficient stock for product: ${product.name}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = await db.Order.create({
      user_id,
      total_amount: totalAmount,
      status: 'pending'
    }, { transaction });

    // Create order items and update stock
    for (const item of orderItems) {
      await db.OrderItem.create({
        order_id: order.id,
        ...item
      }, { transaction });

      // Update product stock
      const product = await db.Product.findByPk(item.product_id, { transaction });
      product.stock -= item.quantity;
      await product.save({ transaction });
    }

    // Create transaction
    const transactionRecord = await db.Transaction.create({
      order_id: order.id,
      amount: totalAmount,
      payment_method,
      status: 'pending',
      transaction_id: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: {
        order,
        transaction: transactionRecord
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const orderId = req.params.order_id;
    const { status, transaction_id } = req.body;

    const transactionRecord = await db.Transaction.findOne({
      where: { order_id: orderId },
      transaction
    });

    if (!transactionRecord) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transactionRecord.status = status;
    if (transaction_id) {
      transactionRecord.transaction_id = transaction_id;
    }

    await transactionRecord.save({ transaction });

    // Update order status if payment is successful
    if (status === 'success') {
      await db.Order.update(
        { status: 'success' },
        { where: { id: orderId }, transaction }
      );
    }

    await transaction.commit();

    res.json({
      success: true,
      data: transactionRecord,
      message: 'Transaction status updated'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};