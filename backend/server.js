import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import {pdf} from 'pdf-parse';
import officeParser from "officeparser";
import fs from 'fs';

dotenv.config();
console.log("Loaded key:", process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Not found");


const app = express();
app.use(express.json()); 
const upload = multer({dest:"uploads/"});
let text ="";
app.post('/uploads',upload.single("file"), async(req,res)=>{
    try {
        const file = req.file;
        if(!file){
           return  res.send(402).json({message: "No file uploaded"});
        }
        // pdf file

        if(file.mimetype == "application/pdf"){
            const dataBuffer = await fs.readFileSync(file.path);
            const pdfData = await pdf(dataBuffer);
            text = pdfData.text;
            res.send(202).json({message: "pdf uploaded and read successfully"});
        }

        //ppt file

        else if (file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
             const pptText = await officeParser.parseOfficeAsync(file.path);
             text = pptText;
        }
        else{
            res.send(501).json({error:"File type not compatible"});
        }
        await fs.unlinkSync(file.path);
        
    } catch (error) {
        return res.send(400).json({error});
        
    }

})


const ai = new GoogleGenAI({});

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
-
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: question,
  });

  res.status(200).json({ answer: response.text });

}

main();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post('/summarize',async(req,res)=>{
    const prompt = `Summarize this for me in simple words as I am a student and you are a proffesional teacher teaching me , and make bullet go to points for last minute prep for the text : ${text}`;
    async function main() {
      const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
  });

  res.status(200).json({ answer: response.text });
  


}

main();
})




app.listen(3000, () => {
  console.log("✅ App is running on http://localhost:3000");
});
