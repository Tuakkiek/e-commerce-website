// controllers/cart.controller.js
const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user._id }).populate(
      "items.productId",
      "name images price status"
    );

    if (!cart) {
      cart = await Cart.create({ customerId: req.user._id, items: [] });
    }

    res.json({ success: true, data: { cart } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    if (product.status !== "AVAILABLE") {
      return res
        .status(400)
        .json({ success: false, message: "Sản phẩm hiện không có sẵn" });
    }

    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Số lượng sản phẩm không đủ" });
    }

    let cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        customerId: req.user._id,
        items: [{ productId, quantity, price: product.price }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.price;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
      }
      await cart.save();
    }

    cart = await cart.populate("items.productId", "name images price status");
    res.json({
      success: true,
      message: "Đã thêm vào giỏ hàng",
      data: { cart },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Số lượng sản phẩm không đủ" });
    }

    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không có trong giỏ hàng" });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = product.price;
    }

    await cart.save();
    await cart.populate("items.productId", "name images price status");
    res.json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      data: { cart },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    await cart.populate("items.productId", "name images price status");
    res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      data: { cart },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Giỏ hàng không tồn tại" });
    }

    cart.items = [];
    await cart.save();
    res.json({ success: true, message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
