const Coupon = require("../models/coupon");

exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, expireDate } = req.body;
    const coupon = new Coupon({
      code,
      discount,
      expireDate,
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expireDate } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: "Mã giảm giá không tồn tại." });
    }

    coupon.code = code || coupon.code;
    coupon.discount = discount || coupon.discount;
    coupon.expireDate = expireDate || coupon.expireDate;

    await coupon.save();
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ error: "Mã giảm giá không tồn tại." });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: "Mã giảm giá đã được xóa thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
