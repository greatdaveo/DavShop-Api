const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controller/productController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, adminOnly, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);



module.exports = router;

