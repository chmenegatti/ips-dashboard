// src/components/DatacenterPieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { AggregatedStats } from '../types/datacenter';

// --- Tipos para o Tooltip Customizado ---
import { TooltipProps } from 'recharts'; // Tipo base do Recharts
// Tipos auxiliares para Value e Name, se necessário refinar TooltipProps
// import { ValueType, NameType } from 'recharts';

// Define a estrutura esperada para cada item dentro do array 'payload'
// para o nosso gráfico de pizza específico.
interface PieChartPayload {
  name: string;   // Ex: 'IPs Usados'
  value: number;  // Ex: 163
  payload?: {     // O objeto original passado para a fatia da pizza
    name: string;
    value: number;
  };
  // fill?: string; // Cor da fatia (opcional)
  // ... outras propriedades que o Recharts pode adicionar
}

// Define as props para o nosso componente CustomTooltip,
// herdando de TooltipProps e especificando melhor o 'payload'.
interface CustomTooltipProps extends TooltipProps<number, string> {
  // Sobrescreve (ou refina) a definição de 'payload'
  // que vem de TooltipProps<ValueType, NameType>
  payload?: PieChartPayload[];
  active?: boolean; // Garante que 'active' está presente
}
// --- Fim dos Tipos para Tooltip ---

interface DatacenterPieChartProps {
  stats: AggregatedStats;
}

const DatacenterPieChart: React.FC<DatacenterPieChartProps> = ({ stats }) => {
  const theme = useTheme();

  const COLOR_USED = theme.palette.primary.main;
  const COLOR_FREE = theme.palette.grey[400];

  const data = [
    { name: 'IPs Usados', value: stats.used },
    { name: 'IPs Livres', value: stats.free },
  ];

  const total = stats.total;

  // --- CORREÇÃO APLICADA AQUI ---
  // Custom Tooltip tipado corretamente, substituindo o 'any' anterior
  // pela interface CustomTooltipProps definida acima.
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    // --- FIM DA CORREÇÃO ---
    // Agora o TypeScript sabe que 'active' é boolean? e 'payload' é PieChartPayload[]?
    if (active && payload && payload.length) {
      // Acesso seguro às propriedades, pois o tipo é conhecido
      const currentPayload = payload[0];
      const percent = total > 0 ? ((currentPayload.value / total) * 100).toFixed(1) : 0;
      return (
        <Paper elevation={3} sx={{ padding: '8px 12px', background: theme.palette.background.paper }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
            {`${currentPayload.name}: ${currentPayload.value} (${percent}%)`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={2} sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="h6" gutterBottom align="center">
        Utilização Geral de IPs
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <defs>
              <linearGradient id="gradientUsed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLOR_USED} stopOpacity={0.9} />
                <stop offset="95%" stopColor={COLOR_USED} stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
            >
              {/* Usar fill="url(#gradientUsed)" na Cell 'Usado' se quiser o gradiente */}
              <Cell key={`cell-0`} fill={COLOR_USED} />
              <Cell key={`cell-1`} fill={COLOR_FREE} />
            </Pie>
            {/* Passa o componente tipado corretamente para 'content' */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Legend verticalAlign="bottom" height={36} />
            {total > 0 && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fill={theme.palette.text.primary}
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
              >
                {`${stats.utilization.toFixed(1)}%`}
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DatacenterPieChart;