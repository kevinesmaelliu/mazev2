"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/lime/ui/badge"
import { Button } from "@/components/lime/ui/button"

type Scene = "build" | "trade" | "results"

const SCENES: Scene[] = ["build", "trade", "results"]

/** Live-looking Luma product chrome. Shows the product, not marketing copy. */
export function ProductWindow({
  scene = "build",
  loop = false,
  label,
}: {
  scene?: Scene
  loop?: boolean
  label: string
}) {
  const [active, setActive] = useState<Scene>(scene)

  useEffect(() => {
    setActive(scene)
  }, [scene])

  useEffect(() => {
    if (!loop) return
    const id = window.setInterval(() => {
      setActive((current) => {
        const index = SCENES.indexOf(current)
        return SCENES[(index + 1) % SCENES.length]
      })
    }, 3200)
    return () => window.clearInterval(id)
  }, [loop])

  return (
    <div
      role="img"
      aria-label={label}
      className="overflow-hidden rounded-panel border border-line bg-raised shadow-card"
    >
      <div className="flex h-10 items-center gap-2 border-b border-line bg-surface px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-2.5 rounded-full bg-surface-3" />
          <i className="size-2.5 rounded-full bg-surface-3" />
          <i className="size-2.5 rounded-full bg-surface-3" />
        </span>
        <p className="truncate text-sm font-medium text-fg">
          Luma <span className="text-fg-3">/</span> Checkout redesign
        </p>
        <Badge variant="neutral" className="ms-auto">
          {active === "results" ? "2 credits spent" : "Draft"}
        </Badge>
      </div>

      <div className="grid min-h-96 lg:min-h-112 lg:grid-cols-2">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          {active === "build" && <BuildPane />}
          {active === "trade" && <TradePane />}
          {active === "results" && <ResultsListPane />}
        </div>
        <div className="relative min-h-64 bg-surface">
          {active === "build" && <BuildCanvas />}
          {active === "trade" && <TradeCanvas />}
          {active === "results" && <ResultsCanvas />}
        </div>
      </div>
    </div>
  )
}

function BuildPane() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-medium text-fg">Tasks</p>
        <p className="text-sm text-fg-2">3 blocks · ready to publish</p>
      </div>
      <ul className="flex flex-col" role="list">
        {[
          ["First click", "Find checkout"],
          ["Task", "Complete purchase"],
          ["Preference", "A or B confirmation"],
        ].map(([kind, title], index) => (
          <li
            key={title}
            className={`flex items-start gap-3 border-b border-line px-4 py-3 ${
              index === 0 ? "bg-accent-wash" : ""
            }`}
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-medium text-fg">
              {index + 1}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-fg">
                {title}
              </span>
              <span className="block truncate text-sm text-fg-3">{kind}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center gap-2 border-t border-line px-4 py-3">
        <Button variant="solid" size="sm">
          Publish test
        </Button>
        <p className="text-sm text-fg-2">Live after publish</p>
      </div>
    </div>
  )
}

function TradePane() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-medium text-fg">Peer tests</p>
        <p className="text-sm text-fg-2">Finish 2 · unlock 1 review</p>
      </div>
      <ul className="flex flex-col" role="list">
        {[
          ["Nav study", "Maya · RISD", "+1 credit"],
          ["Onboarding flow", "Jordan · SCAD", "+1 credit"],
          ["Pricing page", "Sam · Parsons", "Queued"],
        ].map(([title, who, credit], index) => (
          <li
            key={title}
            className={`flex items-center gap-3 border-b border-line px-4 py-3 ${
              index === 0 ? "bg-accent-wash" : ""
            }`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-fg">
              {who.slice(0, 1)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-fg">
                {title}
              </span>
              <span className="block truncate text-sm text-fg-3">{who}</span>
            </span>
            <Badge variant={credit.startsWith("+") ? "accent" : "neutral"}>
              {credit}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ResultsListPane() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-3">
        <p className="text-sm font-medium text-fg">Findings</p>
        <p className="text-sm text-fg-2">14 responses · 2 credits</p>
      </div>
      <ul className="flex flex-col" role="list">
        {[
          ["Missed pay button", "11 of 14"],
          ["Task time", "2m 40s median"],
          ["Preferred B", "9 of 14"],
        ].map(([title, meta], index) => (
          <li
            key={title}
            className={`flex items-center justify-between gap-3 border-b border-line px-4 py-3 ${
              index === 0 ? "bg-accent-wash" : ""
            }`}
          >
            <span className="truncate text-sm font-medium text-fg">{title}</span>
            <span className="shrink-0 text-sm tabular-nums text-fg-2">{meta}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BuildCanvas() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-fg">Screen 1 · Checkout</p>
        <Badge variant="outline">Annotate</Badge>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-line bg-page">
        <div className="absolute inset-x-4 top-4 h-3 rounded-sm bg-surface-2" />
        <div className="absolute inset-x-4 top-10 grid grid-cols-3 gap-2">
          <div className="h-16 rounded-md bg-surface-2" />
          <div className="h-16 rounded-md bg-surface-2" />
          <div className="h-16 rounded-md bg-surface-2" />
        </div>
        <div className="absolute inset-x-4 bottom-14 h-10 rounded-md bg-surface-2" />
        <div className="absolute end-6 bottom-6 h-11 w-28 rounded-control bg-ink" />
        <span
          className="absolute end-16 bottom-10 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-accent-wash"
          aria-hidden="true"
        />
        <span
          className="absolute end-16 bottom-10 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

function TradeCanvas() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-accent-wash text-2xl font-semibold tabular-nums text-fg">
        0
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-fg">Credits locked</p>
        <p className="max-w-xs text-sm text-fg-2">
          Take Maya&apos;s nav study next. Two finishes unlock your review round.
        </p>
      </div>
      <Button variant="solid" size="sm">
        Open peer test
      </Button>
    </div>
  )
}

function ResultsCanvas() {
  return (
    <div className="flex h-full flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-fg">Click map · Pay now</p>
        <Badge variant="success">14 sessions</Badge>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-line bg-page">
        <div className="absolute inset-x-4 top-4 h-3 rounded-sm bg-surface-2" />
        <div className="absolute inset-x-4 bottom-14 h-10 rounded-md bg-surface-2" />
        <div className="absolute end-6 bottom-6 h-11 w-28 rounded-control bg-surface-3" />
        <span className="absolute end-20 bottom-16 size-16 -translate-x-1/2 rounded-full bg-accent-wash" />
        <span className="absolute end-24 bottom-20 size-10 -translate-x-1/2 rounded-full bg-accent-line" />
        <span className="absolute start-1/3 top-1/2 size-8 rounded-full bg-danger-tint" />
        <span className="absolute start-1/4 top-2/5 size-6 rounded-full bg-danger" />
      </div>
    </div>
  )
}
