import { NextResponse, type NextRequest } from "next/server";

const sessionCookieName = "expedientes_session";
const protectedRoutes = ["/admin", "/dashboard", "/students", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!needsAuth) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get(sessionCookieName)?.value);
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/students/:path*", "/settings/:path*"],
};
