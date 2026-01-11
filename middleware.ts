import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // If accessing from defense.rivercrestlaw.com subdomain
  if (hostname.includes("defense.rivercrestlaw.com")) {
    // Rewrite root and non-defense paths to /defense paths
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/defense", request.url));
    }

    // Rewrite other top-level paths to their /defense equivalents
    // e.g., /traffic-tickets -> /defense/traffic-tickets
    if (
      !pathname.startsWith("/defense") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/images") &&
      !pathname.includes(".")
    ) {
      return NextResponse.rewrite(
        new URL(`/defense${pathname}`, request.url)
      );
    }

    // If already at /defense/*, strip the /defense prefix for cleaner URLs
    // Redirect /defense to / and /defense/foo to /foo
    if (pathname.startsWith("/defense")) {
      const newPath = pathname.replace(/^\/defense/, "") || "/";
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
