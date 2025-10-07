// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import SummaryPage from "./pages/SummaryPage";
import Sidebar from "./components/sidebar";
import { useAuth } from "./context/AuthContext";
import { Box } from "@mui/material";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Home - no sidebar */}
        <Route path="/" element={<Home />} />

        {/* Protected pages with sidebar */}
        <Route
          path="/chat"
          element={
            user ? (
              <Box sx={{ display: "flex", height: "100vh", bgcolor: "#262626" }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1 }}>
                  <ChatPage />
                </Box>
              </Box>
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="/summary"
          element={
            user ? (
              <Box sx={{ display: "flex", height: "100vh", bgcolor: "#262626" }}>
                <Sidebar />
                <Box sx={{ flexGrow: 1 }}>
                  <SummaryPage />
                </Box>
              </Box>
            ) : (
              <Home />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
