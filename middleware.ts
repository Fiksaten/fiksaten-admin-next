import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";
import { isAdminRole } from "./lib/permissions";
import { getCurrentContractorData } from "./app/lib/services/contractorService";
import { getCurrentUser } from "./app/lib/openapi-client";

const intlMiddleware = createMiddleware(routing);

async function fetchUser(token: string) {
  const res = await getCurrentUser({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.error) {
    throw new Error(res.error.message);
  }
  return res.data;
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
    (pathname.includes("/contractor") ||
      pathname.includes("/consumer") ||
      pathname.includes("/admin"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.includes("/contractor") && !pathname.includes("/admin")) {
    if (!payload || payload.role !== "contractor") {
      // redirect non contractor
      return NextResponse.redirect(new URL("/consumer/dashboard", request.url));
    }
    // Check if contractor is approved or not
    const res = await getCurrentContractorData(token || "");
    if (res.contractor.approvalStatus !== "approved") {
      return NextResponse.redirect(
        new URL("/contractor/waiting-for-approval", request.url)
      );
    }
  }

  if (pathname.includes("/admin")) {
    if (!user || !isAdminRole(user.role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
