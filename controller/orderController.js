const asyncHandler = require("express-async-handler");
const OrderModel = require("../model/OrderModel");
const ProductModel = require("../model/ProductModel");
const { calculateTotalPrice } = require("../utils");
const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
    coupon,
  } = req.body;

  if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Order data missing!");
  }

  await OrderModel.create({
    user: req.user._id,
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
    coupon,
  });

  res.status(201).json({ message: "You order has been created!" });
});

const getAllOrders = asyncHandler(async (req, res) => {
  let orders;
  //   If the user is an admin
  if (req.user.role === "admin") {
    orders = await OrderModel.find().sort("-createdAt");
    return res.status(200).json(orders);
  }
  //   If the user is not an admin, this will send the orders made by a particular user
  orders = await OrderModel.find({ user: req.user._id }).sort("-createdAt");
  return res.status(200).json(orders);
});

// To Get Single Order
const singleOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found!");
  }
  //   If the user is an admin
  if (req.user.role === "admin") {
    return res.status(200).json(order);
  }
  //   To match the order to the user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to view order!");
  }

  res.status(200).json(order);
});

// To Update Order Status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const { id } = req.params;

  const order = await OrderModel.findById(id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found!");
  }

  //   To update the status
  await OrderModel.findByIdAndUpdate(
    { _id: id },
    { orderStatus },
    { new: true, runValidators: true }
  );

  res.status(200).json({ message: "The order status has been updated!" });
});

// For Stripe Payment Integration
const payWithStripe = asyncHandler(async (req, res) => {
  try {
    const { items, shipping, description, coupon } = req.body;

    // To get the products in the Database
    const products = await ProductModel.find();

    let orderAmount;
    orderAmount = calculateTotalPrice(products, items);

    if (coupon !== null && coupon?.name !== "nil") {
      let totalAfterDiscount =
        orderAmount - (orderAmount * coupon.discount) / 100;
      orderAmount = totalAfterDiscount;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: orderAmount,
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      description,
      shipping: {
        address: {
          line1: shipping.line1,
          line2: shipping.line2,
          city: shipping.city,
          country: shipping.country,
          postal_code: shipping.postal_code,
        },
        name: shipping.name,
        phone: shipping.phone,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

module.exports = {
  createOrder,
  getAllOrders,
  singleOrder,
  updateOrderStatus,
  payWithStripe,
};
