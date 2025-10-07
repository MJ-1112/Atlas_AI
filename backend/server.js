import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import multer from "multer";
import pkg from "pdf-parse";
import officeParser from "officeparser";
import fs from "fs";
import cors from "cors";

const pdf = pkg;

dotenv.config();
console.log("Loaded key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");

const app = express();

app.use(cors({
  origin: "https://atlas-ai-dun.vercel.app", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
const upload = multer({ dest: "uploads/" });

let text = "";

// ✅ Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ Upload route
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdf(dataBuffer);
      extractedText = pdfData.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const pptText = await officeParser.parseOfficeAsync(file.path);
      extractedText = pptText;
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "File type not supported" });
    }

    text = extractedText;
    fs.unlinkSync(file.path);

    res.status(200).json({ message: "File uploaded and read successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process the file" });
  }
});

// ✅ Initialize AI
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Ask route
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Ask error:", error);
    res.status(500).json({ error: "Something went wrong while asking AI" });
  }
});

// ✅ Summarize route
app.post("/summarize", async (req, res) => {
  try {
    if (!text) {
      return res.status(400).json({ error: "No document uploaded yet" });
    }

    const prompt = `Summarize this for me in simple words as if you are a teacher explaining to a student. 
    Include bullet points for last-minute revision:\n\n${text}`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({ answer: summary });
  } catch (error) {
    console.error("Summarize error:", error);
    res.status(500).json({ error: "Failed to summarize document" });
  }
});

// ✅ Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
