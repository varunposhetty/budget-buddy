const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Transaction = require("./models/Transaction");
const transactionsRoutes = require("./routes/transactions");
const goalsRoutes = require("./routes/goals");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes from other files
app.use("/api/transactions", transactionsRoutes);
app.use("/api/goals", goalsRoutes);

// ✅ SIMPLE SAFE SMART INSIGHTS ROUTE
app.get("/api/insights", async (req, res) => {
  try {
    let txns = await Transaction.find().lean();
    if (!Array.isArray(txns)) txns = [];

    const totalIncome = txns
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = txns
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Highest spending category
    const catMap = {};
    txns.forEach(t => {
      if (t.type === "expense") {
        const cat = t.category || "Other";
        catMap[cat] = (catMap[cat] || 0) + (t.amount || 0);
      }
    });

    const entries = Object.entries(catMap);
    const topCategory = entries.length
      ? {
          name: entries.sort((a, b) => b[1] - a[1])[0][0],
          amount: entries.sort((a, b) => b[1] - a[1])[0][1],
        }
      : null;

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      topCategory,
      weekChange: null, // Keeping simple for stability
    });
  } catch (err) {
    console.error("Insights error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to calculate insights" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Budget Buddy API working");
});

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB error:", err);
  });
