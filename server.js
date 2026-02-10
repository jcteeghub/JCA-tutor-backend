import express from "express";
import cors from "cors";
import multer from "multer";
import pdfParse from "pdf-parse";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/pdf-text", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing file" });
    const data = await pdfParse(req.file.buffer);
    res.json({ text: data.text || "" });
  } catch (e) {
    res.status(500).json({ error: "PDF parse failed", detail: String(e?.message || e) });
  }
});

// Stub (so your UI stops failing). We'll connect OpenAI after.
app.post("/api/chat", async (req, res) => {
  res.json({ reply: "Backend connected ✅. Next: connect this to OpenAI." });
});

app.post("/api/suggest", async (req, res) => {
  res.json({
    reply: JSON.stringify([
      "What makes you say that?",
      "Can you give a specific example from the notes?",
      "What assumption are you making here?",
      "How would you test if your idea is true?"
    ])
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Backend listening on", port));
