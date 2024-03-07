const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    // console.log(token);
    if (!token) {
      res.status(201);
      throw new Error("Not authorized, please login!");
    }
    // To verify the token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    // To get the user id from the token
    const userId = await UserModel.findById(verifiedToken.id).select(
      "-password"
    );
    // To check the user existence
    if (!userId) {
      res.status(401);
      throw new Error("User not found!");
    }
    req.user = userId;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login!");
  }
});

// To get user login status
const userLoginStatus = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json(false);
  }

  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (verifiedToken) {
    res.json(true);
  } else {
    res.json(false);
  }
});

module.exports = { protect, userLoginStatus };
