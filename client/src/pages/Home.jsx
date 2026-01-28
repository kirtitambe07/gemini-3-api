function Home({ goToAnalyzer }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a8a, #6366f1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "900px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem" }}>🧠 ResolveAI</h1>

        {/* ✅ UPDATED DESCRIPTION (AS REQUESTED) */}
        <p
          style={{
            maxWidth: "420px",
            margin: "20px auto",
            lineHeight: "1.6",
            fontSize: "1.1rem",
            opacity: 0.95,
          }}
        >
          ResolveAI is an AI‑powered complaint analysis platform that helps
          authorities quickly understand citizen issues, prioritize urgent
          problems, and make data‑driven decisions using Gemini‑3‑aligned
          intelligence.
        </p>

        {/* FEATURE CARDS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginTop: "40px",
            flexWrap: "wrap",
          }}
        >
          {[
            "📌 Smart Categorization",
            "🚦 Priority Detection",
            "😊 Sentiment Analysis",
            "⚡ Instant AI Summary",
          ].map((text) => (
            <div
              key={text}
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "20px",
                borderRadius: "14px",
                width: "200px",
                backdropFilter: "blur(6px)",
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={goToAnalyzer}
          style={{
            marginTop: "50px",
            padding: "14px 30px",
            fontSize: "18px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#fff",
            color: "#1e3a8a",
            fontWeight: "bold",
          }}
        >
          🚀 Analyze a Complaint
        </button>

        {/* ✅ OPTIONAL PREMIUM LINE (ADDED) */}
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            opacity: 0.85,
          }}
        >
          ✔ Faster resolution • ✔ Smart prioritization • ✔ Scalable AI
        </p>
      </div>
    </div>
  );
}

export default Home;


