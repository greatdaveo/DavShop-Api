const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    sender: {
      type: String,
      required: true,
    },

    receiver: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

const TransactionModel = mongoose.model("transactions", transactionSchema);

module.exports = TransactionModel;
