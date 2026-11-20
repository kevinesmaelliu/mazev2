export type PreviewMode = "dev" | "staging"

export const PREVIEW_MODES: PreviewMode[] = ["dev", "staging"]

/** Cookie that lets the browser switch Dev ↔ Staging without restarting the server. */
export const PREVIEW_MODE_COOKIE = "luma_preview_mode"

export function parsePreviewMode(value: string | null | undefined): PreviewMode | null {
  const raw = value?.trim().toLowerCase()
  if (raw === "dev" || raw === "staging") return raw
  return null
}

export function resolvePreviewMode(cookieValue?: string | null): PreviewMode {
  return (
    parsePreviewMode(cookieValue) ??
    parsePreviewMode(process.env.NEXT_PUBLIC_PREVIEW_MODE) ??
    "dev"
  )
}

/** Env-only fallback. Prefer resolvePreviewMode(cookie) in request paths. */
export function getPreviewMode(): PreviewMode {
  return resolvePreviewMode(null)
}

export function isDevPreview(mode: PreviewMode = getPreviewMode()) {
  return mode === "dev"
}

export function isStagingPreview(mode: PreviewMode = getPreviewMode()) {
  return mode === "staging"
}

export function previewLabel(mode: PreviewMode = getPreviewMode()) {
  return mode === "staging" ? "Staging preview" : "Dev preview"
}

export function previewModeCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  }
}
