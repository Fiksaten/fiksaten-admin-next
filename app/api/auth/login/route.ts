import { NextRequest, NextResponse } from "next/server";
import { login } from "@/app/lib/openapi-client";

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const { data, error } = await login({
    baseUrl: `${baseUrl}`,
    body: { email, password },
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const res = NextResponse.json({
    username: data.username,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  res.cookies.set({
    name: "accessToken",
    value: data.accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.cookies.set({
    name: "refreshToken",
    value: data.refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.cookies.set({
    name: "username",
    value: data.username,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res;
}
