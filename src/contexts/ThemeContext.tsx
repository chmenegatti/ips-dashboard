// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { lightTheme, darkTheme } from '../theme'; // Importa nossos temas definidos

// Define o tipo para o valor do contexto
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleThemeMode: () => void;
}

// Cria o Contexto
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark', // Valor padrão inicial
  toggleThemeMode: () => { console.warn('toggleThemeMode function not ready'); }, // Placeholder
});

// Cria o Provedor do Contexto
const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Verifica a preferência do sistema
  const prefersDarkMode = useMediaQuery('@media (prefers-color-scheme: dark)');

  // Estado para o modo atual, inicializa com localStorage ou preferência do sistema
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try {
      const storedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
      if (storedMode) {
        return storedMode;
      }
      return prefersDarkMode ? 'dark' : 'light'; // Usa preferência do sistema se não houver nada salvo
    } catch (error) {
      console.error("Could not read theme preference from localStorage", error);
      // Em caso de erro (ex: localStorage bloqueado), usa preferência do sistema
      return prefersDarkMode ? 'dark' : 'light';
    }
  });

  // Salva a preferência no localStorage sempre que o modo mudar
  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error("Could not save theme preference to localStorage", error);
    }
  }, [mode]);

  // Função para alternar o modo
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Seleciona o objeto de tema correto baseado no modo atual
  // useMemo otimiza para não recriar o tema a cada renderização se o modo não mudar
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Monta o valor do contexto
  const contextValue = useMemo(() => ({ mode, toggleThemeMode }), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Aplica o tema do MUI e o CssBaseline */}
      <MuiThemeProvider theme={theme}>
        <CssBaseline /> {/* Normaliza CSS e aplica fundo/cor de texto do tema */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useThemeContext = () => useContext(ThemeContext);

export default CustomThemeProvider; // Exporta o Provedor