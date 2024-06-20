const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const {
  transferFund,
  verifyAccount,
} = require("../controller/transactionController");

const router = express.Router();

router.post("/transfer-fund", express.json(), protect, transferFund);
router.post("/verify-account", express.json(), protect, verifyAccount);

module.exports = router;
