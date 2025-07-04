import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";
import { getCurrentContractorData } from "./app/lib/services/contractorService";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;
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
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Apply the next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
