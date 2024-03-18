const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

// This is to ensure that only the users that logged in successfully are allowed to access some route as specified
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
    const userData = await UserModel.findById(verifiedToken.id).select(
      "-password"
    );
    // To check the user existence
    if (!userData) {
      res.status(401);
      throw new Error("User not found!");
    }

    req.user = userData;
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

// This is to endure only an admin user can create products
const adminOnly = (req, res, next) => {
  if(req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(401)
    throw new Error("Sorry! Only admin users are authorized!")
  }

}

module.exports = { protect, userLoginStatus, adminOnly };
