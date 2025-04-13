// src/components/DatacenterPublicIpTable.tsx
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, useTheme
} from '@mui/material';
import { PublicIpDetail } from '../types/datacenter';

interface DatacenterPublicIpTableProps {
  publicIPs: PublicIpDetail[];
}

const DatacenterPublicIpTable: React.FC<DatacenterPublicIpTableProps> = ({ publicIPs }) => {
  const theme = useTheme();

  // Agrupa os IPs por nome do cluster para renderização
  const groupedIPs = publicIPs.reduce((acc, ip) => {
    const cluster = ip.clusterName;
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push(ip);
    return acc;
  }, {} as { [key: string]: PublicIpDetail[] });

  // Ordena os nomes dos clusters para exibição consistente
  const sortedClusterNames = Object.keys(groupedIPs).sort();

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
    <Paper elevation={2} sx={{ overflow: 'hidden' }}> {/* Oculta overflow se necessário */}
      <TableContainer sx={{ maxHeight: 440 }}> {/* Altura máxima com scroll */}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {/* Colunas da Tabela */}
              <TableCell sx={{ fontWeight: 'bold' }}>Endereço/Prefixo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Usados</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Livres</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedClusterNames.map((clusterName) => (
              <React.Fragment key={clusterName}>
                {/* Linha de Subcabeçalho para o Cluster */}
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell
                    colSpan={4} // Ocupa todas as colunas
                    sx={{
                      // py: 1, px: 2 // Menos padding vertical
                      fontWeight: 'bold',
                      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], // Fundo diferente
                      // borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    Cluster: {clusterName}
                  </TableCell>
                </TableRow>
                {/* Linhas de Dados para IPs deste Cluster */}
                {groupedIPs[clusterName].map((ip) => (
                  <TableRow
                    key={ip.Id || `${ip.Address}/${ip.Prefix}`} // Usa ID ou combinação como chave
                    hover // Efeito ao passar o mouse
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 }, // Remove borda da última linha do grupo
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

export default DatacenterPublicIpTable;