import { Link } from "react-router-dom";

function Admin() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
        }}
      >
        <h2 style={{ color: "#1e40af" }}>🛠 Admin Dashboard</h2>
        <p style={{ color: "gray" }}>
          Restricted panel for authorities & municipal officers
        </p>

        <Link to="/" style={{ display: "inline-block", marginBottom: "20px" }}>
          ⬅ Back to Dashboard
        </Link>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <div style={cardStyle}>
            <h3>📥 Total Complaints</h3>
            <p style={bigText}>Live Data</p>
          </div>

          <div style={cardStyle}>
            <h3>🚦 High Priority</h3>
            <p style={bigText}>Critical Issues</p>
          </div>

          <div style={cardStyle}>
            <h3>🧹 Sanitation</h3>
            <p style={bigText}>Most Reported</p>
          </div>

          <div style={cardStyle}>
            <h3>📍 Locations</h3>
            <p style={bigText}>Ward‑wise</p>
          </div>
        </div>

        {/* ANALYTICS PLACEHOLDERS */}
        <div style={{ marginTop: "30px" }}>
          <h3>📊 Priority Trends</h3>
          <p style={muted}>
            Shows how complaint priorities change over time (future feature)
          </p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>🗺 Location‑wise Issues</h3>
          <p style={muted}>
            Heatmap of complaint density by area (future feature)
          </p>
        </div>

        <p style={{ marginTop: "30px", color: "#64748b", fontSize: "14px" }}>
          ⚠ This panel is intended for administrative users only.
        </p>
      </div>
    </div>
  );
}

/* SMALL STYLES */
const cardStyle = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "14px",
  borderLeft: "6px solid #2563eb",
};

const bigText = {
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "8px",
};

const muted = {
  color: "#64748b",
};

export default Admin;
