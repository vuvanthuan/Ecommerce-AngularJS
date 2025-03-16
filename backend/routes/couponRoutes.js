const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

// Create a new coupon
router.post("/", couponController.createCoupon);

// Get all coupons
router.get("/", couponController.getCoupons);

// Get coupon by ID
router.get("/:id", couponController.getCouponById);

// Update a coupon
router.put("/:id", couponController.updateCoupon);

// Delete a coupon
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
