// src/types/datacenter.ts

// --- Estrutura de Dados Bruta (JSON) ---

export interface PublicAddress {
  Id: string;
  Address: string;
  Prefix: string;
  Total: number;
  Used: number;
  Free: number;
}

// Interface para as propriedades conhecidas e fixas do cluster
interface BaseClusterData {
  Free: number;
  Total: number;
  Used: number;
  VirtualFirewall: string;
}

// Tipo que representa a parte OPCIONAL com a chave dinâmica para IPs públicos
// Usa Template Literal Type (`public_${string}`) para validar o padrão da chave
type PublicIpPart = {
  [K in `public_${string}`]?: { // A chave DEVE começar com "public_" e é opcional (?)
    Public_Address: PublicAddress[];
  };
};

// O tipo final do ClusterData é a INTERSEÇÃO (&) das propriedades base
// e da parte opcional dos IPs públicos.
export type ClusterData = BaseClusterData & PublicIpPart;


// Interface para um item no array EdgeClusters
// A chave é dinâmica (ex: "T0-Cluster_1")
export interface EdgeClusterItem {
  [clusterName: string]: ClusterData; // Chave dinâmica como "T0-Cluster_1"
}

// Interface principal para o arquivo JSON
export interface DatacenterRawData {
  EdgeClusters: EdgeClusterItem[];
}

// --- Estrutura de Dados Processada ---

export interface AggregatedStats {
  total: number;
  used: number;
  free: number;
  utilization: number; // Percentual de utilização (0-100)
}

export interface PublicIpDetail extends PublicAddress {
  clusterName: string; // Adicionamos a qual cluster pertence
}

export interface ProcessedDatacenter {
  name: string; // Nome do Datacenter (ex: "TECE1")
  aggregatedStats: AggregatedStats;
  publicIPs: PublicIpDetail[];
  rawData: DatacenterRawData; // Opcional: manter dados brutos se necessário
}