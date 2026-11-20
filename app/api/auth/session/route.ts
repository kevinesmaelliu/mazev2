import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decodeSession, sessionCookieName } from "@/lib/auth/session"
import { getRequestPreviewMode } from "@/lib/preview-mode.server"

export async function GET() {
  const previewMode = await getRequestPreviewMode()
  const jar = await cookies()
  const user = decodeSession(jar.get(sessionCookieName(previewMode))?.value)
  return NextResponse.json({
    previewMode,
    user,
    canSwitchPreview: process.env.NODE_ENV !== "production",
  })
}
