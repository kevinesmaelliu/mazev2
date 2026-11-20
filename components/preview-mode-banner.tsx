"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Segmented, SegmentedItem } from "@/components/lime/ui/segmented"
import type { PreviewMode } from "@/lib/preview-env"

const PROTECTED = ["/create", "/tests", "/preview", "/onboarding"]

export function PreviewModeBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const { previewMode, user, canSwitchPreview, setPreviewMode } = useAuth()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isDev = previewMode === "dev"

  async function onModeChange(next: string) {
    const mode = next as PreviewMode
    if (mode === previewMode || pending) return
    setError(null)
    setPending(true)
    try {
      const nextUser = await setPreviewMode(mode)
      router.refresh()

      const onProtected = PROTECTED.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      )
      if (!nextUser && onProtected) {
        router.push(
          `/login?next=${encodeURIComponent(pathname)}&preview=${mode}`
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not switch mode.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div
      className={`border-b px-4 py-2 text-sm ${
        isDev
          ? "border-accent-line bg-accent-wash text-fg"
          : "border-line bg-surface text-fg"
      }`}
      role="status"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-3 gap-y-2">
        {canSwitchPreview ? (
          <Segmented
            size="sm"
            value={previewMode}
            onValueChange={(value) => void onModeChange(value)}
            aria-label="Preview mode"
          >
            <SegmentedItem value="dev" disabled={pending}>
              Dev
            </SegmentedItem>
            <SegmentedItem value="staging" disabled={pending}>
              Staging
            </SegmentedItem>
          </Segmented>
        ) : (
          <span className="font-semibold">
            {isDev ? "Dev preview" : "Staging preview"}
          </span>
        )}

        <span className="text-fg-2">
          {isDev
            ? "Simulated login · no real credentials"
            : "Credentials required · closer to shared staging"}
        </span>

        {error ? <span className="text-danger-text">{error}</span> : null}

        {user ? (
          <span className="ms-auto text-fg-2">
            Signed in as {user.name}
            {user.simulated ? " (simulated)" : ""}
          </span>
        ) : (
          <span className="ms-auto text-fg-2">Signed out</span>
        )}
      </div>
    </div>
  )
}
