import React, { useState } from "react";
import "./App.css";
import InsightsCard from "./components/InsightsCard";
import GoalsSection from "./components/GoalsSection";

function App() {
  // Transaction Input State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Add Transaction
  const handleAddTransaction = async () => {
    const value = Number(amount);
    if (!value || value <= 0) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: value,
          type,
          category,
          note,
        }),
      });

      if (response.ok) {
        setAmount("");
        setNote("");
        window.location.reload(); // Refresh to show updated data
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1>💰 Budget Buddy</h1>
      <p>Smart Insights + Savings Goals</p>

      {/* SMART INSIGHTS */}
      <InsightsCard />

      {/* ADD TRANSACTION */}
      <div style={{ marginTop: "20px", padding: "15px", background: "#111", borderRadius: "8px" }}>
        <h2>➕ Add Transaction</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "none" }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "none" }}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "none" }}
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", borderRadius: "4px", border: "none" }}
        />

        <button 
          onClick={handleAddTransaction}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: loading ? "#666" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* SAVINGS GOALS */}
      <GoalsSection />
    </div>
  );
}

export default App;
