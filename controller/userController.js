const asyncHandler = require("express-async-handler");

// Registration Controller
const registerUser = asyncHandler(async (req, res) => {
  res.send("Register user...");
});

module.exports = {
  registerUser,
};
