const { stripe } = require("../config/stripe.js");
const db = require("../models/index.js");

const {
  transaction: Transaction,
  order: Order,
  orderItem: OrderItem,
  product: Product,
  cart: Cart,
  cartItem: CartItem,
} = db;

const createPaymentIntent = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  try {
    if (!orderId) return res.status(400).json({ msg: "Missing orderId" });

    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (order.status === "success") {
      return res.status(400).json({ msg: "Order already paid" });
    }

    const total = Number(order.totalAmount);
    const amountInCents = Math.round(total * 100); // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { orderId: order.id.toString(), userId: userId.toString() },
    });

    // Let transaction auto-generate its own integer ID
    // Store Stripe payment intent ID in metadata for tracking
    const transaction = await Transaction.create({
      orderId: order.id,
      totalAmount: total,
      paymentMethod: "credit_card",
      status: "pending",
    });

    // Return clientSecret and intent id for frontend
    return res.status(200).json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: total,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message || error);
    console.error("Full error:", error);
    return res.status(500).json({
      msg: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

// Webhook: must use express.raw on the route
const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body, // raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object;
      const orderId = pi.metadata?.orderId;
      const userId = pi.metadata?.userId;

      // Update transaction and order to 'paid' status
      if (orderId) {
        await Transaction.update(
          { status: "success" },
          { where: { orderId: orderId } },
        );
        await Order.update({ status: "paid" }, { where: { id: orderId } });

        // Decrement product stock
        const orderItems = await OrderItem.findAll({ where: { orderId } });
        for (const item of orderItems) {
          await Product.decrement("stock", {
            by: item.quantity,
            where: { id: item.productId },
          });
        }
      }

      // Mark cart as completed and clear items after successful payment
      if (userId) {
        const cart = await Cart.findOne({
          where: { userId, status: "active" },
        });
        if (cart) {
          await CartItem.destroy({ where: { cartId: cart.id } });
          await cart.update({ status: "completed" });
        }
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object;
      const orderId = pi.metadata?.orderId;

      // Update transaction and order to 'failed' status
      if (orderId) {
        await Transaction.update(
          { status: "failed" },
          { where: { orderId: orderId } },
        );
        await Order.update({ status: "cancelled" }, { where: { id: orderId } });
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Webhook handler failed");
  }
};

// For testing without webhook - manually confirm payment success
const confirmPaymentSuccess = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  try {
    if (!orderId) return res.status(400).json({ msg: "Missing orderId" });

    // Verify order belongs to user
    const order = await Order.findOne({ where: { id: orderId, userId } });
    if (!order) return res.status(404).json({ msg: "Order not found" });

    // Update transaction to success
    await Transaction.update(
      { status: "success" },
      { where: { orderId: orderId } },
    );

    // Update order to paid
    await Order.update({ status: "paid" }, { where: { id: orderId } });

    // Decrement product stock
    const orderItems = await OrderItem.findAll({ where: { orderId } });
    for (const item of orderItems) {
      await Product.decrement("stock", {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    // Mark cart as completed and clear items
    const cart = await Cart.findOne({
      where: { userId, status: "active" },
    });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
      await cart.update({ status: "completed" });
    }

    return res.json({
      msg: "Payment confirmed successfully",
      order: { id: orderId, status: "paid" },
    });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { createPaymentIntent, stripeWebhook, confirmPaymentSuccess };
