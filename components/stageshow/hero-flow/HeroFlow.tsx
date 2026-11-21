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
  Row,
  Spinner,
  Stage,
  Stream,
  Text,
  type Act,
} from "@/components/stageshow/kit"
import "@/components/stageshow/luma-look.css"
import "./hero-flow.css"

/**
 * Luma hero: compose → share to peers → takes come back → named agents
 * process the takes → findings board. No Window, Phone, or demo cursor.
 */

type Phase = "compose" | "takes" | "agents" | "findings"

type AgentStatus = "idle" | "run" | "done"

type S = {
  blocks: number
  hot: number
  shared: boolean
  phase: Phase
  takes: number
  agents: number
  agentStatus: [AgentStatus, AgentStatus, AgentStatus]
  findingWords: number
  findings: number
}

const BLOCKS = [
  { title: "Find checkout", kind: "First click" },
  { title: "Complete purchase", kind: "Task" },
  { title: "A or B confirmation", kind: "Preference" },
] as const

const TAKES = [
  { name: "Jordan", line: "First tap on cart", block: "1 · click" },
  { name: "Sam", line: "Looked for Pay in header", block: "1 · click" },
  { name: "Riley", line: "Finished in 3:12", block: "2 · task" },
  { name: "Casey", line: "Stuck on shipping", block: "2 · task" },
  { name: "Avery", line: "Chose B — clearer total", block: "3 · pref" },
  { name: "Quinn", line: "Chose B", block: "3 · pref" },
] as const

const AGENTS = [
  {
    name: "Click map",
    job: "Cluster first taps",
    run: "Plotting 14 taps…",
    done: "Cart 9 · header 3 · other 2",
  },
  {
    name: "Task path",
    job: "Score completion",
    run: "Timing drop-offs…",
    done: "11 of 14 finished · median 3:40",
  },
  {
    name: "Preference",
    job: "Tally A vs B",
    run: "Reading reasons…",
    done: "B 9 · A 5",
  },
] as const

const FINDING_QUOTE =
  "B made the total feel honest — Avery, year 3"

const initial: S = {
  blocks: 1,
  hot: 0,
  shared: false,
  phase: "compose",
  takes: 0,
  agents: 0,
  agentStatus: ["idle", "idle", "idle"],
  findingWords: 0,
  findings: 0,
}

const POSTER: S = {
  blocks: 3,
  hot: -1,
  shared: true,
  phase: "findings",
  takes: TAKES.length,
  agents: 3,
  agentStatus: ["done", "done", "done"],
  findingWords: FINDING_QUOTE.split(" ").length,
  findings: 3,
}

async function script(a: Act<S>) {
  await a.wait(650)

  a.mark("compose")
  await a.set({ blocks: 2, hot: 1 })
  await a.wait(680)
  await a.set({ blocks: 3, hot: 2 })
  await a.wait(720)

  a.mark("share")
  await a.set({ shared: true, hot: -1 })
  await a.wait(520)

  // Takes arrive as a quiet list — peers who ran the study
  a.mark("takes")
  await a.set({ phase: "takes" })
  for (let i = 1; i <= TAKES.length; i++) {
    await a.set({ takes: i })
    await a.wait(240)
  }
  await a.wait(480)

  // Named agents pick up the work, one after another
  a.mark("agents")
  await a.set({ phase: "agents", agents: 3 })
  for (let i = 0; i < AGENTS.length; i++) {
    const next = ["idle", "idle", "idle"] as [AgentStatus, AgentStatus, AgentStatus]
    for (let j = 0; j < i; j++) next[j] = "done"
    next[i] = "run"
    await a.set({ agentStatus: next })
    await a.wait(900)
    const done = [...next] as [AgentStatus, AgentStatus, AgentStatus]
    done[i] = "done"
    await a.set({ agentStatus: done })
    await a.wait(280)
  }
  await a.wait(360)

  // Findings board fills from what the agents produced
  a.mark("findings")
  await a.set({ phase: "findings", findings: 1 })
  await a.wait(420)
  await a.set({ findings: 2 })
  await a.wait(420)
  await a.set({ findings: 3 })
  const words = FINDING_QUOTE.split(" ").length
  for (let w = 1; w <= words; w++) {
    await a.set({ findingWords: w })
    await a.wait(55)
  }
  await a.wait(2400)

  await a.set({ findings: 0, findingWords: 0, takes: 0, agents: 0 })
  await a.wait(320)
  await a.snap({ ...initial })
  await a.wait(280)
}

function AgentRow({
  agent,
  status,
}: {
  agent: (typeof AGENTS)[number]
  status: AgentStatus
}) {
  const subtitle =
    status === "run" ? agent.run : status === "done" ? agent.done : agent.job
  return (
    <Row
      className="hf-agent-row"
      data-status={status}
      pad={10}
      selected={status === "run"}
      lead={
        status === "run" ? (
          <Spinner size={18} />
        ) : status === "done" ? (
          <Check on size={18} />
        ) : (
          <span className="hf-agent-mark" aria-hidden />
        )
      }
      title={agent.name}
      subtitle={subtitle}
      meta={
        status === "run" ? (
          <Badge tone="accent">Running</Badge>
        ) : status === "done" ? (
          <Badge tone="success">Done</Badge>
        ) : (
          <Badge tone="neutral">Queued</Badge>
        )
      }
    />
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
        const showTakes = s.phase === "takes" || s.phase === "agents"
        const showAgents = s.phase === "agents" || s.phase === "findings"
        const showFindings = s.phase === "findings" && s.findings > 0

        return (
          <>
            {/* Compose */}
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
                      <span>· studio critique study</span>
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

            {/* Takes inbox — left */}
            <div
              className="hf-takes"
              data-on={showTakes || undefined}
              data-phase={s.phase}
            >
              <Card flush lift pad="small" className="hf-takes-card">
                <div className="hf-panel-head">
                  <span className="hf-panel-title">Takes</span>
                  <span className="hf-panel-meta">
                    <Count value={s.takes} /> / {TAKES.length}
                  </span>
                </div>
                <div className="hf-takes-list">
                  {TAKES.map((take, i) => (
                    <Collapse key={take.name} open={s.takes > i} reveal="clip">
                      <Row
                        pad={10}
                        lead={<Avatar name={take.name} size={22} tone="person" />}
                        title={take.name}
                        subtitle={take.line}
                        meta={<span className="hf-take-block">{take.block}</span>}
                      />
                    </Collapse>
                  ))}
                </div>
                {s.takes > 0 && (
                  <div className="hf-takes-foot">
                    <Facepile
                      names={TAKES.slice(0, s.takes).map((t) => t.name)}
                      size={20}
                    />
                    <Text className="hf-panel-meta">peers who ran it</Text>
                  </div>
                )}
              </Card>
            </div>

            {/* Agent desk — right */}
            <div
              className="hf-agents"
              data-on={showAgents || undefined}
              data-phase={s.phase}
            >
              <Card flush lift pad="small" className="hf-agents-card">
                <div className="hf-panel-head">
                  <span className="hf-panel-title">Agents</span>
                  <span className="hf-panel-meta">
                    {s.agentStatus.filter((x) => x === "done").length} of 3
                  </span>
                </div>
                <div className="hf-agents-list">
                  {AGENTS.map((agent, i) => (
                    <Collapse key={agent.name} open={s.agents > i} reveal="clip">
                      <AgentRow agent={agent} status={s.agentStatus[i]!} />
                    </Collapse>
                  ))}
                </div>
              </Card>
            </div>

            {/* Findings — one board, three different evidence types */}
            <div className="hf-findings" data-on={showFindings || undefined}>
              <Card lift pad="medium" gap={0} className="hf-findings-card">
                <div className="hf-findings-head">
                  <div>
                    <div className="hf-findings-title">Findings</div>
                    <div className="hf-findings-sub">Checkout redesign · from 14 takes</div>
                  </div>
                  <Badge tone="success" dot>
                    Ready for critique
                  </Badge>
                </div>

                <div className="hf-findings-body">
                  <Collapse open={s.findings >= 1} reveal="clip">
                    <div className="hf-finding">
                      <div className="hf-finding-label">
                        <span>First click</span>
                        <span className="hf-finding-by">Click map</span>
                      </div>
                      <div className="hf-heat" aria-hidden>
                        <span className="hf-heat-pin" style={{ left: "22%", top: "38%" }}>
                          9
                        </span>
                        <span className="hf-heat-pin" data-soft style={{ left: "68%", top: "18%" }}>
                          3
                        </span>
                        <span className="hf-heat-pin" data-soft style={{ left: "48%", top: "72%" }}>
                          2
                        </span>
                        <Bar w={96} h={8} tone={2} style={{ position: "absolute", left: 16, top: 14 }} />
                        <Bar w={72} h={8} tone={1} style={{ position: "absolute", left: 16, top: 30 }} />
                        <Bar
                          w={88}
                          h={28}
                          r={6}
                          tone={3}
                          style={{ position: "absolute", right: 18, bottom: 16 }}
                        />
                      </div>
                      <p className="hf-finding-note">Most people hit the cart first.</p>
                    </div>
                  </Collapse>

                  <Collapse open={s.findings >= 2} reveal="clip">
                    <div className="hf-finding">
                      <div className="hf-finding-label">
                        <span>Task</span>
                        <span className="hf-finding-by">Task path</span>
                      </div>
                      <div className="hf-stat">
                        <span className="hf-stat-num">11/14</span>
                        <span className="hf-stat-unit">finished</span>
                      </div>
                      <Meter value={0.79} tone="accent" />
                      <p className="hf-finding-note">Shipping step slowed four people.</p>
                    </div>
                  </Collapse>

                  <Collapse open={s.findings >= 3} reveal="clip">
                    <div className="hf-finding">
                      <div className="hf-finding-label">
                        <span>Preference</span>
                        <span className="hf-finding-by">Preference</span>
                      </div>
                      <div className="hf-pref">
                        <div className="hf-pref-col">
                          <span className="hf-pref-letter">A</span>
                          <Meter value={0.36} tone="ink" />
                          <span className="hf-pref-n">5</span>
                        </div>
                        <div className="hf-pref-col" data-win>
                          <span className="hf-pref-letter">B</span>
                          <Meter value={0.64} tone="accent" />
                          <span className="hf-pref-n">9</span>
                        </div>
                      </div>
                      <p className="hf-finding-note">
                        <Stream text={FINDING_QUOTE} count={s.findingWords} />
                      </p>
                    </div>
                  </Collapse>
                </div>
              </Card>
            </div>
          </>
        )
      }}
    </Stage>
  )
}
