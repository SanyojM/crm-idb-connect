// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/forget-password"];

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  console.log(currentPath);

  // 1. Handle API requests (for CORS)
  if (currentPath.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.append("Access-Control-Allow-Credentials", "true");
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:5005",
      "https://idbconnect.global",
      "https://student.idbconnect.global",
      "https://inquiry.idbconnect.global",
      "https://b2b.idbconnect.global",
    ];
    const origin = request.headers.get("origin") || "";
    if (allowedOrigins.includes(origin) || origin === "") {
      response.headers.append("Access-Control-Allow-Origin", origin || "*");
    }
    response.headers.append("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
    response.headers.append(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    return response;
  }

  // 2. Handle Page requests (JWT token-based authentication)
  const authToken = request.cookies.get("crm-auth-token") || request.cookies.get("auth-token");
  const partnerSession = request.cookies.get("crm-partner-session") || request.cookies.get("partner-session");
  let partnerUser = null;

  if (authToken && partnerSession) {
    try {
      partnerUser = JSON.parse(partnerSession.value);
    } catch (error) {
      const responseWithClearedCookie = NextResponse.next({
        request: { headers: request.headers },
      });
      responseWithClearedCookie.cookies.delete("crm-partner-session");
      responseWithClearedCookie.cookies.delete("crm-auth-token");
      responseWithClearedCookie.cookies.delete("partner-session");
      responseWithClearedCookie.cookies.delete("auth-token");
      return responseWithClearedCookie;
    }
  }

  const isAuthenticated = !!partnerUser && !!authToken;
  const isPublicPath = PUBLIC_PATHS.includes(currentPath);

  // Redirect unauthenticated users to login (except public paths and /b2b routes)
  if (!isAuthenticated && !isPublicPath && !currentPath.startsWith("/b2b")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from public auth pages
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthenticated && currentPath === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};