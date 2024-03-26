const asyncHandler = require("express-async-handler");
const OrderModel = require("../model/OrderModel");

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
    throw new Error("You are not authorized!");
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

module.exports = { createOrder, getAllOrders, singleOrder, updateOrderStatus };
