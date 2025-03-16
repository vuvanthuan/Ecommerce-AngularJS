const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expireDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
