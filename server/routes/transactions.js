const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Add a transaction
router.post("/", async (req, res) => {
  try {
    const txn = await Transaction.create(req.body);
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const txns = await Transaction.find().sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;
