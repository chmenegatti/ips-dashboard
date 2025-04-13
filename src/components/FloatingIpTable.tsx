// src/components/FloatingIpTable.tsx
import React, { useMemo, memo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, useTheme, Tooltip
} from '@mui/material';
import { ProcessedFloatingIp } from '../types/datacenter';

interface FloatingIpTableProps {
  floatingIPs: ProcessedFloatingIp[];
}

const FloatingIpTable: React.FC<FloatingIpTableProps> = ({ floatingIPs }) => {
  const theme = useTheme();

  // Agrupa os IPs por nome do grupo para renderização
  // (Reutilizamos useMemo aqui também para otimização)
  const { groupedIPs, sortedGroupNames } = useMemo(() => {
    // console.log("Recalculando agrupamento de Floating IPs");
    const grouped = floatingIPs.reduce((acc, ip) => {
      const group = ip.groupName;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(ip);
      return acc;
    }, {} as { [key: string]: ProcessedFloatingIp[] });

    const sorted = Object.keys(grouped).sort(); // Ordena os nomes dos grupos
    return { groupedIPs: grouped, sortedGroupNames: sorted };
  }, [floatingIPs]); // Dependência: recalcula apenas se floatingIPs mudar

  if (!floatingIPs || floatingIPs.length === 0) {
    // Não renderiza nada ou mostra uma mensagem se não houver floatings
    // Poderia retornar null ou um Paper com Typography
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        Nenhum Floating IP encontrado neste Datacenter.
      </Typography>
    );
  }

  return (
    // Usamos Paper para consistência visual com as outras tabelas/gráficos
    <Paper elevation={2} sx={{ overflow: 'hidden', mt: 3 }}> {/* Adiciona margem superior */}
      <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: 'bold', backgroundColor: theme.palette.background.paper }}>
        Floating IPs
      </Typography>
      {/* Container com altura máxima opcional e scroll */}
      <TableContainer sx={{ maxHeight: 400 }}>
        {/* Tabela com cabeçalho fixo */}
        <Table stickyHeader aria-label="floating ip sticky table">
          <TableHead>
            <TableRow>
              {/* Colunas */}
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper, width: '35%' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper, width: '25%' }}>Endereço/Prefixo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedGroupNames.map((groupName) => (
              <React.Fragment key={groupName}>
                {/* Linha de Subcabeçalho para o Grupo */}
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell
                    colSpan={3} // Ocupa todas as colunas
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.grey[100],
                      py: 0.5, // Padding vertical menor para subheader
                    }}
                  >
                    Grupo: {groupName}
                  </TableCell>
                </TableRow>
                {/* Linhas de Dados para IPs deste Grupo */}
                {groupedIPs[groupName].map((ip) => (
                  <TableRow
                    key={ip.Id}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    {/* Usamos Tooltip para ver o ID completo ao passar o mouse */}
                    <TableCell component="th" scope="row">
                      <Tooltip title={ip.Id} placement="top-start">
                        <Typography variant="body2" noWrap sx={{ maxWidth: '250px' }}> {/* Limita largura e evita quebra */}
                          {ip.Id}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{ip.Description}</TableCell>
                    <TableCell>{ip.IpRange}/{ip.Prefix}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

// Memoiza o componente
export default memo(FloatingIpTable);