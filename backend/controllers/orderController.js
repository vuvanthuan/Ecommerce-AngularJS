const mongoose = require("mongoose");
const Order = require("../models/order");
const User = require("../models/user");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    let {
      userId,
      fullName,
      phone,
      email,
      address,
      note,
      products,
      totalAmount,
      orderNumber,
      orderDate,
      shippingMethod,
      paymentMethod,
    } = req.body;

    // Nếu không có userId (khách vãng lai), tạo tài khoản mới
    if (!userId) {
      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber: phone }],
      });
      if (existingUser) {
        userId = existingUser._id;
      } else {
        const newUser = await User.create({
          username: fullName,
          email: email,
          phoneNumber: phone,
          password: phone,
        });
        userId = newUser._id;
      }
    }

    // Tạo order với userId đã xử lý
    const order = new Order({
      userId, // Gán userId đã xác định
      fullName,
      phone,
      email,
      address,
      note: note || "",
      products: products.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      orderNumber,
      orderDate,
      shippingMethod,
      paymentMethod,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.query; // Lấy userId từ query parameters
    let query = {};

    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    }

    // Populate 'products.productId'
    const orders = await Order.find(query).populate("products.productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
