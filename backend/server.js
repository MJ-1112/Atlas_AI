import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import pkg from "pdf-parse";
import officeParser from "officeparser";
import fs from "fs";
import cors from "cors";

const { default: pdf } = pkg;

dotenv.config();
console.log("Loaded key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");

const app = express();

app.use(cors({
  origin: "https://atlas-ai-dun.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
const upload = multer({ dest: "uploads/" });
let text = "";

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Limit file size (50MB)
    const stats = fs.statSync(file.path);
    const fileSizeMB = stats.size / (1024 * 1024);
    if (fileSizeMB > 50) {
      fs.unlinkSync(file.path);
      return res.status(413).json({ message: "File too large (max 50MB)" });
    }

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text;
      fs.unlinkSync(file.path);
      return res.status(200).json({ message: "✅ PDF uploaded successfully" });
    }

    if (file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      const pptText = await officeParser.parseOfficeAsync(file.path);
      text = pptText;
      fs.unlinkSync(file.path);
      return res.status(200).json({ message: "✅ PPT uploaded successfully" });
    }

    fs.unlinkSync(file.path);
    return res.status(400).json({ error: "Unsupported file type" });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Error processing file" });
  }
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
    });

    return res.status(200).json({ answer: response.response.text() });
  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/summarize", async (req, res) => {
  try {
    if (!text) return res.status(400).json({ error: "No document uploaded" });

    const prompt = `Summarize this for me in simple words as I am a student and you are a professional teacher. Make bullet points for quick revision:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return res.status(200).json({ answer: response.response.text() });
  } catch (error) {
    console.error("Summarize error:", error);
    return res.status(500).json({ error: "Summarization failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Running at http://localhost:${PORT}`));
