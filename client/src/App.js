import InsightsCard from "./components/InsightsCard";
import GoalsSection from "./components/GoalsSection";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "2rem",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>
        💰 Budget Buddy
      </h1>
      <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
        Smart Insights + Savings Goals
      </p>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <InsightsCard />
        <GoalsSection />
      </div>
    </div>
  );
}

export default App;
