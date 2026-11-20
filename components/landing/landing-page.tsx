"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/lime/ui/button"
import { Separator } from "@/components/lime/ui/separator"
import { ProductWindow } from "@/components/landing/product-window"

/**
 * Plan (taste-skill software + Lime tokens)
 * kind: software · site-kind: software
 * deal: hero-centred · nav-centre · footer-dark · close-type · surface-pairs · solid · wordmark
 * palette kept on Lime tokens (amber accent), not card-pastels pink
 * visuals: product window in hero (loop), app-frame credits, results window
 * copy: tech budget ~60–80 words/screen outside UI mocks
 */
export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    const enter = window.requestAnimationFrame(() => setEntered(true))
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.cancelAnimationFrame(enter)
    }
  }, [])

  return (
    <div className="min-h-dvh bg-page text-fg">
      <header
        className={`sticky top-0 z-10 flex h-14 items-center gap-2 bg-page px-4 sm:px-6 ${
          scrolled ? "border-b border-line" : ""
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-fg"
          >
            Luma
          </Link>
          <nav className="ms-8 hidden items-center gap-5 text-sm font-medium text-fg-2 sm:flex">
            <a href="#studio" className="hover:text-fg">
              Studio
            </a>
            <a href="#credits" className="hover:text-fg">
              Credits
            </a>
            <a href="#findings" className="hover:text-fg">
              Findings
            </a>
          </nav>
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
        </div>
      </header>

      <main>
        {/* Hero: one screen. Short copy. Product window is the subject. */}
        <section
          data-enter={entered ? "in" : "out"}
          className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 pt-8 pb-0 sm:px-6 sm:pt-10"
        >
          <div
            className={`mx-auto flex max-w-2xl flex-col items-center gap-4 text-center transition-[opacity,transform] duration-(--dur-slow) ease-out ${
              entered
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
          >
            <h1 className="text-xl leading-tight font-semibold tracking-tight sm:text-3xl">
              UX research for design students
            </h1>
            <p className="max-w-xl text-base text-fg-2">
              Build a test, take two peer studies, spend the credits for one
              review round.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                Start your first test
              </Button>
              <Button
                variant="link"
                render={<a href="#credits" />}
                nativeButton={false}
              >
                See the credit loop
              </Button>
            </div>
          </div>

          <div
            className={`mt-8 min-h-0 flex-1 transition-[opacity,transform] duration-(--dur-slow) ease-out ${
              entered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="relative max-h-dvh overflow-hidden">
              <ProductWindow
                loop
                label="Luma studio building a checkout first-click test"
              />
            </div>
          </div>
        </section>

        {/* Studio / app-frame */}
        <section
          id="studio"
          className="scroll-mt-14 border-t border-line bg-surface"
        >
          <div className="mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col justify-center gap-8 px-4 py-14 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
              <h2 className="text-lg font-semibold text-fg lg:col-span-5">
                Studio for a live test
              </h2>
              <p className="text-base text-fg-2 lg:col-span-6 lg:col-start-7">
                Upload a screen, drop tasks, publish. Reviews wait until credits
                are spent.
              </p>
            </div>
            <ProductWindow
              scene="build"
              label="Luma studio with tasks beside the annotated checkout screen"
            />
          </div>
        </section>

        {/* Credits */}
        <section id="credits" className="scroll-mt-14 bg-page">
          <div className="mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col justify-center gap-8 px-4 py-14 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
              <h2 className="text-lg font-semibold text-fg lg:col-span-5">
                Credits from peer tests
              </h2>
              <p className="text-base text-fg-2 lg:col-span-6 lg:col-start-7">
                Finish two classmate studies. Spend those credits to open reviews
                on yours.
              </p>
            </div>
            <ProductWindow
              scene="trade"
              label="Peer test queue with credit unlocks for classmates"
            />
          </div>
        </section>

        {/* Findings */}
        <section
          id="findings"
          className="scroll-mt-14 border-t border-line bg-surface"
        >
          <div className="mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col justify-center gap-8 px-4 py-14 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
              <h2 className="text-lg font-semibold text-fg lg:col-span-5">
                Findings on the screen
              </h2>
              <p className="text-base text-fg-2 lg:col-span-6 lg:col-start-7">
                Clicks and answers land on the same artboard so the next Figma
                change is obvious.
              </p>
            </div>
            <ProductWindow
              scene="results"
              label="Click map and findings list for a checkout study"
            />
          </div>
        </section>

        <Separator />

        <section className="bg-page">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
              Ready for the studio critique
            </h2>
            <p className="max-w-prose text-base text-fg-2">
              Ship the study this week. Earn the review by helping a classmate
              with theirs.
            </p>
            <Button
              variant="solid"
              size="lg"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Start your first test
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-ink text-fg-inverse">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-3 px-4 py-8 sm:px-6">
          <p className="text-sm font-semibold">Luma</p>
          <p className="text-sm text-fg-inverse opacity-70">
            Peer UX research for design students
          </p>
          <Link
            href="/login"
            className="ms-auto text-sm font-medium underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </footer>
    </div>
  )
}
