const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: String
  },
  { timestamps: true }
);

// 👇 VERY IMPORTANT: export the model
module.exports = mongoose.model("Transaction", transactionSchema);
