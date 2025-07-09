import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { verifyToken } from "./lib/auth";
import { getCurrentContractorData } from "./app/lib/services/contractorService";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

async function fetchUser(token: string) {
  // Use your own API endpoint to get the user info
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
    console.log("[middleware] User fetched:", user);
  }

  console.log("[middleware] Pathname:", pathname);
  console.log(
    "[middleware] accessToken:",
    token ? token.substring(0, 10) + "..." : "none"
  );

  const payload = token ? await verifyToken(token) : null;
  console.log("[middleware] Token payload:", payload);

  if (
    !payload &&
    (pathname.includes("/contractor") ||
      pathname.includes("/consumer") ||
      pathname.includes("/admin"))
  ) {
    console.log("[middleware] No payload, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname.includes("/contractor") && !pathname.includes("/admin")) {
    if (!payload || payload.role !== "contractor") {
      console.log(
        "[middleware] Not contractor, redirecting to /consumer/dashboard"
      );
      return NextResponse.redirect(new URL("/consumer/dashboard", request.url));
    }
    // Check if contractor is approved or not
    const res = await getCurrentContractorData(token || "");
    console.log(
      "[middleware] Contractor approval status:",
      res.contractor.approvalStatus
    );
    if (res.contractor.approvalStatus !== "approved") {
      console.log(
        "[middleware] Contractor not approved, redirecting to /contractor/waiting-for-approval"
      );
      return NextResponse.redirect(
        new URL("/contractor/waiting-for-approval", request.url)
      );
    }
  }

  if (pathname.includes("/admin")) {
    if (!user || user.role !== "admin") {
      console.log("[middleware] Not admin, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Apply the next-intl middleware
  console.log("[middleware] Passing through to intlMiddleware");
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
