import { NextResponse } from "next/server"
import {
  DEV_STUDENT,
  encodeSession,
  sessionCookieName,
  sessionCookieOptions,
  type SessionUser,
} from "@/lib/auth/session"
import { getPreviewMode, isDevPreview } from "@/lib/preview-env"

type LoginBody = {
  mode?: "simulate" | "credentials"
  email?: string
  password?: string
  name?: string
}

export async function POST(request: Request) {
  const previewMode = getPreviewMode()
  const body = (await request.json().catch(() => ({}))) as LoginBody

  if (body.mode === "simulate") {
    if (!isDevPreview()) {
      return NextResponse.json(
        {
          error:
            "Simulated login is only available in the local Dev preview.",
        },
        { status: 403 }
      )
    }

    return setSessionResponse(DEV_STUDENT, previewMode)
  }

  const email = body.email?.trim() ?? ""
  const password = body.password?.trim() ?? ""
  if (!email || !password) {
    return NextResponse.json(
      { error: "Add your school email and a password to continue." },
      { status: 400 }
    )
  }

  if (previewMode === "staging") {
    const expectedEmail = process.env.STAGING_LOGIN_EMAIL?.trim()
    const expectedPassword = process.env.STAGING_LOGIN_PASSWORD?.trim()
    if (expectedEmail && expectedPassword) {
      if (email !== expectedEmail || password !== expectedPassword) {
        return NextResponse.json(
          { error: "Staging credentials did not match." },
          { status: 401 }
        )
      }
    }
  }

  const user: SessionUser = {
    id: `user-${email.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)}`,
    name: body.name?.trim() || email.split("@")[0] || "Student",
    email,
    school: email.split("@")[1]?.split(".")[0]?.toUpperCase() || "School",
    credits: previewMode === "staging" ? 0 : 2,
    simulated: false,
  }

  return setSessionResponse(user, previewMode)
}

function setSessionResponse(
  user: SessionUser,
  previewMode: ReturnType<typeof getPreviewMode>
) {
  const response = NextResponse.json({ previewMode, user })
  response.cookies.set(
    sessionCookieName(previewMode),
    encodeSession(user),
    sessionCookieOptions()
  )
  return response
}
