export type PreviewMode = "dev" | "staging"

export const PREVIEW_MODES: PreviewMode[] = ["dev", "staging"]

export function getPreviewMode(): PreviewMode {
  const raw = process.env.NEXT_PUBLIC_PREVIEW_MODE?.trim().toLowerCase()
  if (raw === "staging") return "staging"
  return "dev"
}

export function isDevPreview() {
  return getPreviewMode() === "dev"
}

export function isStagingPreview() {
  return getPreviewMode() === "staging"
}

export function previewLabel(mode: PreviewMode = getPreviewMode()) {
  return mode === "staging" ? "Staging preview" : "Dev preview"
}

export function previewPort(mode: PreviewMode) {
  return mode === "staging" ? 3001 : 3000
}
