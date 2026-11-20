import { NextResponse } from "next/server"
import { sessionCookieName } from "@/lib/auth/session"
import { getRequestPreviewMode } from "@/lib/preview-mode.server"

export async function POST() {
  const previewMode = await getRequestPreviewMode()
  const response = NextResponse.json({
    previewMode,
    user: null,
  })
  response.cookies.set(sessionCookieName(previewMode), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}
