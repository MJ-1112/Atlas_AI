import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse";
import officeParser from "officeparser";
import fs from "fs";
import cors from "cors";
import path from "path";

dotenv.config();
console.log("Loaded key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");

const app = express();

// ✅ Enable CORS for frontend
const allowedOrigins = [
  "https://atlas-ai-dun.vercel.app", // your deployed frontend
  "http://localhost:5173", // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

let uploadedText = "";

// Upload route
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      uploadedText = pdfData.text;
      fs.unlinkSync(file.path);
      return res.status(200).json({ message: "PDF uploaded and read successfully" });
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
      const pptText = await officeParser.parseOfficeAsync(file.path);
      uploadedText = pptText;
      fs.unlinkSync(file.path);
      return res.status(200).json({ message: "PPT uploaded and read successfully" });
    } else {
      fs.unlinkSync(file.path);
      return res.status(415).json({ error: "File type not supported" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process file" });
  }
});

// Initialize Google AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Ask route
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
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Summarize route
app.post("/summarize", async (req, res) => {
  try {
    if (!uploadedText) return res.status(400).json({ error: "No text uploaded to summarize" });

    const prompt = `Summarize this for me in simple words as I am a student and you are a professional teacher teaching me, make bullet points for last minute prep: ${uploadedText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ answer: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
});

// Use Render's dynamic port or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});
