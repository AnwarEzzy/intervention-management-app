import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Role-based route protection
    const role = token.role;

    // Admin routes
    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Technician routes
    if (path.startsWith("/technician") && !role.startsWith("TECHNICIAN")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // User routes
    if (path.startsWith("/user") && role !== "USER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/technician/:path*",
    "/user/:path*",
    "/interventions/:path*",
    "/settings/:path*",
  ],
};
