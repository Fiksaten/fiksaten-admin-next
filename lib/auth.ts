import { decodeJwt, jwtVerify, JWTPayload } from 'jose';

export interface TokenPayload extends JWTPayload {
  role?: string;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return decodeJwt(token) as TokenPayload;
    const enc = new TextEncoder();
    const { payload } = await jwtVerify(token, enc.encode(secret));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
