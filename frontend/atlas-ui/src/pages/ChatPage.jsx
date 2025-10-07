import React, { useState, useRef } from "react";
import axios from "axios";
import { Box, TextField, IconButton, Typography, Paper, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Typewriter } from "react-simple-typewriter";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAIText, setCurrentAIText] = useState("");
  const stopTypingRef = useRef(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    stopTypingRef.current = false;
    setCurrentAIText("");

    try {
      const res = await axios.post("https://atlas-ai-33l9.onrender.com/ask", { question: input });
      const aiText = res.data.answer || "No response received.";

      setCurrentAIText(aiText);
      setMessages((prev) => [...prev, { sender: "bot", text: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopAI = () => {
    stopTypingRef.current = true;
    setIsLoading(false);
  };

  return (
    <Box sx={{ height: "100vh", p: 3, display: "flex", flexDirection: "column", bgcolor: "#262626", color: "white" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {messages.map((msg, i) => (
          <Paper
            key={i}
            sx={{
              p: 1.5,
              bgcolor: msg.sender === "user" ? "#1976d2" : "#333",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              borderRadius: 2,
            }}
          >
            <Typography>{msg.text}</Typography>
          </Paper>
        ))}
      </Box>

      {isLoading && (
        <Typography sx={{ color: "#aaa", fontStyle: "italic", mb: 1 }}>Typing...</Typography>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          sx={{
            bgcolor: "#333",
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
          }}
        />
        <IconButton color="primary" onClick={handleSend}><SendIcon /></IconButton>
        {isLoading && (
          <Button variant="contained" color="secondary" onClick={handleStopAI}>
            Stop
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
