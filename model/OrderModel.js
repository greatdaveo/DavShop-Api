const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      re: "User",
    },

    orderDate: {
      type: String,
      required: [true, "Please add an order date!"],
      trim: true,
    },

    orderTime: {
      type: String,
      required: [true, "Please add an order time!"],
      trim: true,
    },

    orderAmount: {
      type: String,
      required: [true, "Please add an order time!"],
      trim: true,
    },

    orderStatus: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      trim: true,
    },

    cartItems: {
      //   type: [Object],
      type: String,
      //   required: [true],
    },

    shippingAddress: {
      //   type: Object,
      type: String,
      required: true,
    },

    coupon: {
      type: Object,
      //   required: true,
      default: {
        name: "nil",
      },
    },
  },

  { timestamps: true }
);

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;
