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

  // TO Decrease sender's account balance
  await UserModel.findOneAndUpdate(
    { email: sender },
    { $inc: { accountBalance: -amount } }
  );

  // To Increase receiver's account balance
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

// :::: DEPOSIT FUND FUNCTION FOR BOT Stripe and Flutterwave ::::
const depositFund = async (customer, data, description, source) => {
  await TransactionModel.create({
    amount:
      source === "stripe" ? data.amount_subtotal / 100 : data.amount_subtotal,
    sender: "Self",
    receiver: customer.email,
    description,
    status: "success",
  });

  // To Increase receiver's account balance
  await UserModel.findOneAndUpdate(
    { email: customer.email },
    {
      $inc: {
        accountBalance:
          source === "stripe"
            ? data.amount_subtotal / 100
            : data.amount_subtotal,
      },
    }
  );
};

// FOR Strip Webhook
const stripeEndPointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.header("stripe-signature");

  let data;
  let event;
  let eventType;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeEndPointSecret
    );

    console.log("Webhook verified!");
  } catch (error) {
    console.log("Webhook Error: ", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  data = event.data.object;
  eventType = event.eventType;

  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        // Deposit funds into customer's account
        const description = "Stripe Deposit";
        const source = "stripe";

        depositFund(customer, data, description, source);
      })
      .catch((err) => console.log(err.message));
  }
  res.send().end();
});

module.exports = {
  transferFund,
  verifyAccount,
  getUserTransactions,
  depositFundWithTripe,
  stripeWebhook,
};
