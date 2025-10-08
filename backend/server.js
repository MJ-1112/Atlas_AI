import express from "express";
import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";
import multer from "multer";
import officeParser from "officeparser";
import fs from "fs";
import cors from "cors";

dotenv.config();
console.log("Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing");

const app = express();

// ✅ Enable CORS for deployed frontend
app.use(
  cors({
    origin: "https://atlas-ai-dun.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
const upload = multer({ dest: "uploads/" });

let text = ""; // store file text globally

// 🩺 Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 📂 Upload Route
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // 🧱 File size limit 50MB
    const stats = fs.statSync(file.path);
    const fileSizeMB = stats.size / (1024 * 1024);
    if (fileSizeMB > 50) {
      fs.unlinkSync(file.path);
      return res.status(413).json({ message: "File too large (max 50MB)" });
    }

    // 📘 PDF file
    if (file.mimetype === "application/pdf") {
      const pkg = await import("pdf-parse");
      const pdf = pkg.default || pkg;
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text;
      fs.unlinkSync(file.path);
      return res.status(200).json({ message: "✅ PDF uploaded successfully" });
    }

    // 📙 PPTX file
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const pptText = await officeParser.parseOfficeAsync(file.path);
      text = pptText;
      fs.unlinkSync(file.path);
      return res.status(200).json({ message: "✅ PPT uploaded successfully" });
    }

    // ❌ Unsupported file type
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: "Unsupported file type" });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Error processing file" });
  }
});

// 🤖 Gemini AI Setup
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// 💬 Ask AI
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const response = await ai
      .getGenerativeModel({ model: "gemini-1.5-flash" })
      .generateContent(question);

    res.status(200).json({ answer: response.response.text() });
  } catch (error) {
    console.error("Ask error:", error);
    res.status(500).json({ error: "Error generating AI response" });
  }
});

// 🧾 Summarize Route
app.post("/summarize", async (req, res) => {
  try {
    if (!text) return res.status(400).json({ error: "No document uploaded yet" });

    const prompt = `Summarize this text in simple language like a teacher explaining to a student. 
    Include bullet points for quick revision:\n\n${text}`;

    const response = await ai
      .getGenerativeModel({ model: "gemini-1.5-flash" })
      .generateContent(prompt);

    res.status(200).json({ answer: response.response.text() });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Error generating summary" });
  }
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
