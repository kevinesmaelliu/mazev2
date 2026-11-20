"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/lime/ui/button"
import { Separator } from "@/components/lime/ui/separator"
import {
  ProductStage,
  type LandingChapter,
} from "@/components/landing/product-stage"

const CHAPTERS: Array<{
  id: LandingChapter
  heading: string
  body: string
}> = [
  {
    id: "create",
    heading: "Create the test today",
    body: "Upload a screen, write tasks, and publish. Luma does not wait on a participant budget to let you build.",
  },
  {
    id: "trade",
    heading: "Trade tests for reviews",
    body: "Complete two peer tests to earn two credits. Spend them to unlock reviews on yours.",
  },
  {
    id: "results",
    heading: "Turn answers into changes",
    body: "See where people clicked, what they said, and what to fix next in the design.",
  },
]

export function LandingPage() {
  const [chapter, setChapter] = useState<LandingChapter>("create")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const nodes = CHAPTERS.map((item) =>
      document.getElementById(item.id)
    ).filter((node): node is HTMLElement => Boolean(node))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const next = visible?.target.id as LandingChapter | undefined
        if (next) setChapter(next)
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: [0.2, 0.5, 0.8] }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header
        className={`sticky top-0 z-10 flex h-14 items-center gap-2 bg-page px-4 sm:px-6 ${
          scrolled ? "border-b border-line" : ""
        }`}
      >
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-fg"
        >
          Luma
        </Link>
        <div className="ms-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Log in
          </Button>
          <Button
            variant="solid"
            size="sm"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Start your first test
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-16 px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl leading-tight font-semibold tracking-tight sm:text-2xl">
              UX research for design students
            </h1>
            <p className="max-w-prose text-base text-fg-2">
              Create tests now. Take two peer tests, spend the credits, and get
              your study reviewed. Complete 2 tests. Get 1 review.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Start your first test
            </Button>
            <Button variant="link" render={<a href="#trade" />} nativeButton={false}>
              See how credits work
            </Button>
          </div>
          <ProductStage chapter="create" />
        </section>

        <section className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
          <div className="flex flex-col gap-8">
            {CHAPTERS.map((item) => (
              <section
                key={item.id}
                id={item.id}
                className="flex min-h-[50svh] flex-col justify-center gap-3 scroll-mt-20"
              >
                <h2 className="text-lg font-semibold text-fg">{item.heading}</h2>
                <p className="max-w-prose text-base text-fg-2">{item.body}</p>
              </section>
            ))}
          </div>
          <div className="sticky top-20 hidden lg:block">
            <ProductStage chapter={chapter} />
          </div>
        </section>

        <Separator />

        <section className="flex flex-col items-start gap-4">
          <h2 className="text-lg font-semibold text-fg">
            Ready when your class project is
          </h2>
          <p className="max-w-prose text-base text-fg-2">
            Build the study today. Earn reviews by helping classmates with
            theirs.
          </p>
          <Button
            variant="solid"
            size="lg"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Start your first test
          </Button>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center gap-3 px-4 py-6 sm:px-6">
          <p className="text-sm font-semibold text-fg">Luma</p>
          <p className="text-sm text-fg-2">
            Peer UX research for design students
          </p>
          <Link
            href="/login"
            className="ms-auto text-sm font-medium text-fg underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </footer>
    </div>
  )
}
