import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ================= SMART REASON ENGINE ================= */
function generateReason(priority, complaint) {
  const p = priority.toLowerCase();
  const text = complaint.toLowerCase();

  if (p === "high") {
    if (
      text.includes("accident") ||
      text.includes("danger") ||
      text.includes("injury") ||
      text.includes("school") ||
      text.includes("collapse")
    ) {
      return "This complaint involves a serious public safety risk in a sensitive area, requiring immediate government action.";
    }
    return "The issue is severe and poses high risk to public safety or essential infrastructure, justifying urgent resolution.";
  }

  if (p === "medium") {
    if (
      text.includes("garbage") ||
      text.includes("waste") ||
      text.includes("sanitation") ||
      text.includes("mosquito") ||
      text.includes("dirty") ||
      text.includes("smell")
    ) {
      return "Uncollected garbage has caused hygiene issues and mosquito breeding, which can lead to health risks if not resolved soon.";
    }
    return "The complaint causes repeated inconvenience and needs timely attention to prevent escalation.";
  }

  // LOW priority
  if (
    text.includes("noise") ||
    text.includes("street light") ||
    text.includes("slow") ||
    text.includes("minor")
  ) {
    return "The issue causes limited inconvenience and can be handled through routine municipal maintenance.";
  }

  return "The issue has minimal public impact and can be addressed during regular administrative cycles.";
}

/* ================= AI ANALYSIS ROUTE ================= */
app.post("/analyze", async (req, res) => {
  const { complaint, location } = req.body;

  if (!complaint) {
    return res.status(400).json({
      success: false,
      message: "Complaint text is required",
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a government-grade AI. Respond ONLY with valid JSON. No explanations.",
        },
        {
          role: "user",
          content: `Return JSON in this EXACT format:
{
  "category": "Infrastructure | Transport | Sanitation | Public Service | Safety",
  "priority": "High | Medium | Low",
  "sentiment": "Frustrated | Dissatisfied | Neutral",
  "summary": "One sentence summary"
}

Complaint: "${complaint}"
Location: "${location || "Not specified"}"`,
        },
      ],
    });

    const raw = response.choices[0].message.content;
    const analysis = JSON.parse(raw);

    // 🔥 FINAL SMART REASON (OVERRIDES EVERYTHING)
    analysis.reason = generateReason(analysis.priority, complaint);

    console.log("✅ Priority:", analysis.priority);
    console.log("✅ Reason:", analysis.reason);

    res.json({ success: true, analysis });
  } catch (error) {
    console.error("❌ AI Error:", error);
    res.status(500).json({
      success: false,
      message: "AI analysis failed",
    });
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
