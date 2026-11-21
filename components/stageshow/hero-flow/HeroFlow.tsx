"use client"

import { useEffect, useState } from "react"
import {
  Avatar,
  Badge,
  Bar,
  Button,
  Card,
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
 * Luma hero: compose → peer orbit → takes drift in → agents digest →
 * reports bloom. Abstract spatial story (no Window, Phone, cursor, or
 * product panels).
 */

type Phase = "compose" | "network" | "takes" | "agents" | "reports"

type AgentStatus = "idle" | "run" | "done"

type S = {
  blocks: number
  hot: number
  shared: boolean
  phase: Phase
  orbiting: boolean
  takes: number
  agents: number
  agentStatus: [AgentStatus, AgentStatus, AgentStatus]
  reports: number
}

const BLOCKS = [
  { title: "Find checkout", kind: "First click" },
  { title: "Complete purchase", kind: "Task" },
  { title: "A or B confirmation", kind: "Preference" },
] as const

const PEOPLE = ["Jordan", "Sam", "Riley", "Casey", "Avery", "Quinn", "Morgan", "Reese"] as const

const TAKES = [
  { name: "Jordan", note: "Cart first" },
  { name: "Sam", note: "Header CTA" },
  { name: "Riley", note: "3:12 done" },
  { name: "Casey", note: "Stuck · ship" },
  { name: "Avery", note: "Chose B" },
  { name: "Quinn", note: "Chose B" },
] as const

const AGENTS = [
  { name: "Click map", run: "Clustering taps", done: "Cart · 9" },
  { name: "Task path", run: "Timing paths", done: "11 / 14" },
  { name: "Preference", run: "Tallying A/B", done: "B wins" },
] as const

const REPORTS = [
  {
    title: "First click",
    by: "Click map",
    badge: "Cart 9",
    tone: "success" as const,
    kind: "heat" as const,
  },
  {
    title: "Task",
    by: "Task path",
    badge: "11/14",
    tone: "accent" as const,
    kind: "stat" as const,
    meter: 0.79,
  },
  {
    title: "Preference",
    by: "Preference",
    badge: "B · 9",
    tone: "neutral" as const,
    kind: "pref" as const,
    a: 0.36,
    b: 0.64,
  },
] as const

const initial: S = {
  blocks: 1,
  hot: 0,
  shared: false,
  phase: "compose",
  orbiting: false,
  takes: 0,
  agents: 0,
  agentStatus: ["idle", "idle", "idle"],
  reports: 0,
}

const POSTER: S = {
  blocks: 3,
  hot: -1,
  shared: true,
  phase: "reports",
  orbiting: true,
  takes: TAKES.length,
  agents: 3,
  agentStatus: ["done", "done", "done"],
  reports: 3,
}

async function script(a: Act<S>) {
  await a.wait(700)

  a.mark("compose")
  await a.set({ blocks: 2, hot: 1 })
  await a.wait(700)
  await a.set({ blocks: 3, hot: 2 })
  await a.wait(750)

  a.mark("share")
  await a.set({ shared: true, hot: -1 })
  await a.wait(650)

  a.mark("network")
  await a.set({ phase: "network", orbiting: true })
  await a.wait(1200)

  a.mark("takes")
  await a.set({ phase: "takes" })
  for (let i = 1; i <= TAKES.length; i++) {
    await a.set({ takes: i })
    await a.wait(200)
  }
  await a.wait(520)

  a.mark("agents")
  await a.set({ phase: "agents", agents: 3 })
  for (let i = 0; i < AGENTS.length; i++) {
    const next: [AgentStatus, AgentStatus, AgentStatus] = ["idle", "idle", "idle"]
    for (let j = 0; j < i; j++) next[j] = "done"
    next[i] = "run"
    await a.set({ agentStatus: next })
    await a.wait(880)
    const done = [...next] as [AgentStatus, AgentStatus, AgentStatus]
    done[i] = "done"
    await a.set({ agentStatus: done })
    await a.wait(240)
  }
  await a.wait(360)

  a.mark("reports")
  await a.set({ phase: "reports" })
  for (let i = 1; i <= REPORTS.length; i++) {
    await a.set({ reports: i })
    await a.wait(360)
  }
  await a.wait(2400)

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

function ReportBody({
  report,
  show,
}: {
  report: (typeof REPORTS)[number]
  show: boolean
}) {
  if (report.kind === "heat") {
    return (
      <div className="hf-heat" aria-hidden>
        <span className="hf-heat-pin" style={{ left: "28%", top: "42%" }}>
          9
        </span>
        <span className="hf-heat-pin" data-soft style={{ left: "70%", top: "22%" }}>
          3
        </span>
        <span className="hf-heat-pin" data-soft style={{ left: "52%", top: "70%" }}>
          2
        </span>
        <Bar w={72} h={6} tone={2} style={{ position: "absolute", left: 12, top: 12 }} />
        <Bar w={52} h={6} tone={1} style={{ position: "absolute", left: 12, top: 24 }} />
      </div>
    )
  }
  if (report.kind === "stat") {
    return (
      <div className="hf-stat">
        <div className="hf-stat-row">
          <span className="hf-stat-num">11/14</span>
          <span className="hf-stat-unit">finished</span>
        </div>
        <Meter value={report.meter ?? 0.79} tone="accent" />
      </div>
    )
  }
  return (
    <div className="hf-pref" data-show={show || undefined}>
      <div className="hf-pref-col">
        <span>A</span>
        <Meter value={report.a ?? 0.36} tone="ink" />
        <span className="hf-pref-n">5</span>
      </div>
      <div className="hf-pref-col" data-win>
        <span>B</span>
        <Meter value={report.b ?? 0.64} tone="accent" />
        <span className="hf-pref-n">9</span>
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
      theme="light"
      palette="accent"
      fidelity="standard"
      className="look-luma hf-section"
    >
      {(s) => {
        const showCompose = s.phase === "compose"
        const showNetwork = s.phase !== "compose"
        const showReports = s.phase === "reports" && s.reports > 0
        const running = s.agentStatus.findIndex((x) => x === "run")
        const hubAgent = running >= 0 ? AGENTS[running] : null
        const allDone = s.agentStatus.every((x) => x === "done")

        return (
          <>
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
                      <span>· studio critique</span>
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
                    variant="secondary"
                    size="medium"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Add block
                  </Button>
                  <Button
                    variant="primary"
                    size="medium"
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {s.shared ? "Shared" : "Share"}
                  </Button>
                </div>
              </Card>
            </div>

            <div
              className="hf-network"
              data-on={showNetwork || undefined}
              data-orbiting={s.orbiting || undefined}
              data-phase={s.phase}
            >
              <div className="hf-hub">
                <Card lift pad="small" gap={8} className="hf-hub-card">
                  {s.phase === "agents" && hubAgent ? (
                    <>
                      <Spinner size={22} />
                      <Text className="hf-hub-label">{hubAgent.name}</Text>
                      <span className="hf-hub-sub">{hubAgent.run}</span>
                    </>
                  ) : s.phase === "agents" && allDone ? (
                    <>
                      <Check on size={22} />
                      <Text className="hf-hub-label">Ready</Text>
                      <span className="hf-hub-sub">3 reports</span>
                    </>
                  ) : s.phase === "reports" ? (
                    <>
                      <Check on size={22} />
                      <Text className="hf-hub-label">Reports</Text>
                      <span className="hf-hub-sub">
                        <Count value={s.reports} /> ready
                      </span>
                    </>
                  ) : (
                    <>
                      <Facepile names={[...PEOPLE].slice(0, 4)} size={26} />
                      <span className="hf-hub-label">
                        <Count value={Math.max(s.takes, s.orbiting ? PEOPLE.length : 0)} />{" "}
                        {s.takes > 0 ? "takes" : "peers"}
                      </span>
                    </>
                  )}
                </Card>
              </div>

              {/* Named agents as floating tokens around the hub */}
              <div
                className="hf-agents"
                data-on={
                  s.phase === "agents" || s.phase === "reports" || undefined
                }
              >
                {AGENTS.map((agent, i) => {
                  const status = s.agentStatus[i]!
                  return (
                    <div
                      key={agent.name}
                      className="hf-agent"
                      data-i={i}
                      data-status={status}
                      data-in={s.agents > i || undefined}
                    >
                      <span className="hf-agent-mark" aria-hidden>
                        {status === "run" ? (
                          <Spinner size={14} />
                        ) : status === "done" ? (
                          <Check on size={14} />
                        ) : null}
                      </span>
                      <span className="hf-agent-name">{agent.name}</span>
                      <span className="hf-agent-out">
                        {status === "done" ? agent.done : status === "run" ? "…" : ""}
                      </span>
                    </div>
                  )
                })}
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
                      active={s.takes > i || allDone}
                    />
                  ))}
                </div>
              </div>

              {/* Takes as quiet notes drifting toward the hub */}
              <div
                className="hf-takes"
                data-on={
                  s.phase === "takes" ||
                  s.phase === "agents" ||
                  s.phase === "reports" ||
                  undefined
                }
              >
                {TAKES.map((item, i) => (
                  <div
                    key={item.name}
                    className="hf-take"
                    style={{ ["--hf-i" as string]: String(i) }}
                    data-in={s.takes > i || undefined}
                  >
                    <Avatar name={item.name} size={18} tone="person" />
                    <span>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hf-reports" data-on={showReports || undefined}>
              {REPORTS.map((report, i) => (
                <Collapse key={report.title} open={s.reports > i} reveal="drop" from="below">
                  <Card lift pad="small" gap={10} className="hf-report">
                    <div className="hf-report-head">
                      <div>
                        <span className="hf-report-title">{report.title}</span>
                        <span className="hf-report-by">{report.by}</span>
                      </div>
                      <Badge tone={report.tone}>{report.badge}</Badge>
                    </div>
                    <ReportBody report={report} show={s.reports > i} />
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
