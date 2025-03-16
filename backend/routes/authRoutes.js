const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ userId: user._id });
  } catch (error) {
    res.status(400).json({ message: "Đăng ký thất bại", error: error.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ phoneNumber, password });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Sai số điện thoại hoặc mật khẩu" });
    }

    res.json({ userId: user._id, name: user.username });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
});

module.exports = router;
