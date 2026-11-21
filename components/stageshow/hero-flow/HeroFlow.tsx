"use client"

import { useEffect, useState } from "react"
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chart,
  Check,
  Collapse,
  Count,
  Facepile,
  Meter,
  Roll,
  Spinner,
  Stage,
  Text,
  type Act,
} from "@/components/stageshow/kit"
import "@/components/stageshow/luma-look.css"
import "./hero-flow.css"

/**
 * Luma hero stageshow: compose blocks → share → abstract network orbit →
 * feedback returns → digest spin → pretty report cards.
 *
 * No browser Window chrome, no Phone. Kit surfaces only.
 */

type Phase = "compose" | "network" | "feedback" | "digest" | "reports"

type S = {
  blocks: number
  hot: number
  shared: boolean
  phase: Phase
  orbiting: boolean
  feedback: number
  digesting: boolean
  digested: boolean
  reports: number
}

const BLOCKS = [
  { title: "Find checkout", kind: "First click" },
  { title: "Complete purchase", kind: "Task" },
  { title: "A or B confirmation", kind: "Preference" },
] as const

const PEOPLE = ["Jordan", "Sam", "Riley", "Casey", "Avery", "Quinn", "Morgan", "Reese"] as const

const FEEDBACK = [
  { name: "Jordan", note: "Tapped cart first" },
  { name: "Sam", note: "Missed the CTA" },
  { name: "Riley", note: "Loved step 2" },
  { name: "Casey", note: "Confused on pay" },
  { name: "Avery", note: "Fast path" },
  { name: "Quinn", note: "Preferred B" },
] as const

const REPORTS = [
  {
    title: "First click",
    badge: "Clear",
    tone: "success" as const,
    chart: [2, 4, 5, 7, 9, 11],
    meter: 0.82,
    faces: ["Jordan", "Sam", "Riley"],
  },
  {
    title: "Task success",
    badge: "Strong",
    tone: "accent" as const,
    chart: [3, 3, 5, 6, 8, 10],
    meter: 0.74,
    faces: ["Casey", "Avery", "Quinn"],
  },
  {
    title: "Preference",
    badge: "B wins",
    tone: "neutral" as const,
    chart: [1, 3, 4, 6, 7, 9],
    meter: 0.61,
    faces: ["Morgan", "Reese", "Jordan"],
  },
] as const

const initial: S = {
  blocks: 1,
  hot: 0,
  shared: false,
  phase: "compose",
  orbiting: false,
  feedback: 0,
  digesting: false,
  digested: false,
  reports: 0,
}

/** Poster = payoff: digested network → report cards. */
const POSTER: S = {
  blocks: 3,
  hot: -1,
  shared: true,
  phase: "reports",
  orbiting: true,
  feedback: FEEDBACK.length,
  digesting: false,
  digested: true,
  reports: 3,
}

const REST = { wide: { x: 450, y: 300 }, compact: { x: 180, y: 340 } }

async function script(a: Act<S>) {
  await a.wait(650)

  // Beat 1 — compose: add blocks
  a.mark("compose")
  await a.move("add")
  await a.wait(240)
  await a.click()
  await a.set({ blocks: 2, hot: 1 })
  await a.wait(550)

  await a.move("add")
  await a.wait(200)
  await a.click()
  await a.set({ blocks: 3, hot: 2 })
  await a.wait(600)

  // Beat 2 — share
  a.mark("share")
  await a.move("share")
  await a.wait(260)
  await a.click()
  await a.set({ shared: true, hot: -1 })
  await a.wait(500)

  // Beat 3 — send into a network; orbit clockwise
  a.mark("network")
  await a.set({ phase: "network", orbiting: true })
  await a.move("rest")
  await a.wait(1400)

  // Beat 4 — feedback returns from the ring
  a.mark("feedback")
  await a.set({ phase: "feedback" })
  for (let i = 1; i <= FEEDBACK.length; i++) {
    await a.set({ feedback: i })
    await a.wait(220)
  }
  await a.wait(700)

  // Beat 5 — digest / analyze (clockwise spin)
  a.mark("digest")
  await a.set({ phase: "digest", digesting: true })
  await a.wait(1600)
  await a.set({ digesting: false, digested: true })
  await a.wait(450)

  // Beat 6 — pretty reports
  a.mark("reports")
  await a.set({ phase: "reports" })
  for (let i = 1; i <= REPORTS.length; i++) {
    await a.set({ reports: i })
    await a.wait(380)
  }
  await a.wait(2600)

  // Reset: fold reports, then snap
  await a.set({ reports: 0, orbiting: false })
  await a.wait(350)
  await a.snap({ ...initial })
  await a.wait(300)
}

function OrbitNode({
  name,
  index,
  total,
  active,
}: {
  name: string
  index: number
  total: number
  active: boolean
}) {
  const angle = (360 / total) * index - 90
  return (
    <div
      className="hf-orbit-slot"
      style={{ ["--hf-angle" as string]: `${angle}deg` }}
      data-on={active || undefined}
    >
      <div className="hf-orbit-node">
        <Avatar name={name} size={36} tone="person" ring={active ? "confirmed" : "pending"} />
      </div>
    </div>
  )
}

export function HeroFlow() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div
        className="look-luma hf-section w-full bg-[var(--ss-well,#f6f5f2)]"
        style={{ aspectRatio: "900 / 420", maxWidth: 900 }}
        aria-hidden
      />
    )
  }

  return (
    <Stage
      width={900}
      height={420}
      compact={{ below: 700, width: 358, height: 420 }}
      initial={initial}
      poster={POSTER}
      script={script}
      cursor={{ at: REST }}
      theme="light"
      palette="accent"
      fidelity="standard"
      className="look-luma hf-section"
    >
      {(s, _rect, layout) => {
        const showCompose = s.phase === "compose"
        const showNetwork = s.phase !== "compose"
        const showReports = s.phase === "reports" && s.reports > 0

        return (
          <>
            <span
              data-target="rest"
              style={{
                position: "absolute",
                left: REST[layout].x,
                top: REST[layout].y,
                width: 1,
                height: 1,
              }}
            />

            {/* Compose surface — Card, not Window */}
            <div
              className="hf-compose"
              data-phase={s.phase}
              data-shared={s.shared || undefined}
              aria-hidden={!showCompose}
            >
              <Card lift pad="medium" gap={14} className="hf-compose-card">
                <div className="hf-compose-head">
                  <div>
                    <div className="hf-compose-title">Checkout redesign</div>
                    <div className="hf-compose-meta">
                      <Roll>{`${s.blocks} blocks`}</Roll>
                      <span>· first-click study</span>
                    </div>
                  </div>
                  <Badge tone={s.shared ? "success" : "neutral"} dot>
                    <Roll>{s.shared ? "Live" : "Draft"}</Roll>
                  </Badge>
                </div>

                <div className="hf-blocks">
                  {BLOCKS.map((block, i) => (
                    <Collapse key={block.title} open={s.blocks > i} reveal="clip">
                      <div
                        className="hf-block"
                        data-hot={s.hot === i || undefined}
                      >
                        <span className="hf-block-num">{i + 1}</span>
                        <span>
                          <span className="hf-block-title">{block.title}</span>
                          <span className="hf-block-kind">{block.kind}</span>
                        </span>
                      </div>
                    </Collapse>
                  ))}
                </div>

                <div className="hf-compose-actions">
                  <Button
                    data-target="add"
                    variant="secondary"
                    size="medium"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Add block
                  </Button>
                  <Button
                    data-target="share"
                    variant="primary"
                    size="medium"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {s.shared ? "Shared" : "Share"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Abstract network: hub + clockwise orbit */}
            <div
              className="hf-network"
              data-on={showNetwork || undefined}
              data-orbiting={s.orbiting || undefined}
              data-digesting={s.digesting || undefined}
              data-digested={s.digested || undefined}
              data-phase={s.phase}
            >
              <div className="hf-hub" data-target="hub">
                <Card lift pad="small" gap={8} className="hf-hub-card">
                  {s.digesting ? (
                    <>
                      <Spinner size={22} />
                      <Text className="hf-hub-label">Analyzing</Text>
                    </>
                  ) : s.digested ? (
                    <>
                      <Check on size={22} />
                      <Text className="hf-hub-label">Digested</Text>
                    </>
                  ) : (
                    <>
                      <Facepile names={[...PEOPLE].slice(0, 4)} size={26} />
                      <span className="hf-hub-label">
                        <Count value={Math.max(s.feedback, s.orbiting ? 8 : 0)} /> in network
                      </span>
                    </>
                  )}
                </Card>
              </div>

              <div className="hf-orbit" aria-hidden>
                <div className="hf-orbit-ring" data-spin={s.orbiting || undefined} />
                <div className="hf-orbit-faces" data-spin={s.orbiting || undefined}>
                  {PEOPLE.map((name, i) => (
                    <OrbitNode
                      key={name}
                      name={name}
                      index={i}
                      total={PEOPLE.length}
                      active={s.feedback > i || s.digested}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback returning toward the hub */}
              <div
                className="hf-feedback"
                data-on={
                  s.phase === "feedback" ||
                  s.phase === "digest" ||
                  s.phase === "reports" ||
                  undefined
                }
              >
                {FEEDBACK.map((item, i) => (
                  <div
                    key={item.name}
                    className="hf-feedback-chip"
                    style={{ ["--hf-i" as string]: String(i) }}
                    data-in={s.feedback > i || undefined}
                  >
                    <Avatar name={item.name} size={20} tone="person" />
                    <span>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pretty reports */}
            <div className="hf-reports" data-on={showReports || undefined}>
              {REPORTS.map((report, i) => (
                <Collapse key={report.title} open={s.reports > i} reveal="drop" from="below">
                  <Card lift pad="small" gap={10} className="hf-report">
                    <div className="hf-report-head">
                      <span className="hf-report-title">{report.title}</span>
                      <Badge tone={report.tone}>{report.badge}</Badge>
                    </div>
                    <Chart
                      data={[...report.chart]}
                      kind="line"
                      width={168}
                      height={56}
                      show={s.reports > i}
                      area
                      dot
                    />
                    <div className="hf-report-foot">
                      <Meter value={report.meter} tone={report.tone === "neutral" ? "ink" : report.tone === "success" ? "success" : "accent"} />
                      <Facepile names={[...report.faces]} size={18} />
                    </div>
                  </Card>
                </Collapse>
              ))}
            </div>
          </>
        )
      }}
    </Stage>
  )
}
