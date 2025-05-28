'use server';

import { PieChartDataItem, TreeMapData, Vehicle } from '@/interfaces/vehicles';
import { authFetchGET } from '@/lib/server-action/authFetchGET';

export async function getVehiclesPieChart(startYear: number, endYear: number, filterType: string) {
  return await authFetchGET<PieChartDataItem[]>(
    `/vehicles/piechart?startYear=${startYear}&endYear=${endYear}&filterType=${filterType}`
  );
}

export async function getTreeMapData(makeId: number, filterType: string) {
  return await authFetchGET<TreeMapData>(
    `/vehicles/treemap?makeId=${makeId}&filterType=${filterType}`
  );
}

export async function getVehicleMakes() {
  return await authFetchGET<{ id: number; name: string }[]>(`/vehicles/makes`);
}

export async function getVehicleModels(makeId: number) {
  return await authFetchGET<{ id: number; name: string }[]>(`/vehicles/models?makeId=${makeId}`);
}

export async function getVehiclesPaginated(params: string) {
  return await authFetchGET<{ array: Vehicle[]; totalPaginations: number }>(
    `/vehicles/paginated?${params}`
  );
}
