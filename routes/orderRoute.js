const express = require("express");
const {
  createOrder,
  getAllOrders,
  singleOrder,
  updateOrderStatus,
} = require("../controller/orderController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/create-order", protect, createOrder);
router.get("/all-orders", protect, getAllOrders);
router.get("/:id", protect, singleOrder);
router.patch("/update-status/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
