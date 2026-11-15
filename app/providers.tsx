"use client"

import Link from "next/link"
import { LinkProvider } from "@astryxdesign/core/Link"
import { Theme } from "@astryxdesign/core/theme"
import { themes, defaultThemeSlug } from "@/astryx-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={themes[defaultThemeSlug]} mode="light">
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  )
}
