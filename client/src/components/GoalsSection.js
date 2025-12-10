import { useEffect, useState } from "react";

export default function GoalsSection() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });

  const fetchGoals = () => {
    fetch("http://localhost:5000/api/goals")
      .then(res => res.json())
      .then(setGoals)
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    if (!form.title || !form.targetAmount) return;

    await fetch("http://localhost:5000/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        targetAmount: Number(form.targetAmount),
      }),
    });

    setForm({ title: "", targetAmount: "", deadline: "" });
    fetchGoals();
  };

  const addProgress = async (id, amount) => {
    if (!amount) return;
    await fetch(`http://localhost:5000/api/goals/${id}/progress`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    fetchGoals();
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: 16,
        background: "#020617",
      }}
    >
      <h2 style={{ marginBottom: "0.75rem" }}>🎯 Savings Goals</h2>

      <form
        onSubmit={handleCreate}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          name="title"
          placeholder="Goal name (e.g., New Phone)"
          value={form.title}
          onChange={handleChange}
          style={{ padding: "0.5rem", flex: "1" }}
        />
        <input
          name="targetAmount"
          type="number"
          placeholder="Target ₹"
          value={form.targetAmount}
          onChange={handleChange}
          style={{ padding: "0.5rem", width: "120px" }}
        />
        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          style={{ padding: "0.5rem" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            background: "#22c55e",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Add Goal
        </button>
      </form>

      {goals.length === 0 && <p>No goals yet. Create your first goal!</p>}

      <div
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        {goals.map(goal => {
          const progress =
            goal.targetAmount > 0
              ? Math.min(
                  100,
                  (goal.currentAmount / goal.targetAmount) * 100
                )
              : 0;

          return (
            <div
              key={goal._id}
              style={{
                padding: "0.75rem",
                borderRadius: 12,
                background: "#020617",
                border: "1px solid #1e293b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>{goal.title}</strong>
                  <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    ₹{goal.currentAmount} / ₹{goal.targetAmount}
                  </div>
                  {goal.deadline && (
                    <div
                      style={{ fontSize: "0.8rem", opacity: 0.7 }}
                    >
                      ⏰ {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.9rem" }}>
                    {progress.toFixed(1)}%
                  </div>
                  <div
                    style={{
                      marginTop: "0.25rem",
                      width: "150px",
                      height: "8px",
                      borderRadius: 999,
                      background: "#0f172a",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "#22c55e",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="number"
                  placeholder="Add ₹"
                  min="1"
                  style={{ padding: "0.4rem", width: "100px" }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addProgress(goal._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = prompt(
                      "How much did you save for this goal?"
                    );
                    if (input) addProgress(goal._id, input);
                  }}
                  style={{
                    padding: "0.4rem 0.75rem",
                    background: "#2563eb",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Add Savings
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
