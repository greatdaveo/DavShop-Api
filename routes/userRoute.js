const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  updatePhoto,
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



module.exports = router;
