'use server';

import { AccidentData, AreaChartDataItem, PieChartDataItem } from '@/interfaces/states';
import { authFetchGET } from '@/lib/server-action/authFetchGET';

export async function getAreaChartData(stateId: number) {
  return await authFetchGET<{ array: AreaChartDataItem[] }>(
    `/accidents/areachart?stateId=${stateId}`
  );
}

export async function getStatesPieChart(startYear: number, endYear: number, filterType: string) {
  return await authFetchGET<{ total: number; array: PieChartDataItem[] }>(
    `/accidents/piechart?startYear=${startYear}&endYear=${endYear}&filterType=${filterType}`
  );
}

export async function getStatesPaginated(params: string) {
  return await authFetchGET<{ array: AccidentData[]; totalPaginations: number }>(
    `/accidents/paginated?${params}`
  );
}
