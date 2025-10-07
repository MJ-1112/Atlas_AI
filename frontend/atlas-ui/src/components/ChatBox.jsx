// src/components/ChatBox.jsx
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChats([...chats, { user: "You", text: message }]);
    setMessage("");
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#333",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        {chats.map((c, i) => (
          <Box key={i} sx={{ mb: 1 }}>
            <strong>{c.user}: </strong> {c.text}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          sx={{
            backgroundColor: "#222",
            input: { color: "#fff" },
            "& fieldset": { borderColor: "#555" },
          }}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
