const express = require("express");
const { protect, adminOnly } = require("../Middleware/authMiddleware");
const { createCategory } = require("../controller/categoryController");
const router = express.Router();

router.post("/create-category", protect, adminOnly, createCategory);

module.exports = router;
