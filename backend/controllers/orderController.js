// backend/controllers/orderController.js
const db = require("../models/index.js");
const { Op } = require("sequelize");

const Cart = db.cart;
const CartItem = db.cartItem;
const Product = db.product;

const transaction = db.transaction;
const Order = db.order;
const OrderItem = db.orderItem;

// Cancel pending orders that are older than the provided window (default: 30 minutes)
const cancelStalePendingOrders = async (minutes = 30) => {
  const cutoff = new Date(Date.now() - minutes * 60 * 1000);
  await Order.update(
    { status: "cancelled" },
    {
      where: {
        status: "pending",
        updatedAt: { [Op.lt]: cutoff },
      },
    },
  );
};

const createOrderFromCart = async (req, res) => {
  const userId = req.user.id;

  const t = await db.sequelize.transaction();
  try {
    const cart = await Cart.findOne({
      where: { userId, status: "active" },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await t.rollback();
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // Calculate total from DB prices (never trust client)
    let total = 0;
    for (const item of cart.items) {
      const product = item.product;
      if (!product) throw new Error("CartItem missing product association");

      const qty = Number(item.quantity);
      const price = Number(product.price);

      if (!Number.isFinite(qty) || qty < 1) throw new Error("Invalid quantity");
      if (!Number.isFinite(price) || price < 0)
        throw new Error("Invalid product price");

      // Optional stock check
      if (product.stock != null && Number(product.stock) < qty) {
        await t.rollback();
        return res
          .status(400)
          .json({ msg: `Not enough stock for ${product.name}` });
      }

      total += price * qty;
    }

    // Create order (pending)
    const order = await Order.create(
      {
        userId,
        totalAmount: total,
        status: "pending",
      },
      { transaction: t },
    );

    // Snapshot order items (price at purchase time)
    const orderItems = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Don't mark cart as completed yet - wait for payment success
    // Cart will be marked completed in the payment webhook

    await t.commit();

    return res.status(201).json({
      orderId: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
    });
  } catch (err) {
    await t.rollback();
    console.error("createOrderFromCart error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Allow user to reactivate a cart if they backed out or cancelled before payment
const reactivateCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ where: { userId, status: "completed" } });
    if (!cart) {
      return res.status(404).json({ msg: "No completed cart to reactivate" });
    }

    await cart.update({ status: "active" });
    return res
      .status(200)
      .json({ msg: "Cart reactivated", cartId: cart.id, status: cart.status });
  } catch (err) {
    console.error("reactivateCart error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Cancel a pending order and reactivate the cart (when user leaves checkout)
const abandonPendingOrder = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  try {
    if (!orderId) {
      return res.status(400).json({ msg: "Missing orderId" });
    }

    // Verify order belongs to user and is still pending
    const order = await Order.findOne({
      where: { id: orderId, userId, status: "pending" },
    });

    if (!order) {
      return res.status(404).json({
        msg: "Pending order not found or already processed",
      });
    }

    // Mark order as cancelled
    await order.update({ status: "cancelled" });

    // Reactivate the cart so user can checkout again later
    const cart = await Cart.findOne({ where: { userId } });
    if (cart && cart.status !== "active") {
      // Restore cart items if they were cleared
      const cartItems = await CartItem.findAll({ where: { cartId: cart.id } });
      if (cartItems.length === 0) {
        // Cart items were cleared, need to restore from order items
        const orderItems = await OrderItem.findAll({ where: { orderId } });
        const itemsToRestore = orderItems.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        }));

        if (itemsToRestore.length > 0) {
          await CartItem.bulkCreate(itemsToRestore);
        }
      }

      await cart.update({ status: "active" });
    }

    return res.status(200).json({
      msg: "Order cancelled and cart reactivated",
      orderId: order.id,
      orderStatus: order.status,
    });
  } catch (err) {
    console.error("abandonPendingOrder error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    await cancelStalePendingOrders();

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "orderProduct" }],
        },
        {
          model: transaction,
          as: "orderTransactions",
          attributes: ["id", "paymentMethod", "status", "totalAmount"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("getAllOrders error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    await cancelStalePendingOrders();

    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "orderProduct" }],
        },
        {
          model: db.user,
          as: "userOrder",
          attributes: ["id", "username", "email"],
        },
        {
          model: transaction,
          as: "orderTransactions",
          attributes: ["id", "paymentMethod", "status", "totalAmount"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("getAllOrdersAdmin error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get receipt data for an order
const getReceipt = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  try {
    if (!orderId) {
      return res.status(400).json({ msg: "Missing orderId" });
    }

    // Fetch order with all details
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [{ model: Product, as: "orderProduct" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Fetch user info
    const User = db.user;
    const user = await User.findOne({ where: { id: userId } });

    // Fetch transaction info
    const Transaction = db.transaction;
    const transaction = await Transaction.findOne({ where: { orderId } });

    // Format receipt data
    const receipt = {
      orderId: order.id,
      orderDate: order.createdAt,
      orderStatus: order.status,
      customer: {
        name: user.username,
        email: user.email,
      },
      items: order.orderItems.map((item) => ({
        productId: item.productId,
        productName: item.orderProduct.name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.price) * item.quantity,
      })),
      summary: {
        subtotal: order.orderItems.reduce(
          (sum, item) => sum + parseFloat(item.price) * item.quantity,
          0,
        ),
        tax:
          order.orderItems.reduce(
            (sum, item) => sum + parseFloat(item.price) * item.quantity,
            0,
          ) * 0.08,
        total: parseFloat(order.totalAmount),
      },
      payment: {
        method: transaction?.paymentMethod || "card",
        status: transaction?.status || "pending",
        transactionId: transaction?.id,
      },
    };

    return res.json(receipt);
  } catch (err) {
    console.error("getReceipt error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createOrderFromCart,
  reactivateCart,
  abandonPendingOrder,
  getAllOrders,
  getAllOrdersAdmin,
  getReceipt,
};
