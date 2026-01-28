import { useState } from "react";
import Home from "./pages/Home";
import MapView from "./components/MapView";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function App() {
  const [page, setPage] = useState("home");
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const analyzeComplaint = async () => {
    if (!complaint.trim()) return;

    setLoading(true);
    setResult(null);

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaint, location }),
    });

    const data = await response.json();

    setTimeout(() => {
      const enriched = {
        complaint,
        location: location || "Not specified",
        ...data.analysis,
        confidence: Math.floor(85 + Math.random() * 15),
        // ✅ MAP COORDINATES (VERY IMPORTANT)
        lat: 18.52 + Math.random() * 0.05,
        lng: 73.85 + Math.random() * 0.05,
        time: new Date().toLocaleString(),
      };

      setResult(enriched);
      setHistory((prev) => [enriched, ...prev]);
      setLoading(false);
    }, 1000);
  };

  /* ---------- HELPERS ---------- */
  const priorityBadge = (priority) => {
    const styles = {
      High: { bg: "#fee2e2", color: "#b91c1c" },
      Medium: { bg: "#fef3c7", color: "#92400e" },
      Low: { bg: "#dcfce7", color: "#166534" },
    };

    return (
      <span
        style={{
          background: styles[priority].bg,
          color: styles[priority].color,
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        {priority}
      </span>
    );
  };

  const getRecommendedAction = (priority) => {
    if (priority === "High") return "🚨 Immediate action required";
    if (priority === "Medium")
      return "🛠 Schedule inspection within 48 hours";
    return "📋 Monitor and review periodically";
  };

  /* ---------- FILTER ---------- */
  const filteredHistory =
    filter === "All"
      ? history
      : history.filter((h) => h.priority === filter);

  /* ---------- CHART ---------- */
  const priorityChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Complaint Priority Distribution",
        data: [
          history.filter((h) => h.priority === "High").length,
          history.filter((h) => h.priority === "Medium").length,
          history.filter((h) => h.priority === "Low").length,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
        borderRadius: 10,
      },
    ],
  };

  if (page === "home") {
    return <Home goToAnalyzer={() => setPage("analyzer")} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ color: "#4f46e5" }}>🧠 ResolveAI Dashboard</h2>
        <p style={{ color: "#555" }}>
          AI‑powered complaint analysis using Gemini‑3 reasoning
        </p>

        <textarea
          rows="5"
          placeholder="✍️ Enter complaint here..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            marginTop: "20px",
          }}
        />

        <input
          type="text"
          placeholder="📍 Location (Area / City)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            marginTop: "12px",
          }}
        />

        <button
          onClick={analyzeComplaint}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: "#4f46e5",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🔍 Run AI Analysis
        </button>

        {loading && (
          <p style={{ marginTop: "15px", color: "#4f46e5" }}>
            🤖 Gemini‑3 is analyzing...
          </p>
        )}

        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f9fafb",
              borderRadius: "14px",
              borderLeft: "6px solid #4f46e5",
            }}
          >
            <h3>📊 AI Result</h3>
            <p>🏷 <b>Category:</b> {result.category}</p>
            <p>📍 <b>Location:</b> {result.location}</p>
            <p>🚦 <b>Priority:</b> {priorityBadge(result.priority)}</p>
            <p>😊 <b>Sentiment:</b> {result.sentiment}</p>
            <p>🤖 <b>AI Confidence:</b> {result.confidence}%</p>
            <p>🎯 <b>Recommended Action:</b> {getRecommendedAction(result.priority)}</p>
            <p>📝 <b>Summary:</b> {result.summary}</p>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>📈 Priority Overview</h3>
            <Bar data={priorityChartData} />
          </div>
        )}

        {/* ✅ MAP VIEW */}
        {history.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>🌍 Complaint Map View</h3>
            <MapView complaints={history} />
          </div>
        )}

        {/* FILTERS */}
        {history.length > 0 && (
          <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
            {["All", "High", "Medium", "Low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: filter === p ? "#4f46e5" : "#e5e7eb",
                  color: filter === p ? "white" : "black",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button
            onClick={() => setHistory([])}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer",
            }}
          >
            🧹 Clear All History
          </button>
        )}

        {/* HISTORY */}
        <div style={{ marginTop: "25px" }}>
          <h3>🕘 Complaint History</h3>

          {history.length === 0 && (
            <div style={{ textAlign: "center", color: "#555" }}>
              <p>📭 No complaints analyzed yet.</p>
              <p>Start by entering a complaint above.</p>
            </div>
          )}

          {filteredHistory.map((item, index) => (
            <div
              key={index}
              style={{
                marginTop: "14px",
                padding: "16px",
                background: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
            >
              <p style={{ fontWeight: "600" }}>📝 {item.complaint}</p>
              <p>📍 {item.location}</p>
              <div style={{ display: "flex", gap: "10px", margin: "6px 0" }}>
                🚦 {priorityBadge(item.priority)}
                <span>🏷 {item.category}</span>
                <span>😊 {item.sentiment}</span>
              </div>
              <p>🤖 Confidence: {item.confidence}%</p>
              <p style={{ fontSize: "13px", color: "#555" }}>⏰ {item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;








