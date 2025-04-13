// src/views/DatacenterDetailView.tsx
import React from 'react';
// Importações permanecem as mesmas
import { Box, Typography, Grid } from '@mui/material';
import { ProcessedDatacenter } from '../types/datacenter';
import DatacenterPieChart from '../components/DatacenterPieChart';
import DatacenterPublicIpTable from '../components/DatacenterPublicIpTable';

interface DatacenterDetailViewProps {
  datacenter: ProcessedDatacenter;
}

const DatacenterDetailView: React.FC<DatacenterDetailViewProps> = ({ datacenter }) => {
  if (!datacenter) {
    return null;
  }

  return (
    <Box sx={{ pt: 3, pb: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        {datacenter.name}
      </Typography>

      {/* Grid Pai - 'container' permanece */}
      <Grid container spacing={3} alignItems="stretch">

        {/* --- CORREÇÃO APLICADA AQUI --- */}
        {/* Grid Filho #1 - Remove 'item', usa 'size' com objeto */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DatacenterPieChart stats={datacenter.aggregatedStats} />
        </Grid>

        {/* Grid Filho #2 - Remove 'item', usa 'size' com objeto */}
        <Grid size={{ xs: 12, md: 8 }}>
          <DatacenterPublicIpTable publicIPs={datacenter.publicIPs} />
        </Grid>
        {/* --- FIM DA CORREÇÃO --- */}

      </Grid>
    </Box>
  );
};

export default DatacenterDetailView;