import { getPreviewMode, type PreviewMode } from "@/lib/preview-env"

export type SessionUser = {
  id: string
  name: string
  email: string
  school: string
  credits: number
  simulated: boolean
}

export function sessionCookieName(mode: PreviewMode = getPreviewMode()) {
  return mode === "staging" ? "luma_session_staging" : "luma_session_dev"
}

export const DEV_STUDENT: SessionUser = {
  id: "dev-student",
  name: "Dev Student",
  email: "dev@school.example",
  school: "RISD",
  credits: 2,
  simulated: true,
}

function toBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url")
  }
  const bytes = new TextEncoder().encode(value)
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "base64url").toString("utf8")
  }
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function encodeSession(user: SessionUser) {
  return toBase64Url(JSON.stringify(user))
}

export function decodeSession(value: string | undefined | null): SessionUser | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(fromBase64Url(value)) as SessionUser
    if (!parsed?.id || !parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

export function sessionCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  }
}
