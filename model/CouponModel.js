const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: [true, "Please add coupon name!"],
      minlength: [6, "Coupon name must be at least 6 characters!"],
      maxlength: [12, "Coupon name can't be more than 12 characters!"],
    },

    discount: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: String,
      // type: Date,
      required: true,
    },
  },

  { timestamps: true }
);

const CouponModel = mongoose.model("Coupon", couponSchema);

module.exports = CouponModel;
