import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export async function getAccessTokenFromRequest(
  req?: NextRequest
): Promise<string | null> {
  const cookieStore = req ? req.cookies : await cookies();
  const token = cookieStore.get("accessToken")?.value;
  return token ?? null;
}

export async function getServerAccessToken(): Promise<string | null> {
  return getAccessTokenFromRequest();
}
