// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Importações da Fonte Inter
import '@fontsource/inter/300.css'; // Light (opcional)
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/700.css'; // Bold
// Importe o ThemeProvider customizado que criaremos a seguir
import CustomThemeProvider from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos o App com nosso Provedor de Tema */}
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  </React.StrictMode>,
);