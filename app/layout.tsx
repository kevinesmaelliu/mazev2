import type { Metadata } from "next"
import localFont from "next/font/local"
import { Toaster } from "sonner"
import "@fontsource/figtree/400.css"
import "@fontsource/figtree/500.css"
import "@fontsource/figtree/600.css"
import "@fontsource/figtree/700.css"
import "@fontsource/source-serif-4/400.css"
import "@fontsource/source-serif-4/600.css"
import "@fontsource/source-serif-4/700.css"
import "@/components/lime/styles.css"
import "./layers.css"
import "./globals.css"
import { Providers } from "./providers"
import { LimePortalProvider } from "@/lib/lime/portal"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Luma",
  description:
    "UX research for design students. Create tests now, trade credits for reviews.",
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "page-type": "software",
    "site-kind": "software",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-type="software" className="min-h-dvh">
      <body
        className={`lime min-h-dvh bg-page text-fg antialiased ${geistSans.variable} ${geistMono.variable}`}
      >
        <LimePortalProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </LimePortalProvider>
      </body>
    </html>
  )
}
