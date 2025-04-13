// src/hooks/useDatacenterData.ts
import { useState, useEffect } from 'react';
import {
  DatacenterRawData,
  EdgeClusterItem,
  ProcessedDatacenter,
  PublicIpDetail,
  PublicAddress,
  ClusterData,
  FloatingIpGroups,
  FloatingIpEntry,
  ProcessedFloatingIp, // Importa o tipo ClusterData atualizado
} from '../types/datacenter'; // Ajuste o caminho se necessário

// Carrega os módulos JSON de forma 'eager' (imediata, incluídos no build)
const jsonModules = import.meta.glob<DatacenterRawData>('../data/*.consolidated.json', { eager: true });

// Função auxiliar para extrair nome do datacenter do caminho do arquivo
function getDatacenterNameFromPath(path: string): string {
  const filename = path.split('/').pop() || '';
  return filename.replace('.consolidated.json', '');
}

// Função auxiliar para processar um único arquivo JSON
function processSingleDatacenter(name: string, data: DatacenterRawData): ProcessedDatacenter {
  let aggregatedTotal = 0;
  let aggregatedUsed = 0;
  const publicIPs: PublicIpDetail[] = [];
  const floatingIPs: ProcessedFloatingIp[] = [];

  data.EdgeClusters.forEach((clusterItem: EdgeClusterItem) => {
    const clusterName = Object.keys(clusterItem)[0];
    if (!clusterName) return;

    // Acessa os dados do cluster. Pode ser útil usar uma asserção de tipo aqui
    // se o TypeScript não inferir corretamente a partir da chave dinâmica.
    const clusterData = clusterItem[clusterName] as ClusterData;

    aggregatedTotal += clusterData.Total || 0;
    aggregatedUsed += clusterData.Used || 0;

    // Encontra a chave dinâmica dos IPs públicos (ex: "public_T0-Cluster_1")
    // Usamos um type predicate para ajudar o TypeScript a entender o tipo da chave encontrada
    const publicIpKey = Object.keys(clusterData).find(
      (key): key is `public_${string}` => key.startsWith('public_')
    );

    // Verifica se a chave foi encontrada E se o valor (o objeto com Public_Address) existe
    if (publicIpKey && clusterData[publicIpKey]) {
      // Como verificamos a existência e usamos o type predicate, o TS infere o tipo corretamente.
      // O '!' assume que Public_Address existe dentro do objeto encontrado, o que é esperado pela estrutura.
      // Uma alternativa seria usar optional chaining clusterData[publicIpKey]?.Public_Address ?? []
      const publicAddresses: PublicAddress[] = clusterData[publicIpKey]!.Public_Address;

      publicAddresses.forEach(address => {
        publicIPs.push({
          ...address,
          clusterName: clusterName, // Adiciona a referência ao cluster
        });
      });
    }
  });

  if (data.Floatings) { // Verifica se a chave Floatings existe
    const floatingGroups: FloatingIpGroups = data.Floatings;
    // Itera sobre as chaves dinâmicas dos grupos (ex: "floating-dbc")
    for (const groupName in floatingGroups) {
      if (Object.prototype.hasOwnProperty.call(floatingGroups, groupName)) {
        const groupEntries: FloatingIpEntry[] = floatingGroups[groupName];
        // Itera sobre as entradas dentro de cada grupo
        groupEntries.forEach(entry => {
          floatingIPs.push({
            ...entry,
            groupName: groupName, // Adiciona o nome do grupo ao objeto processado
          });
        });
      }
    }
    // Ordena os floating IPs pelo nome do grupo e talvez pela descrição/IP para consistência
    floatingIPs.sort((a, b) => {
      if (a.groupName !== b.groupName) {
        return a.groupName.localeCompare(b.groupName);
      }
      return (a.Description + a.IpRange).localeCompare(b.Description + b.IpRange);
    });
  }

  const aggregatedFree = aggregatedTotal - aggregatedUsed;
  const utilization = aggregatedTotal > 0 ? (aggregatedUsed / aggregatedTotal) * 100 : 0;

  return {
    name,
    aggregatedStats: {
      total: aggregatedTotal,
      used: aggregatedUsed,
      free: aggregatedFree,
      utilization: parseFloat(utilization.toFixed(1)),
    },
    publicIPs,
    floatingIPs,
    rawData: data,
  };
}

// Hook customizado para carregar e processar todos os dados dos datacenters
export function useDatacenterData(): { data: ProcessedDatacenter[]; loading: boolean; error: Error | null } {
  const [data, setData] = useState<ProcessedDatacenter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const processedData: ProcessedDatacenter[] = [];

      for (const path in jsonModules) {
        const rawData = jsonModules[path];
        // Validação básica da estrutura do JSON carregado
        if (rawData && Array.isArray(rawData.EdgeClusters)) {
          const name = getDatacenterNameFromPath(path);
          processedData.push(processSingleDatacenter(name, rawData));
        } else {
          console.warn(`Dados inválidos ou estrutura inesperada encontrada em: ${path}. Arquivo ignorado.`);
          // Considerar logar o objeto rawData para depuração, se necessário
          // throw new Error(`Dados inválidos em ${path}`); // Ou lançar um erro se preferir interromper
        }
      }

      // Ordena os datacenters por nome para exibição consistente
      processedData.sort((a, b) => a.name.localeCompare(b.name));

      setData(processedData);
      setError(null);

    } catch (err) {
      console.error("Erro durante o processamento dos dados do datacenter:", err);
      setError(err instanceof Error ? err : new Error('Ocorreu um erro desconhecido ao processar os dados.'));
    } finally {
      setLoading(false);
    }
  }, []); // Array de dependências vazio para executar apenas uma vez

  return { data, loading, error };
}