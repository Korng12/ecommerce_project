const { where } = require("sequelize");
const cart = require("../models/cart.js");
const db = require("../models/index.js");
const Cart = db.cart;
const CartItem = db.cartItem;
const Product = db.product;
const ProductImage = db.productImage;
const Brand = db.brand;

const getCartByUserId = async (req, res) => {
  const userId = req.user.id; //  From JWT token, not params!

  try {
    let cart = await Cart.findOne({
      where: { userId ,status: 'active'},
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: ProductImage,
                  as: "images",
                  attributes: ["id", "imageUrl", "isPrimary"],
                },
                {
                  model: Brand,
                  as: "brand",
                  attributes: ["id", "name", "logo"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(cart ?? { items: [], msg: "Cart is empty" });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const AddToCart = async (req, res) => {
  const userId = req.user.id; //  From JWT token
  const { productId, quantity = 1 } = req.body;

  // Validate input
  if (!productId || quantity < 1) {
    return res.status(400).json({ msg: "Invalid input" });
  }

  try {
    const [cart] = await Cart.findOrCreate({ where: { userId ,status: 'active'} });

    let item = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (!item) {
      item = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
      return res.status(201).json({ msg: "Item added", item });
    }

    // Update existing item
    await item.increment("quantity", { by: quantity });
    await item.reload(); // Refresh to get updated quantity

    return res.status(200).json({ msg: "Quantity updated", item });
  } catch (err) {
    console.error("Cart error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Validate input
  if(!productId || quantity < 1){
    return res.status(400).json({ msg: "Invalid input" });
  }

  try {
    const cart = await Cart.findOne({ where: { userId ,status: 'active'} });
    if(!cart){return res.status(404).json({ msg: "Cart not found" });}

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if(!item){return res.status(404).json({ msg: "Item not found in cart" });}

    // Update item quantity
    await item.update({ quantity });
    return res.status(200).json({ msg: "Item updated", item });
  } 
  catch (error) {
    console.error("Update cart item error:", error);
    return res.status(500).json({ msg: "Server error" });
  }

};  

const removeFromCart = async (req, res) => {
  const userId = req.user.id; // From JWT token
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ msg: "Invalid input" });
  }
  const cart = await Cart.findOne({ where: { userId ,status: 'active'} });
  if(!cart){return res.status(404).json({ msg: "Cart not found" });}
  let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if(!item){return res.status(404).json({ msg: "Item not found in cart" });}

  try {
    await item.destroy();
    return res.status(200).json({ msg: "Item removed" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

const clearCart = async (req, res) => {
  const userId = req.user.id; // From JWT token

  try {
    const cart = await Cart.findOne({ where: { userId ,status: 'active'} });
    if(!cart){return res.status(404).json({ msg: "Cart not found" });}

    await CartItem.destroy({ where: { cartId: cart.id } });
    return res.status(200).json({ msg: "Cart cleared" });
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  getCartByUserId,
  AddToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};