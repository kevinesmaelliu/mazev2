"use client"

import { useEffect, useState } from "react"
import {
  Badge,
  Bar,
  Button,
  Collapse,
  Phone,
  Roll,
  Stage,
  Text,
  Window,
  type Act,
} from "@/components/stageshow/kit"
import "@/components/stageshow/luma-look.css"
import "./hero-flow.css"

/**
 * Luma hero stageshow: build blocks → publish → participant who passed
 * recruiting starts the test.
 *
 * Gold layout: device-pair. Cursor motion: hero-demo. Payoff on the phone.
 */

type PhoneScene = "idle" | "recruit" | "test"

type S = {
  blocks: number
  hot: number
  status: "draft" | "live"
  phone: PhoneScene
  published: boolean
}

const BLOCKS = [
  { title: "Find checkout", kind: "First click" },
  { title: "Complete purchase", kind: "Task" },
  { title: "A or B confirmation", kind: "Preference" },
] as const

const initial: S = {
  blocks: 1,
  hot: 0,
  status: "draft",
  phone: "idle",
  published: false,
}

/** Poster = payoff: published study + participant on first task. */
const POSTER: S = {
  blocks: 3,
  hot: 0,
  status: "live",
  phone: "test",
  published: true,
}

const REST = { wide: { x: 520, y: 280 }, compact: { x: 300, y: 300 } }

async function script(a: Act<S>) {
  await a.wait(700)

  // Beat 1 — add the second block
  await a.move("add")
  await a.wait(280)
  await a.click()
  await a.set({ blocks: 2, hot: 1 })
  await a.wait(650)

  // Beat 1b — add the third block
  await a.move("add")
  await a.wait(220)
  await a.click()
  await a.set({ blocks: 3, hot: 2 })
  await a.wait(700)

  // Beat 2 — publish (toolbar control stays in the crop)
  await a.move("publish")
  await a.wait(280)
  await a.click()
  await a.set({ status: "live", published: true, hot: -1 })
  await a.wait(800)

  // Beat 3 — recruiting passed, then the live test
  await a.set({ phone: "recruit" })
  await a.wait(1400)
  await a.set({ phone: "test" })
  await a.move("rest")
  await a.wait(2400)

  // Reset with a cause: snap while the phone leaves
  await a.set({ phone: "idle" })
  await a.wait(400)
  await a.snap({ ...initial })
  await a.wait(350)
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
      {(s, _rect, layout) => (
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
          <Window
            title="Luma"
            className="hf-window"
            data-cursor="pointer"
          >
            <aside className="hf-side">
              <div className="hf-side-head">
                <div>
                  <div className="hf-side-title">Blocks</div>
                  <div className="hf-side-meta">
                    <Roll>{`${s.blocks} in study`}</Roll>
                  </div>
                </div>
                <Badge tone={s.status === "live" ? "success" : "neutral"}>
                  <Roll>{s.status === "live" ? "Live" : "Draft"}</Roll>
                </Badge>
              </div>

              <div className="hf-blocks">
                {BLOCKS.map((block, i) => (
                  <Collapse key={block.title} open={s.blocks > i} reveal="clip">
                    <div
                      className="hf-block"
                      data-hot={s.hot === i || undefined}
                      data-target={i === 0 ? "block-0" : undefined}
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

              <div className="hf-side-foot">
                <Button
                  data-target="add"
                  variant="secondary"
                  size="medium"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Add block
                </Button>
              </div>
            </aside>

            <div className="hf-main">
              <div className="hf-toolbar">
                <div className="hf-study">
                  Checkout redesign <span>/ first-click</span>
                </div>
                {s.status === "live" ? (
                  <Text className="hf-status" style={{ color: "var(--ss-success-text)" }}>
                    1 participant in
                  </Text>
                ) : (
                  <Bar w={56} h={8} tone={2} style={{ marginLeft: 8 }} />
                )}
                <Button
                  data-target="publish"
                  variant="primary"
                  size="small"
                  style={{ marginLeft: "auto" }}
                >
                  {s.published ? "Published" : "Publish"}
                </Button>
              </div>
              <div className="hf-canvas" aria-hidden>
                <div className="hf-artboard">
                  <Bar w={120} h={8} tone={3} />
                  <Bar w={180} h={8} tone={2} />
                  <Bar w={90} h={28} r={6} tone={3} style={{ marginTop: 18 }} />
                  <Bar
                    w={140}
                    h={34}
                    r={8}
                    tone={4}
                    style={{ marginTop: "auto", alignSelf: "flex-end" }}
                  />
                  {s.blocks >= 1 && (
                    <span className="hf-pin" style={{ left: 48, top: 36 }}>
                      1
                    </span>
                  )}
                  {s.blocks >= 2 && (
                    <span className="hf-pin" style={{ right: 36, bottom: 48 }}>
                      2
                    </span>
                  )}
                  {s.blocks >= 3 && (
                    <span className="hf-pin" style={{ left: 110, top: 110 }}>
                      3
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Window>

          <Phone width={236} frame="pro" className="hf-phone" dark={false}>
            {s.phone === "idle" && (
              <div className="hf-idle" aria-hidden>
                <div className="hf-idle-mark">Luma</div>
                <Bar w={88} h={8} tone={2} style={{ marginBottom: 10 }} />
                <Bar w={140} h={8} tone={1} style={{ marginBottom: 18 }} />
                <div className="hf-idle-card">
                  <Bar w={72} h={6} tone={2} />
                  <Bar w={110} h={6} tone={1} style={{ marginTop: 8 }} />
                </div>
              </div>
            )}

            {s.phone === "recruit" && (
              <div className="hf-recruit">
                <div className="hf-recruit-kicker">Recruiting</div>
                <div className="hf-recruit-title">You&apos;re a match</div>
                <div className="hf-recruit-body">
                  Design student · used checkout apps last month.
                </div>
                <div className="hf-recruit-checks">
                  <div className="hf-check">
                    <span className="hf-check-dot">✓</span>
                    Screener passed
                  </div>
                  <div className="hf-check">
                    <span className="hf-check-dot">✓</span>
                    Consent on file
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="medium"
                  style={{ justifyContent: "center", width: "100%" }}
                >
                  Continue
                </Button>
              </div>
            )}

            {s.phone === "test" && (
              <div className="hf-test">
                <div className="hf-test-kicker">Live test</div>
                <div className="hf-test-title">Checkout redesign</div>
                <div className="hf-test-body">
                  3 blocks · ~4 min. Finish to unlock a credit.
                </div>
                <div className="hf-test-task">
                  <div className="hf-test-task-label">Block 1 · First click</div>
                  <div className="hf-test-task-text">
                    Where would you tap to check out?
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="medium"
                  style={{ marginTop: 12, justifyContent: "center", width: "100%" }}
                >
                  Start block
                </Button>
              </div>
            )}
          </Phone>
        </>
      )}
    </Stage>
  )
}
