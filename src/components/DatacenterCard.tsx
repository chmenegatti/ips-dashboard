// src/components/DatacenterCard.tsx
import React from 'react';
import {
  Card, CardContent, Typography, Box, LinearProgress, useTheme, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';
import { ProcessedDatacenter } from '../types/datacenter';

interface DatacenterCardProps {
  datacenter: ProcessedDatacenter;
}

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
  },
}));

const getUtilizationColor = (utilization: number): ('success' | 'warning' | 'error') => {
  if (utilization < 70) return 'success';
  if (utilization < 90) return 'warning';
  return 'error';
};

const DatacenterCard: React.FC<DatacenterCardProps> = ({ datacenter }) => {
  const theme = useTheme();
  const utilization = datacenter.aggregatedStats.utilization;
  const color = getUtilizationColor(utilization);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${theme.palette[color].main}` }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <StorageIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1 }}>
            {datacenter.name}
          </Typography>
          <Chip label={`${utilization.toFixed(1)}%`} color={color} size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          IPs Utilizados:
        </Typography>
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          {datacenter.aggregatedStats.used} / {datacenter.aggregatedStats.total}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <BorderLinearProgress
              variant="determinate"
              value={utilization}
              color={color}
            />
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary">
          {`Livres: ${datacenter.aggregatedStats.free}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DatacenterCard;