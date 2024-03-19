const express = require("express");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const {
  createCategory,
  getAllCategory,
} = require("../controller/categoryController");
const router = express.Router();

router.post("/create-category", protect, adminOnly, createCategory);
router.get("/all-categories", protect, adminOnly, getAllCategory);


module.exports = router;
