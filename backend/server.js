import express from "express";
import { GoogleGenerativeAI } from "@google/genai"; // ✅ correct class name
import dotenv from "dotenv";
import multer from "multer";
import pdf from "pdf-parse"; // ✅ no destructuring
import officeParser from "officeparser";
import fs from "fs";
import cors from "cors";

dotenv.config();
console.log("🔑 GEMINI API KEY:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing");

const app = express();

app.use(
  cors({
    origin: "https://atlas-ai-dun.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
const upload = multer({ dest: "uploads/" });
let text = "";

// ✅ health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ✅ upload endpoint
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
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
      res.status(415).json({ error: "❌ File type not supported" });
    }

    fs.unlinkSync(file.path);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Error reading file" });
  }
});

// ✅ Gemini initialization
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ chat endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(question);

    res.status(200).json({ answer: result.response.text() });
  } catch (error) {
    console.error("Ask Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ summarize endpoint
app.post("/summarize", async (req, res) => {
  try {
    if (!text) return res.status(400).json({ error: "No uploaded document found" });

    const prompt = `Summarize this text simply as if explaining to a student, and list bullet points for quick revision:\n\n${text}`;
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    res.status(200).json({ answer: result.response.text() });
  } catch (error) {
    console.error("Summarize Error:", error);
    res.status(500).json({ error: "Error during summarization" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
