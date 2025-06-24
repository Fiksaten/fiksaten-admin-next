import { cookies } from "next/headers";
import { cache } from "react";
import { type NextRequest } from "next/server";

const CACHE_TTL = 60 * 1000;

const sessionCache = new Map<
  string,
  {
    session: { userId: string } | null;
    timestamp: number;
  }
>();

export async function clearSessionCache() {
  sessionCache.clear();
}

if (typeof window === "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of sessionCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        sessionCache.delete(key);
      }
    }
  }, CACHE_TTL);
}

const tokenCache = new Map<
  string,
  {
    token: string | null;
    timestamp: number;
  }
>();

export async function getAccessTokenFromRequest(request?: NextRequest) {
  console.log("getAccessTokenFromRequest start in serverAuth");
  let accessToken: string | undefined;
  console.log("request in serverAuth", request);
  if (request) {
    accessToken = request.cookies.get("access_token")?.value;
    console.log("accessToken in serverAuth", accessToken);
  } else {
    const cookieStore = await cookies();
    accessToken = cookieStore.get("access_token")?.value;
    console.log("accessToken in serverAuth", accessToken);
  }

  if (!accessToken) return null;

  const jwtToken = accessToken.split(".").slice(0, 3).join(".");
  return jwtToken;
}

export const getServerAccessToken = cache(async () => {
  console.log("getServerAccessToken start in serverAuth");
  return getAccessTokenFromRequest();
});

export async function clearServerCache() {
  tokenCache.clear();
  console.log("cleared cache");
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of sessionCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      tokenCache.delete(key);
    }
  }
}, CACHE_TTL);
