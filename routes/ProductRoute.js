const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  reviewProduct,
} = require("../controller/productController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, adminOnly, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.patch("/:id", protect, adminOnly, updateProduct);
router.patch("/review/:id", protect, reviewProduct);






module.exports = router;

