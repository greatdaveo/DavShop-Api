const asyncHandler = require("express-async-handler");
const UserModel = require("../../api/model/UserModel");
const jwt = require("jsonwebtoken");

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

module.exports = {
  registerUser,
};
