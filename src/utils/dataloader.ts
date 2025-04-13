interface EdgeCluster {
  [key: string]: {
    Free: number;
    Total: number;
    Used: number;
    VirtualFirewall: string;
    public_T0Cluster?: {
      Public_Address: {
        Id: string;
        Address: string;
        Prefix: string;
        Total: number;
        Used: number;
        Free: number;
      }[];
    };
  };
}

export interface Datacenter {
  EdgeClusters: EdgeCluster[];
}

const jsonFiles = import.meta.glob('../data/*.json', {
  eager: true,
});

export const loadDatacenters = (): { [key: string]: Datacenter } => {
  const data: { [key: string]: Datacenter } = {};
  for (const path in jsonFiles) {
    const fileName = path.split('/').pop()?.split('.')[0] || 'Unknown';
    data[fileName] = (jsonFiles[path] as { default: Datacenter }).default;
  }
  return data;
};