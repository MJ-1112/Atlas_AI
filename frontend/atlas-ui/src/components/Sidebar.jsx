// src/components/Sidebar.jsx
import React from "react";
import { Box, Avatar, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: "#1E1E1E",
        color: "white",
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Atlas AI
      </Typography>

      <Divider sx={{ width: "100%", mb: 2, bgcolor: "#444" }} />

      {/* User Info */}
      {user && (
        <>
          <Avatar src={user.photoURL} alt={user.displayName} sx={{ mb: 1 }} />
          <Typography variant="body1">{user.displayName}</Typography>
          <Typography variant="caption" sx={{ mb: 2 }}>
            {user.email}
          </Typography>
        </>
      )}

      <Divider sx={{ width: "100%", mb: 2, bgcolor: "#444" }} />

      {/* Nav buttons */}
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        sx={{ mb: 1 }}
        onClick={() => navigate("/chat")}
      >
        Chat with AI
      </Button>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        sx={{ mb: 3 }}
        onClick={() => navigate("/summary")}
      >
        Summarize Docs
      </Button>

      <Divider sx={{ width: "100%", mb: 2, bgcolor: "#444" }} />

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Sidebar;
