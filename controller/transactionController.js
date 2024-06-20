const asyncHandler = require("express-async-handler");
const UserModel = require("../model/UserModel");
const e = require("cors");
const TransactionModel = require("../model/TransactionModel");

// To Transfer Funds
const transferFund = asyncHandler(async (req, res) => {
  const { amount, sender, receiver, description, status } = req.body;

  //   To Validate
  if (!amount || !sender || !receiver) {
    res.status(400);
    throw new Error("Please fill all fields!");
  }

  // To check senders account
  const user = await UserModel.findOne({ email: sender });
  if (user.accountBalance < amount) {
    res.status(400);
    throw new Error("Insufficient balance!");
  }

  // Decrease sender's account balance
  await UserModel.findOneAndUpdate(
    { email: sender },
    { $inc: { accountBalance: -amount } }
  );

  // Increase receiver's account balance
  await UserModel.findOneAndUpdate(
    { email: receiver },
    { $inc: { accountBalance: amount } }
  );

  // Save transaction when the account balance is enough
  await TransactionModel.create(req.body);

  res.status(200).json({ message: "Transaction successful!" });
});

// Verify Account
const verifyAccount = asyncHandler(async (req, res) => {
  //   To check if the receiver exist
  const fundReceiver = await UserModel.findOne({ email: req.body.receiver });

  if (!fundReceiver) {
    res.status(400);
    throw new Error("User Account Not Found!");
  }

  //   If receiver account is found
  res.status(200).json({ message: "Account Verification Successful!" });
});

module.exports = {
  transferFund,
  verifyAccount,
};
