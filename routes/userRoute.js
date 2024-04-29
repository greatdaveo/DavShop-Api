const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  updatePhoto,
  saveCart,
  getCart,
} = require("../controller/userController");
const { protect, userLoginStatus } = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/get-user", protect, getUser);
router.get("/login-status", userLoginStatus);
router.patch("/update-profile", protect, updateUser);
router.patch("/update-photo", protect, updatePhoto);
// For the cart saved in the database
router.patch("/save-cart", protect, saveCart);
router.get("/get-cart", protect, getCart);




module.exports = router;
