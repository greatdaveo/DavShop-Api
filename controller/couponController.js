const asyncHandler = require("express-async-handler");
const CouponModel = require("../model/CouponModel");

// To create the coupon
const createCoupon = asyncHandler(async (req, res) => {
  const { name, expiresAt, discount } = req.body;

  if (!name || !expiresAt || !discount) {
    res.status(400);
    throw new Error("Please fill all fields!");
  }

  const createdCoupon = await CouponModel.create({ name, expiresAt, discount });
  res.status(201).json(createdCoupon);
});

// To get all the coupons in the database
const getAllCoupon = asyncHandler(async (req, res) => {
  const allCoupons = await CouponModel.find().sort("-createdAt");
  res.status(200).json(allCoupons);
});

// To get a Single Coupon;
const singleCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponModel.findOne({
    name: req.params.couponName,
    // expiresAt: { $gt: Date.now() },
  });

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found or has expired!");
  }

  res.status(200).json(coupon);
});

// To delete a coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await CouponModel.findByIdAndDelete(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found!");
  }

  res.status(200).json({ message: "Coupon deleted!" });
});

module.exports = { createCoupon, getAllCoupon, singleCoupon, deleteCoupon };
