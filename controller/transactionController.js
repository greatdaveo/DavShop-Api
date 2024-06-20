const asyncHandler = require("express-async-handler");
const UserModel = require("../model/UserModel");
const e = require("cors");
const TransactionModel = require("../model/TransactionModel");

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

module.exports = {
  transferFund,
};
