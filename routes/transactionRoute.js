const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const { transferFund } = require("../controller/transactionController");

const router = express.Router();

router.post("/transfer-fund", express.json(), protect, transferFund);

module.exports = router;
