import { NextRequest, NextResponse } from "next/server";
import { ADMIN_AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

/**
 * Central authentication choke point.
 *
 * The Supabase service-role key bypasses Row-Level Security, so the ONLY thing
 * standing between an anonymous request and full write access to the database
 * is this check. Every mutating/admin endpoint is guarded here.
 *
 * - `/api/admin/*` and `/api/cloudinary/*`  -> always require a valid session
 *   (login/logout are explicitly exempt).
 * - `/api/trips/*` and `/api/config/*`      -> public GET/HEAD, auth for writes.
 * - protected pages (e.g. `/nuevo-viaje`)   -> redirect to /admin login.
 */

const ALWAYS_PROTECTED = ["/api/admin", "/api/cloudinary"];
const WRITE_PROTECTED = ["/api/trips", "/api/config"];
const PROTECTED_PAGES = ["/nuevo-viaje"];
const PUBLIC_API = ["/api/admin/login", "/api/admin/logout"];

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login/logout must stay reachable without an existing session.
  if (PUBLIC_API.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const isProtectedPage = PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isAlwaysProtected = ALWAYS_PROTECTED.some((p) => pathname.startsWith(p));
  const isWriteProtected =
    WRITE_PROTECTED.some((p) => pathname.startsWith(p)) &&
    !READ_METHODS.has(request.method);

  if (!isProtectedPage && !isAlwaysProtected && !isWriteProtected) {
    return NextResponse.next();
  }

  const authorized = await verifySessionToken(
    request.cookies.get(ADMIN_AUTH_COOKIE_NAME)?.value
  );

  if (!authorized) {
    // Pages get redirected to the login UI; APIs get a 401.
    if (isProtectedPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/cloudinary/:path*",
    "/api/trips/:path*",
    "/api/config/:path*",
    "/nuevo-viaje/:path*",
  ],
};
