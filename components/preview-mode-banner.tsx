"use client"

import { useAuth } from "@/lib/auth/auth-context"

export function PreviewModeBanner() {
  const { previewMode, user } = useAuth()
  const isDev = previewMode === "dev"

  return (
    <div
      className={`border-b px-4 py-2 text-sm ${
        isDev
          ? "border-accent-line bg-accent-wash text-fg"
          : "border-line bg-surface text-fg"
      }`}
      role="status"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold">
          {isDev ? "Dev preview" : "Staging preview"}
        </span>
        <span className="text-fg-2">
          {isDev
            ? "Simulated login · no real credentials"
            : "Credentials required · closer to shared staging"}
        </span>
        {user ? (
          <span className="ms-auto text-fg-2">
            Signed in as {user.name}
            {user.simulated ? " (simulated)" : ""}
          </span>
        ) : null}
      </div>
    </div>
  )
}
