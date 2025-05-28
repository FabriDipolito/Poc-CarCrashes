'use server';

import { cookies } from 'next/headers';
import { API_URL } from '../constants/api';

export async function requestLoginCode(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    return res.ok;
  } catch (err) {
    console.error('❌ Error requesting login code:', err);
    return false;
  }
}

export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();

    if (data?.accessToken) {
      const cookieStore = cookies();
      (await cookieStore).set('accessToken', data.accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 10,
      });
    }

    if (data?.refreshToken) {
      const cookieStore = cookies();
      (await cookieStore).set('refreshToken', data.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 18,
      });
    }

    return true;
  } catch (err) {
    console.error('❌ Error verifying login code:', err);
    return false;
  }
}
