// src/pages/SummaryPage.jsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Sidebar from "../components/sidebar";

const SummaryPage = () => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["application/pdf", "application/vnd.openxmlformats-officedocument.presentationml.presentation"].includes(file.type)) {
      alert("Only PDF and PPTX files are supported!");
      return;
    }
    alert(`Uploaded: ${file.name}`);
  };

  return (
    
    <Box
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 3,
      }}
    >

      <Typography variant="h5">Upload a file to summarize</Typography>
      <Typography variant="body1" sx={{ opacity: 0.8 }}>
        Only PDF and PPTX files supported
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        sx={{ backgroundColor: "#444" }}
      >
        Upload File
        <input hidden type="file" onChange={handleFileUpload} />
      </Button>
    </Box>
  );
};

export default SummaryPage;
