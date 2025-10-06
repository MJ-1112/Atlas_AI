import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
console.log("Loaded key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");


const app = express();
app.use(express.json()); 


const ai = new GoogleGenAI({});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });
  console.log(response.text);
  res.status(200).json({ answer: response.text });

}

main();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("✅ App is running on http://localhost:3000");
});
