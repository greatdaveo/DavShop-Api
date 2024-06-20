const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const {
  transferFund,
  verifyAccount,
  getUserTransactions,
  depositFundWithTripe,
} = require("../controller/transactionController");

const router = express.Router();
// To make transfer from the wallet account
router.post("/transfer-fund", express.json(), protect, transferFund);
router.post("/verify-account", express.json(), protect, verifyAccount);
// To get individual transaction records
router.get(
  "/get-user-transactions",
  express.json(),
  protect,
  getUserTransactions
);

router.post(
  "/deposit-fund-stripe",
  express.json(),
  protect,
  depositFundWithTripe
);

module.exports = router;
