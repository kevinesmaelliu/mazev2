import { NextResponse, type NextRequest } from "next/server"
import { decodeSession, sessionCookieName } from "@/lib/auth/session"
import {
  PREVIEW_MODE_COOKIE,
  resolvePreviewMode,
} from "@/lib/preview-env"

const PROTECTED = ["/create", "/tests", "/preview", "/onboarding"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const needsAuth = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  if (!needsAuth) return NextResponse.next()

  const previewMode = resolvePreviewMode(
    request.cookies.get(PREVIEW_MODE_COOKIE)?.value
  )

  const session = decodeSession(
    request.cookies.get(sessionCookieName(previewMode))?.value
  )
  if (session) return NextResponse.next()

  const login = new URL("/login", request.url)
  login.searchParams.set("next", pathname)
  login.searchParams.set("preview", previewMode)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: [
    "/create/:path*",
    "/tests/:path*",
    "/preview/:path*",
    "/onboarding/:path*",
  ],
}
