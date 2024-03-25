const express = require("express");
const {
  createCoupon,
  getAllCoupon,
  singleCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/create-coupon", protect, adminOnly, createCoupon);
router.get("/all-coupons", protect, adminOnly, getAllCoupon);
router.get("/:couponName", protect, singleCoupon);
router.delete("/:id", protect, adminOnly, deleteCoupon);

module.exports = router;
