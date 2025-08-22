import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  if (request.nextUrl.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Lanjutkan ke halaman yang diminta kalau tidak ada redirect
  return NextResponse.next();
}

// Matcher untuk apply middleware di route tertentu
export const config = {
  matcher: ["/", "/dashboard/:path*"], // bisa tambahkan "/profile", dll
};
