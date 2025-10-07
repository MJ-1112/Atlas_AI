import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Avatar, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SummarizeIcon from '@mui/icons-material/Summarize';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: 240, 
          boxSizing: 'border-box', 
          bgcolor: '#333',  // Darker drawer background
          color: 'white'
        },
      }}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Avatar
          src="/public/Atlas_AI_Logo_-_Dark_Blue_and_Charcoal-removebg-preview.png"
          alt="Logo"
          sx={{ width: 80, height: 80, margin: '0 auto' }}
        />
        <Typography variant="h6" sx={{ marginTop: 1 }}>Atlas AI</Typography>
        <Typography variant="body2" color="grey.400">Signed in as User</Typography>
      </div>
      <Divider sx={{ borderColor: 'grey.700' }} />
      <List>
        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}><ChatIcon /></ListItemIcon>
          <ListItemText primary="Chat with AI" />
        </ListItem>
        <ListItem button>
          <ListItemIcon sx={{ color: 'white' }}><SummarizeIcon /></ListItemIcon>
          <ListItemText primary="Summarize" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
