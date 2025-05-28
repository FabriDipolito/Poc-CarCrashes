'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_URL } from '../constants/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authFetchPOST<T = any>(endpoint: string, body: any): Promise<T> {
  try {
    const cookieStore = cookies();
    const cookieHeader = (await cookieStore)
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    let res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          Cookie: cookieHeader,
        },
      });

      if (!refreshRes.ok) {
        redirect('/auth/login');
      }

      const refreshData = await refreshRes.json();
      if (!refreshData?.accessToken) {
        redirect('/auth/login');
      }

      (await cookieStore).set('accessToken', refreshData.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 10,
      });

      const newCookieHeader = (await cookieStore)
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');

      res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: newCookieHeader,
        },
        body: JSON.stringify(body),
      });
    }

    if (!res.ok) {
      throw new Error(`❌ API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (err) {
    console.error('❌ Error in authFetchPOST:', err);
    throw new Error('❌ Server unreachable or fetch failed');
  }
}
