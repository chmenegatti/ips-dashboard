// src/App.tsx
import React, { useState } from 'react';
import {
  Box, Typography, CircularProgress, Alert, Container,
  Paper, Tabs, Tab,
  AppBar, Toolbar, IconButton // Importa AppBar, Toolbar, IconButton
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Ícone Lua (dark)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Ícone Sol (light)
import { useDatacenterData } from './hooks/useDatacenterData';
import DatacenterDetailView from './views/DatacenterDetailView';
import OverviewCards from './components/OverviewCards';
import { useThemeContext } from './contexts/ThemeContext'; // Importa o hook do contexto

// Função a11yProps (mantida)
function a11yProps(index: number) {
  return {
    id: `datacenter-tab-${index}`,
    'aria-controls': `datacenter-tabpanel-${index}`,
  };
}

function App() {
  const { data: datacenters, loading, error } = useDatacenterData();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const { mode: themeMode, toggleThemeMode } = useThemeContext(); // Usa o contexto para pegar modo e função toggle

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  // --- Renderização ---

  if (loading) {
    // Não precisa mais do ThemeProvider aqui, pois ele está em CustomThemeProvider
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    // Não precisa mais do ThemeProvider aqui
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert severity="error">Erro ao carregar dados: {error.message}</Alert>
      </Container>
    );
  }

  // --- Renderização Principal com Dados ---
  const selectedDatacenter = datacenters.length > 0 && selectedTabIndex < datacenters.length
    ? datacenters[selectedTabIndex]
    : null;

  return (
    // O CssBaseline já é aplicado pelo CustomThemeProvider
    <> {/* Usa Fragment ou Box como wrapper direto se necessário */}
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            Dashboard IPs
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit" aria-label="toggle theme">
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}> {/* Ajusta padding top */}
        {/* Título foi movido para o AppBar, ou pode ser mantido aqui se preferir */}
        {/* <Typography variant="h3" component="h1" ... /> */}

        <OverviewCards datacenters={datacenters} />

        {datacenters.length > 0 ? (
          <Paper elevation={2} sx={{ mt: 2, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
              <Tabs
                value={selectedTabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Abas dos Datacenters"
                indicatorColor="primary" // Garante que o indicador use a cor primária
                textColor="primary" // Garante que o texto da aba selecionada use a cor primária
              >
                {datacenters.map((dc, index) => (
                  <Tab key={dc.name} label={dc.name} {...a11yProps(index)} />
                ))}
              </Tabs>
            </Box>
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              {selectedDatacenter ? (
                <DatacenterDetailView datacenter={selectedDatacenter} />
              ) : (
                <Typography align="center" sx={{ p: 3 }}>Selecione um datacenter.</Typography>
              )}
            </Box>
          </Paper>
        ) : (
          <Typography align="center" sx={{ mt: 4 }} color="text.secondary">
            Nenhum dado de datacenter disponível para exibir detalhes.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default App;