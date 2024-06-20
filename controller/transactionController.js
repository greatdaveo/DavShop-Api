const asyncHandler = require("express-async-handler");
const UserModel = require("../model/UserModel");
const TransactionModel = require("../model/TransactionModel");
const { stripe } = require("../utils");

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

// To Verify Receiver Account
const verifyAccount = asyncHandler(async (req, res) => {
  // To check if the receiver exist
  const fundReceiver = await UserModel.findOne({ email: req.body.receiver });

  if (!fundReceiver) {
    res.status(400);
    throw new Error("User Account Not Found!");
  }

  //   If receiver account is found
  res.status(200).json({ message: "Account Verification Successful!" });
});

// To Get Individual Transaction Records
const getUserTransactions = asyncHandler(async (req, res) => {
  if (req.user.email !== req.body.email) {
    res.status(400);
    throw new Error("Not authorized to view transaction");
  }

  const transactions = await TransactionModel.find({
    // This is to get when a particular user is a sender or a receiver
    $or: [{ sender: req.body.email }, { receiver: req.body.email }],
  })
    .sort({ createdAt: -1 })
    .populate("sender")
    .populate("receiver");

  res.status(200).json(transactions);
});

// To deposit funds with stripe
const depositFundWithTripe = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const user = await UserModel.findById(req.user._id);
  // To create a stripe customer with the user account
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
    });
    // This will create stripeCustomerId when the user does not have a stripe id in the DB
    user.stripeCustomerId = customer;
    user.save();
  }

  //    To create Stripe checkout session
  const stripeSession = await stripe.checkout.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "DavShop Wallet Deposit...",
            description: `Make a deposit of $${amount} to your DavShop wallet.`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    customer: user.stripeCustomerId,
    success_url: `${process.env.FRONTEND_URL}/wallet?payment=successful&amount=${amount}`,
    cancel_url: `${process.env.FRONTEND_URL}?/wallet?payment=failed`,
  });

  // To send to the frontend
  return res.json(stripeSession);
});

module.exports = {
  transferFund,
  verifyAccount,
  getUserTransactions,
  depositFundWithTripe,
};
