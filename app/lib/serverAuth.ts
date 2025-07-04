import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export function getAccessTokenFromRequest(req?: NextRequest): string | null {
  const cookieStore = req ? req.cookies : cookies();
  const token = cookieStore.get('accessToken')?.value;
  return token ?? null;
}

export function getServerAccessToken(): string | null {
  return getAccessTokenFromRequest();
}
