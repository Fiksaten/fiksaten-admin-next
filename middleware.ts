import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentUser } from "./app/lib/services/userService";
import { verifyToken } from "./lib/auth";
import { isAdminRole } from "./lib/permissions";

async function fetchUser(token: string) {
  try {
    const res = await getCurrentUser(token);
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
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
