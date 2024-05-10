const asyncHandler = require("express-async-handler");
const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// To set User Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Registration Controller
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields!");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email has already been registered!");
  }

  // To create new user
  const newUser = await UserModel.create({
    name,
    email,
    password,
  });

  // To generate token
  const token = generateToken(newUser._id);

  if (newUser) {
    const { _id, name, email, role } = newUser;

    res.cookie("access_token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // secure: true,
      // sameSite: none,
    });

    // To send the user data
    res.status(201).json({ _id, name, email, role, token });
  } else {
    res.status(400);
    throw new Error("Invalid user data!!!");
  }

  res.send("Register user...");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // To Validate user
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password!");
  }

  // To check if user exist
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User does not exist!");
  }
  // To compare password
  const correctPassword = await bcrypt.compare(password, user.password);

  // To generate token
  const token = generateToken(user._id);
  if (user && correctPassword) {
    const newUser = await UserModel.findOne({ email }).select("-password");
    res.cookie("access_token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      // secure: true,
      // sameSite: none,
    });
    // To send the user data
    res.status(201).json(newUser);
  } else {
    res.status(400);
    throw new Error("Invalid email or password!");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("access_token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    // secure: true,
    // sameSite: none,
  });

  res.status(200).json({ message: "You have logged out successfully!" });
});

// To get the user data
const getUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error("User not found!");
  }
});

// To update user data
const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  if (user) {
    const { name, phone, address } = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// To update user photo
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await UserModel.findById(req.user._id);

  user.photo = photo;
  const updatedPhoto = await user.save();
  res.status(200).json(updatedPhoto);
});

// To save cart in the database
const saveCart =asyncHandler(async (req, res) => {
  const {cartItems} = req.body;
  const user = await UserModel.findById(req.user._id)
  if(user) {
    user.cartItems = cartItems
    user.save()
    res.status(200).json({message: "Cart saved successfully"})
  } else {
    res.status(404);
    throw new Error("User not found!")
  }
})

const getCart = asyncHandler(async (req, res) =>{
  const { cartItems } = req.body;
  const user = await UserModel.findById(req.user._id);
  if (user) {  
    res.status(200).json(user.cartItems);
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
})

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  updatePhoto,
  saveCart,
  getCart,
};
