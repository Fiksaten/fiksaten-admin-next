"use server";
import { cookies } from "next/headers";

export async function getaccessToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    throw new Error("No token found");
  }

  return token.value;
}
