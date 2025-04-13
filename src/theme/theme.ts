import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1E88E5' }, // Azul para destaque
    secondary: { main: '#43A047' }, // Verde para contrastar
    background: { default: '#121212', paper: '#1E1E1E' },
  },
  typography: { fontFamily: 'Inter, Arial, sans-serif' },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1E88E5' },
    secondary: { main: '#43A047' },
    background: { default: '#ffffff', paper: '#f5f5f5' },
  },
  typography: { fontFamily: 'Inter, Arial, sans-serif' },
});
