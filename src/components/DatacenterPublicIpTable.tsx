// src/components/DatacenterPublicIpTable.tsx
import React, { useMemo, memo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, useTheme
} from '@mui/material';
import { PublicIpDetail } from '../types/datacenter';

interface DatacenterPublicIpTableProps {
  publicIPs: PublicIpDetail[];
}

const DatacenterPublicIpTable: React.FC<DatacenterPublicIpTableProps> = ({ publicIPs }) => {
  const theme = useTheme();

  // Otimização com useMemo para agrupar IPs
  const { groupedIPs, sortedClusterNames } = useMemo(() => {
    // console.log("Recalculando agrupamento de IPs para tabela");
    const grouped = publicIPs.reduce((acc, ip) => {
      const cluster = ip.clusterName;
      if (!acc[cluster]) {
        acc[cluster] = [];
      }
      acc[cluster].push(ip);
      return acc;
    }, {} as { [key: string]: PublicIpDetail[] });

    const sorted = Object.keys(grouped).sort();
    return { groupedIPs: grouped, sortedClusterNames: sorted };
  }, [publicIPs]);


  if (publicIPs.length === 0) {
    return (
      <Paper elevation={2} sx={{ padding: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Nenhum bloco de IP público encontrado neste Datacenter.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Container com altura máxima e scroll */}
      <TableContainer sx={{ maxHeight: 440 }}>
        {/* Tabela com cabeçalho fixo */}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {/* --- CORREÇÃO APLICADA AQUI --- */}
              {/* Adiciona backgroundColor às células do cabeçalho sticky */}
              {/* para que o conteúdo do corpo não passe por cima visualmente. */}
              <TableCell sx={{
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper, // Cor de fundo opaca
              }}>
                Endereço/Prefixo
              </TableCell>
              <TableCell align="right" sx={{
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper, // Cor de fundo opaca
              }}>
                Total
              </TableCell>
              <TableCell align="right" sx={{
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper, // Cor de fundo opaca
              }}>
                Usados
              </TableCell>
              <TableCell align="right" sx={{
                fontWeight: 'bold',
                backgroundColor: theme.palette.background.paper, // Cor de fundo opaca
              }}>
                Livres
              </TableCell>
              {/* --- FIM DA CORREÇÃO --- */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedClusterNames.map((clusterName) => (
              <React.Fragment key={clusterName}>
                {/* Linha de Subcabeçalho para o Cluster */}
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell
                    colSpan={4}
                    sx={{
                      fontWeight: 'bold',
                      // Ajusta o fundo do sub-header para diferenciar ligeiramente
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.palette.grey[100],
                      // Mantém um padding menor e borda sutil se desejar
                      // py: 0.5,
                      // borderBottom: `1px solid ${theme.palette.divider}`,
                      // borderTop: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    Cluster: {clusterName}
                  </TableCell>
                </TableRow>
                {/* Linhas de Dados para IPs deste Cluster */}
                {groupedIPs[clusterName].map((ip) => (
                  <TableRow
                    key={ip.Id || `${ip.Address}/${ip.Prefix}`}
                    hover
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {ip.Address}/{ip.Prefix}
                    </TableCell>
                    <TableCell align="right">{ip.Total}</TableCell>
                    <TableCell align="right">{ip.Used}</TableCell>
                    <TableCell align="right">{ip.Free}</TableCell>
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

// Mantém a memoização
export default memo(DatacenterPublicIpTable);