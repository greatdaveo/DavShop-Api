const express = require("express");
const { protect, adminOnly } = require("../Middleware/authMiddleware");

const {
  createBrand,
  getAllBrand,
  deleteBrand,
} = require("../controller/brandController");

const router = express.Router();

router.post("/create-brand", protect, adminOnly, createBrand);
router.get("/all-brands", protect, adminOnly, getAllBrand);
router.delete("/delete-brand/:slug", protect, adminOnly, deleteBrand);

module.exports = router;
