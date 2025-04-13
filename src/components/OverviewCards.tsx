// src/components/OverviewCards.tsx
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import DatacenterCard from './DatacenterCard';
import { ProcessedDatacenter } from '../types/datacenter';

interface OverviewCardsProps {
  datacenters: ProcessedDatacenter[];
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ datacenters }) => {
  if (!datacenters || datacenters.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 4 }}>
        Nenhum datacenter para exibir na visão geral.
      </Typography>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Visão Geral dos Datacenters
      </Typography>
      <Grid container spacing={2}>
        {datacenters.map((dc) => (
          <Grid key={dc.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <DatacenterCard datacenter={dc} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OverviewCards;