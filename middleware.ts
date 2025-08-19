import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";
import { isAdminRole } from "./lib/permissions";

async function fetchUser(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;
  let user = null;

  if (token) {
    user = await fetchUser(token);
  }

  const payload = token ? await verifyToken(token) : null;

  if (
    !payload &&
    (pathname.includes("/admin"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  

  if (pathname.includes("/admin")) {
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
