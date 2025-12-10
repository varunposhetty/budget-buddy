const express = require("express");
const Goal = require("../models/Goal");

const router = express.Router();

// Create a new goal
router.post("/", async (req, res) => {
  try {
    const goal = await Goal.create(req.body);
    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// Update progress (add saved amount)
router.patch("/:id/progress", async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $inc: { currentAmount: amount } },
      { new: true }
    );
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
