import { useEffect, useState } from "react";

export default function InsightsCard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/insights")
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Could not load insights"));
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading insights...</div>;

  const { totalIncome, totalExpense, netBalance, topCategory, weekChange } =
    data;

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: 16,
        background: "#020617",
        marginBottom: "1rem",
      }}
    >
      <h2 style={{ marginBottom: "0.75rem" }}>🔎 Smart Insights</h2>
      <p>💰 Total income: ₹{totalIncome}</p>
      <p>💸 Total expense: ₹{totalExpense}</p>
      <p>
        🧮 Net balance:{" "}
        <b style={{ color: netBalance >= 0 ? "#22c55e" : "#ef4444" }}>
          ₹{netBalance}
        </b>
      </p>

      {topCategory && (
        <p>
          🥵 Highest spending in{" "}
          <b>{topCategory.name}</b> (₹{topCategory.amount})
        </p>
      )}

      {weekChange !== null && (
        <p>
          📊 This week you spent{" "}
          <b style={{ color: weekChange > 0 ? "#ef4444" : "#22c55e" }}>
            {weekChange > 0 ? "+" : ""}
            {weekChange.toFixed(1)}%
          </b>{" "}
          compared to last week.
        </p>
      )}
    </div>
  );
}
