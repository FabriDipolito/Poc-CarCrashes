import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_URL } from './lib/constants/api';

const isAccessTokenExpired = (accessToken: string | undefined): boolean => {
  if (!accessToken) return true;

  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return true;
  }
};

const refreshAccessToken = async (request: NextRequest) => {
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) return null;

  const response = await fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

  if (!response.ok) return null;

  try {
    const data = await response.json();
    return data.accessToken;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStaticFile =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    pathname.startsWith('/api/');

  if (isStaticFile) return NextResponse.next();

  const accessToken = request.cookies.get('accessToken')?.value;
  const isPublicPath = pathname.startsWith('/auth/login');

  if (isPublicPath) return NextResponse.next();

  if (!accessToken) {
    const newAccessToken = await refreshAccessToken(request);

    if (newAccessToken) {
      const response = NextResponse.next();
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 10,
      });
      return response;
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (accessToken && isAccessTokenExpired(accessToken)) {
    const newAccessToken = await refreshAccessToken(request);

    if (newAccessToken) {
      const response = NextResponse.next();
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 10,
      });
      return response;
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}
