'use server';

import { authFetchGET } from '@/lib/server-action/authFetchGET';

export async function getAvailableYears() {
  return await authFetchGET<number[]>(`/general/years`);
}

export async function getTotalRecords() {
  return await authFetchGET<{ total: number, vehicles: number, accidents: number }>(`/general/total-records`);
}
