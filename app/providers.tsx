"use client"

import Link from "next/link"
import { LinkProvider } from "@astryxdesign/core/Link"
import { Theme } from "@astryxdesign/core/theme"
import { themes, defaultThemeSlug } from "@/astryx-themes"
import { AuthProvider } from "@/lib/auth/auth-context"
import { PreviewModeBanner } from "@/components/preview-mode-banner"
import { AgentationToolbar } from "@/components/agentation-toolbar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={themes[defaultThemeSlug]} mode="light">
      <LinkProvider component={Link}>
        <AuthProvider>
          <PreviewModeBanner />
          {children}
        </AuthProvider>
      </LinkProvider>
      <AgentationToolbar />
    </Theme>
  )
}
