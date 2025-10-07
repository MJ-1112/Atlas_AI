import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#262626', // page background
      paper: '#333',      // drawer and cards
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#90caf9',
    },
  },
});

export default darkTheme;
