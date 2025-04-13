// src/App.tsx
import React, { useState } from 'react';
import {
  Box, Typography, CssBaseline, CircularProgress, Alert, Container,
  ThemeProvider, createTheme, Tabs, Tab, Paper
} from '@mui/material';
import { useDatacenterData } from './hooks/useDatacenterData';
import DatacenterDetailView from './components/DatacenterDetailView'; // <-- Sua view de detalhes
import OverviewCards from './components/OverviewCards'; // <-- Componente dos cards

// Definição do tema escuro (pode ser movida para src/theme.ts depois)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3', // Azul padrão MUI
    },
    background: {
      default: '#121212', // Fundo bem escuro
      paper: '#1e1e1e',   // Fundo para Paper/Card/Tabs
    },
    // Cores semânticas para status (usadas no Card)
    success: { main: '#66bb6a' },
    warning: { main: '#ffa726' },
    error: { main: '#f44336' },
  },
  // Futuras customizações (tipografia, espaçamentos, etc)
});

// Função auxiliar para props de acessibilidade das abas
function a11yProps(index: number) {
  return {
    id: `datacenter-tab-${index}`,
    'aria-controls': `datacenter-tabpanel-${index}`,
  };
}

function App() {
  const { data: datacenters, loading, error } = useDatacenterData();
  // Estado para controlar o índice da aba selecionada
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  // Handler para atualizar o estado quando uma aba é clicada
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  // --- Renderização ---

  // 1. Carregando...
  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // 2. Erro no carregamento
  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Alert severity="error">Erro ao carregar dados: {error.message}</Alert>
        </Container>
      </ThemeProvider>
    );
  }

  // 3. Dados carregados com sucesso
  const selectedDatacenter = datacenters.length > 0 && selectedTabIndex < datacenters.length
    ? datacenters[selectedTabIndex]
    : null;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Título Principal */}
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Dashboard de IPs
        </Typography>

        {/* === Seção de Visão Geral (Cards) === */}
        <OverviewCards datacenters={datacenters} />

        {/* === Seção de Detalhes com Abas === */}
        {datacenters.length > 0 ? (
          // Usamos Paper para agrupar visualmente as Abas e o Conteúdo
          <Paper elevation={2} sx={{ mt: 2, overflow: 'hidden' }}> {/* elevation e overflow */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
              <Tabs
                value={selectedTabIndex}
                onChange={handleTabChange}
                variant="scrollable" // Permite rolar horizontalmente
                scrollButtons="auto" // Mostra botões de rolagem se necessário
                aria-label="Abas dos Datacenters"
              // Estilos adicionais para as abas se necessário via sx prop
              >
                {datacenters.map((dc, index) => (
                  <Tab
                    key={dc.name}
                    label={dc.name}
                    {...a11yProps(index)} // Props de acessibilidade
                  />
                ))}
              </Tabs>
            </Box>

            {/* Área onde o conteúdo detalhado da aba selecionada é renderizado */}
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}> {/* Padding responsivo */}
              {selectedDatacenter ? (
                <DatacenterDetailView datacenter={selectedDatacenter} />
              ) : (
                // Mensagem caso algo dê errado com a seleção (não deve ocorrer normalmente)
                <Typography align="center" sx={{ p: 3 }}>Selecione um datacenter.</Typography>
              )}
            </Box>
          </Paper>
        ) : (
          // Mensagem se não houver datacenters após o carregamento
          <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
            Nenhum dado de datacenter disponível para exibir detalhes.
          </Typography>
        )}

      </Container>
    </ThemeProvider>
  );
}

export default App;