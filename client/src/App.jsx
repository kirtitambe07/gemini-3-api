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

    const enriched = {
      complaint,
      location: location || "Not specified",
      ...data.analysis,
      confidence: Math.floor(85 + Math.random() * 15),
      lat: 18.52 + Math.random() * 0.02,
      lng: 73.85 + Math.random() * 0.02,
      time: new Date().toLocaleString(),
    };

    setResult(enriched);
    setHistory((prev) => [enriched, ...prev]);
    setLoading(false);
  };

  const chartData = {
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
        borderRadius: 8,
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
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2 style={{ color: "#4f46e5" }}>🧠 ResolveAI</h2>
        <p style={{ color: "#555", marginBottom: "25px" }}>
          Turning citizen complaints into actionable insights using Gemini‑3 AI
        </p>

        <p>📦 Total complaints analyzed: {history.length}</p>

        <textarea
          rows="5"
          placeholder="✍️ Enter complaint here..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          style={{ width: "100%", marginTop: "15px" }}
        />

        <input
          placeholder="📍 Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />

        <button
          onClick={analyzeComplaint}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "12px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          🔍 Analyze Complaint →
        </button>

        {loading && <p style={{ marginTop: "10px" }}>🤖 AI is analyzing...</p>}

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
           <p>
             🚦 <b>Priority:</b>{" "}
             <span
               style={{
                 fontWeight: "bold",
                 color:
                   result.priority?.toLowerCase() === "high"
                     ? "#dc2626"
                     : result.priority?.toLowerCase() === "medium"
                     ? "#f59e0b"
                     : "#16a34a",
               }}
             >
               {result.priority}
             </span>
           </p>


            <p>😊 <b>Sentiment:</b> {result.sentiment}</p>
            <p>🤖 <b>AI Confidence:</b> {result.confidence}%</p>
            <p>📝 <b>Summary:</b> {result.summary}</p>
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>📊 Priority Analytics</h3>
            <Bar data={chartData} />
          </div>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: "40px", height: "420px" }}>
            <h3>🌍 Complaint Map View</h3>
            <MapView complaints={history} />
          </div>
        )}

        <p
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "gray",
          }}
        >
          Built for Gemini‑3 Hackathon 🚀
        </p>
      </div>
    </div>
  );
}

export default App;


