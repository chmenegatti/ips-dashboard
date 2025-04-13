// src/theme.ts
import { createTheme, PaletteOptions } from '@mui/material/styles';

// Paleta de Cores para o Tema Escuro (Inspirado na Imagem)
const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    // main: '#39A7FF', // Azul Claro/Cyan (da imagem)
    main: '#007bff', // Azul um pouco mais vibrante e comum
    // light: '#7BC8FF', // Variação clara se necessário
    // dark: '#0056b3', // Variação escura se necessário
  },
  secondary: { // Cor secundária para contraste ou elementos menores
    main: '#6c757d', // Cinza (pode ajustar)
  },
  background: {
    default: '#0b1437', // Fundo Azul Escuro/Púrpura (da imagem)
    paper: '#111c44',   // Fundo de 'cards' um pouco mais claro (da imagem)
  },
  text: {
    primary: '#ffffff',       // Texto principal branco
    secondary: '#a0aec0',   // Texto secundário acinzentado
    // disabled: '#4a5568', // Texto desabilitado
  },
  divider: 'rgba(160, 174, 192, 0.2)', // Cor do divisor
  // Cores semânticas (mantendo as definidas anteriormente)
  success: { main: '#66bb6a' },
  warning: { main: '#ffa726' },
  error: { main: '#f44336' },
  info: { main: '#2196f3' }, // Azul padrão para informação
};

// Paleta de Cores para o Tema Claro (Padrões do MUI ou customizado)
const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#007bff', // Mesmo azul primário para consistência
  },
  secondary: {
    main: '#6c757d',
  },
  background: {
    default: '#f8f9fa', // Fundo quase branco
    paper: '#ffffff',   // Papel branco
  },
  text: {
    primary: '#212529', // Texto escuro
    secondary: '#6c757d', // Texto secundário cinza
  },
  // Manter cores semânticas consistentes se possível
  success: { main: '#198754' }, // Verde mais escuro para contraste
  warning: { main: '#ffc107' }, // Amarelo
  error: { main: '#dc3545' },   // Vermelho
  info: { main: '#0dcaf0' },    // Cyan/Azul claro
};

// Função para criar o tema base com tipografia e outros padrões
const createBaseTheme = (palette: PaletteOptions) => createTheme({
  palette: palette,
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif', // Define a fonte padrão
    h3: { // Ajuste tamanhos/pesos se desejar
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600, // Um pouco mais pesado para títulos de seção
    },
    h6: {
      fontWeight: 600, // Títulos de card
    },
    // Ajustar outros variantes se necessário
  },
  // Outras customizações globais (shape, spacing, components defaults) podem vir aqui
  components: {
    // Exemplo: Customização padrão para MuiPaper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Garante que não haja background images estranhas em Paper
        },
        // elevation: ... // pode customizar sombras
      }
    },
    // Exemplo: Customização padrão para MuiCard
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Garante que não haja background images estranhas em Card
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({ // Estilo para cabeçalhos de tabela
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.palette.grey[200],
          fontWeight: 'bold',
        }),
        // Estilo para a linha de subcabeçalho do cluster na tabela
        // Poderíamos criar uma classe ou usar sx prop como fizemos, mas aqui seria global
      }
    }
  }
});

// Exporta os temas criados
export const darkTheme = createBaseTheme(darkPalette);
export const lightTheme = createBaseTheme(lightPalette);