const express = require("express");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const txns = await Transaction.find();

    const totalIncome = txns
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = txns
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Highest spending category
    const catMap = {};
    txns.forEach(t => {
      if (t.type === "expense") {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });

    const topCategory = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])[0] || null;

    // This week vs last week
    const now = new Date();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    const thisWeek = txns.filter(
      t => t.type === "expense" && now - t.date <= weekMs
    );
    const lastWeek = txns.filter(
      t =>
        t.type === "expense" &&
        now - t.date > weekMs &&
        now - t.date <= 2 * weekMs
    );

    const thisWeekTotal = thisWeek.reduce((s, t) => s + t.amount, 0);
    const lastWeekTotal = lastWeek.reduce((s, t) => s + t.amount, 0);

    let weekChange = null;
    if (lastWeekTotal > 0) {
      weekChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100;
    }

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      weekChange,
    });
  } catch (err) {
    console.error("Insights error:", err);
    res.status(500).json({ error: "Failed to calculate insights" });
  }
});

module.exports = router;
