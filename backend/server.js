import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import {pdf} from "pdf-parse"; // ✅ correct import — no curly braces
import officeParser from "officeparser";
import fs from "fs";
import cors from "cors";

dotenv.config();
console.log("Loaded key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");

const app = express();

// ✅ Enable CORS for deployed frontend
app.use(cors({
  origin: "https://atlas-ai-dun.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ ensure multer + forms work properly

// ✅ Create uploads directory if missing
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// ✅ Set file size limit (50 MB)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 },
});

let text = "";

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    console.log("File received:", req.file);

    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);
      text = pdfData.text;
      res.status(200).json({ message: "✅ PDF uploaded and read successfully" });
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const pptText = await officeParser.parseOfficeAsync(file.path);
      text = pptText;
      res.status(200).json({ message: "✅ PPT uploaded and read successfully" });
    } else {
      return res.status(415).json({ error: "❌ Unsupported file type" });
    }

    fs.unlinkSync(file.path);
  } catch (error) {
    console.error("Upload error:", error);
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large. Max 50 MB allowed." });
    }
    res.status(500).json({ error: "Failed to process file." });
  }
});

const ai = new GoogleGenAI({});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
    });

    res.status(200).json({ answer: response.text });
  } catch (error) {
    console.error("Ask error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/summarize", async (req, res) => {
  try {
    const prompt = `Summarize this for me in simple words as I am a student and you are a professional teacher teaching me. Make bullet points for last-minute prep: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ answer: response.text });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Error generating summary." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});
