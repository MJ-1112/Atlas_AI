// src/pages/ChatPage.jsx
import React from "react";
import ChatBox from "../components/ChatBox";
import Sidebar from "../components/sidebar";

const ChatPage = () => {
  return (
    <div style={{ color: "white", height: "100%", display: "flex", flexDirection: "column" }}>

      <h2>Chat with Atlas AI</h2>
      
      <ChatBox />
    </div>
  );
};

export default ChatPage;
