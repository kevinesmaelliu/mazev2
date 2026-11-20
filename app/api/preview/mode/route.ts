import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { decodeSession, sessionCookieName } from "@/lib/auth/session"
import {
  parsePreviewMode,
  PREVIEW_MODE_COOKIE,
  previewModeCookieOptions,
  type PreviewMode,
} from "@/lib/preview-env"
import { getRequestPreviewMode } from "@/lib/preview-mode.server"

export async function GET() {
  const previewMode = await getRequestPreviewMode()
  return NextResponse.json({
    previewMode,
    canSwitch: process.env.NODE_ENV !== "production",
  })
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        error:
          "Preview mode switching is only available in local development.",
      },
      { status: 403 }
    )
  }

  const body = (await request.json().catch(() => ({}))) as { mode?: string }
  const mode = parsePreviewMode(body.mode)
  if (!mode) {
    return NextResponse.json(
      { error: "Mode must be dev or staging." },
      { status: 400 }
    )
  }

  const jar = await cookies()
  const user = decodeSession(jar.get(sessionCookieName(mode))?.value)

  const response = NextResponse.json({
    previewMode: mode as PreviewMode,
    user,
    canSwitch: true,
  })
  response.cookies.set(PREVIEW_MODE_COOKIE, mode, previewModeCookieOptions())
  return response
}
