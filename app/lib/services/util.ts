import Cookies from 'js-cookie';

export function resolveToken(accessToken?: string): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    return Cookies.get('accessToken') || null;
  }
  return null;
}
