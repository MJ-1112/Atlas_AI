import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Typewriter } from "react-simple-typewriter";

const SummaryPage = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAndSummarize = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    setSummary(""); // reset old summary

    try {
      // 1️⃣ Upload the file
      const uploadRes = await axios.post(
        "https://atlas-ai-33l9.onrender.com/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload response:", uploadRes.data);

      // 2️⃣ Then summarize (after upload success)
      const summarizeRes = await axios.post(
        "https://atlas-ai-33l9.onrender.com/summarize"
      );

      console.log("Summarize response:", summarizeRes.data);
      setSummary(summarizeRes.data.answer || "No summary generated.");
    } catch (err) {
      console.error("Upload/Summarize error:", err);
      setSummary("Error summarizing document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#262626",
        color: "white",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Upload your document for summarization
      </Typography>
      <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
        Only PDF and PPTX files supported
      </Typography>

      <input
        type="file"
        accept=".pdf,.pptx"
        onChange={handleFileChange}
        style={{ marginBottom: "10px", color: "white" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadAndSummarize}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Upload & Summarize"
        )}
      </Button>

      {summary && (
        <Box
          sx={{
            mt: 4,
            p: 2,
            bgcolor: "#333",
            borderRadius: 2,
            width: "80%",
            maxWidth: "700px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Summary
          </Typography>
          <Typewriter
            words={[summary]}
            loop={1}
            cursor
            cursorStyle="_"
            typeSpeed={25}
          />
        </Box>
      )}
    </Box>
  );
};

export default SummaryPage;
