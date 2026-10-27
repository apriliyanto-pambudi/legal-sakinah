import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Guard optimistik untuk /admin/**.
 *
 * Hanya memeriksa keberadaan cookie session — cukup untuk mencegah render
 * halaman admin bagi pengunjung anonim tanpa membebani database.
 * Verifikasi role & status aktif dilakukan oleh requireAdmin() di server.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = Boolean(getSessionCookie(request));

  // Sudah login tapi membuka halaman login → arahkan ke dashboard
  if (pathname === "/admin/login") {
    if (hasSession && !searchParams.has("error")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
