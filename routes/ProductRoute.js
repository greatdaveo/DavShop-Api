const express = require("express");
const {
  createProduct,
  getProducts,
} = require("../controller/productController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, adminOnly, createProduct);
router.get("/", getProducts);


module.exports = router;

