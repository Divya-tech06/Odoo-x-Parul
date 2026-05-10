import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/signup", "/share"];
const authRoutes = ["/login", "/signup"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Allow API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public share routes
  if (pathname.startsWith("/share")) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (pathname.startsWith("/api/share")) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protect dashboard and all app routes
  if (!isLoggedIn && !publicRoutes.some((route) => pathname.startsWith(route))) {
    // Allow the root page
    if (pathname === "/") {
      return NextResponse.next();
    }
    // Allow API external proxies for share pages
    if (pathname.startsWith("/api/external")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
