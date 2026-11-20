import { NextResponse, type NextRequest } from "next/server"
import { decodeSession, sessionCookieName } from "@/lib/auth/session"
import type { PreviewMode } from "@/lib/preview-env"

const PROTECTED = ["/create", "/tests", "/preview", "/onboarding"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const needsAuth = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  if (!needsAuth) return NextResponse.next()

  const previewMode: PreviewMode =
    process.env.NEXT_PUBLIC_PREVIEW_MODE?.trim().toLowerCase() === "staging"
      ? "staging"
      : "dev"

  const session = decodeSession(
    request.cookies.get(sessionCookieName(previewMode))?.value
  )
  if (session) return NextResponse.next()

  // Dev preview: bounce to login, which offers one-click simulated entry.
  // Staging preview: same gate, but login requires credentials.
  const login = new URL("/login", request.url)
  login.searchParams.set("next", pathname)
  login.searchParams.set("preview", previewMode)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ["/create/:path*", "/tests/:path*", "/preview/:path*", "/onboarding/:path*"],
}
