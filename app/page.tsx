import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Luma — UX research for design students",
  description:
    "Create UX tests now. Take two peer tests, spend the credits, and get your study reviewed.",
}

export default function HomePage() {
  return <LandingPage />
}
