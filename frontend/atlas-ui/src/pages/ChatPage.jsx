import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { Box } from '@mui/material';

const ChatPage = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#262626' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Chat area */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <ChatBox />
      </Box>
    </Box>
  );
};  

export default ChatPage;
