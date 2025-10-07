import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Typewriter } from "react-simple-typewriter";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/ask", {
        question: input,
      });

      const botMessage = {
        sender: "bot",
        text: res.data.answer || "No response received.",
      };

      setMessages((prev) => [...prev, botMessage]);
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

  return (
    <Box
      sx={{
        height: "100vh",
        p: 3,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#262626",
        color: "white",
      }}
    >
      {/* Messages area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
            {msg.sender === "bot" ? (
              <Typewriter
                words={[msg.text]}   // use the actual bot text here
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={50}
                deleteSpeed={20}
              />
            ) : (
              <Typography>{msg.text}</Typography>
            )}
          </Paper>
        ))}

        {isLoading && (
          <Typography sx={{ color: "#aaa", fontStyle: "italic" }}>
            Typing...
          </Typography>
        )}
      </Box>

      {/* Input box */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            bgcolor: "#333",
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatPage;
