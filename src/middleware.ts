import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { userId, sessionClaims } = await auth()

  // Handle unauthorized access
  if (!userId) {
    return redirectToSignIn(req)
  }

  // Check for admin routes
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isApiAdminRoute = req.nextUrl.pathname.startsWith("/api/admin")

  if (isAdminRoute || isApiAdminRoute) {
    const role = sessionClaims?.role as string

    // Only allow admin and staff_admin roles
    if (!["admin", "staff_admin"].includes(role)) {
      return redirectToHome(req)
    }

    // For certain operations, restrict to admin only
    if (req.method === "DELETE" && role !== "admin") {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      })
    }
  }

  // Handle CORS for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", "*")

    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        headers: response.headers,
      })
    }

    return response
  }

  return NextResponse.next()
}

function redirectToSignIn(req: NextRequest) {
  const signInUrl = new URL("/sign-in", req.url)
  signInUrl.searchParams.set("redirect_url", req.url)
  return NextResponse.redirect(signInUrl)
}

function redirectToHome(req: NextRequest) {
  const homeUrl = new URL("/", req.url)
  return NextResponse.redirect(homeUrl)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/((?!webhook).*)"],
}
