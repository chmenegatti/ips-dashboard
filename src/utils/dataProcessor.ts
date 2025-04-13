import { Datacenter } from './dataloader'

export const processDatacenterData = (data: Datacenter): { total: number, used: number, free: number } => {
  let total = 0;
  let used = 0;
  let free = 0;

  data.EdgeClusters.forEach((cluster) => {
    for (const key in cluster) {
      const clusterData = cluster[key];
      if (clusterData?.Total && clusterData?.Used && clusterData?.Free) {
        total += clusterData.Total;
        used += clusterData.Used;
        free += clusterData.Free;
      }
    }
  });

  return {
    total: total,
    used: used,
    free: free,
  };
};