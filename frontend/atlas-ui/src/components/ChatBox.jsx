import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, user: true }]);
    setInput('');
    // Example AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "AI response here...", user: false }]);
    }, 500);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'inline-block',
              mb: 1,
              p: 1,
              borderRadius: 2,
              maxWidth: '70%',
              alignSelf: msg.user ? 'flex-end' : 'flex-start',
              bgcolor: msg.user ? 'primary.main' : 'grey.800',
              color: msg.user ? 'white' : 'white',
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1, p: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          sx={{
            input: { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'grey.700' },
              '&:hover fieldset': { borderColor: 'primary.main' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
