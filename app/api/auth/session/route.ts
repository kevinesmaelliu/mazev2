import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decodeSession, sessionCookieName } from "@/lib/auth/session"
import { getPreviewMode } from "@/lib/preview-env"

export async function GET() {
  const jar = await cookies()
  const previewMode = getPreviewMode()
  const user = decodeSession(jar.get(sessionCookieName(previewMode))?.value)
  return NextResponse.json({
    previewMode,
    user,
  })
}
