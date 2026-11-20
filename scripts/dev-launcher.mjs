#!/usr/bin/env node
/**
 * Local preview launcher.
 *
 * Starts one Next server. Switch Dev ↔ Staging in the top banner inside the browser.
 * Optional CLI default still seeds NEXT_PUBLIC_PREVIEW_MODE until the UI cookie overrides it.
 *
 *   npm run preview
 *   npm run preview:dev
 *   npm run preview:staging
 */
import { spawn } from "node:child_process"
import { createInterface } from "node:readline"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const PORT = 3000

const MODES = {
  dev: {
    id: "dev",
    label: "Dev",
    blurb: "Default Dev · switch to Staging in the browser banner",
  },
  staging: {
    id: "staging",
    label: "Staging",
    blurb: "Default Staging · switch to Dev in the browser banner",
  },
}

function printHelp() {
  console.log(`
Luma local preview launcher

Usage:
  npm run preview              Interactive picker for the starting mode
  npm run preview:dev          Start on Dev (switchable in UI)
  npm run preview:staging      Start on Staging (switchable in UI)

In the browser, use the Dev / Staging control in the top banner.
Both modes share http://localhost:${PORT}.
`)
}

async function askMode() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) =>
    new Promise((resolve) => rl.question(q, (answer) => resolve(answer.trim())))

  console.log("\nLuma local preview\n")
  console.log("  1) Dev      — start here (simulated login available)")
  console.log("  2) Staging  — start here (credentials required)")
  console.log("")
  console.log("You can switch either way later from the in-app banner.\n")

  const answer = await question("Start on [1/2]: ")
  rl.close()

  if (answer === "2" || /^stag/i.test(answer)) return MODES.staging
  if (answer === "1" || /^dev/i.test(answer) || answer === "") return MODES.dev
  console.error(`Unknown choice: ${answer}`)
  process.exit(1)
}

function resolveMode(argv) {
  const flag = argv.find(
    (a) => a === "dev" || a === "staging" || a.startsWith("--mode=")
  )
  if (!flag) return null
  if (flag === "dev" || flag === "--mode=dev") return MODES.dev
  if (flag === "staging" || flag === "--mode=staging") return MODES.staging
  return null
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.includes("-h") || argv.includes("--help")) {
    printHelp()
    return
  }

  const mode = resolveMode(argv) ?? (await askMode())
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next")
  if (!existsSync(nextBin)) {
    console.error("Next.js is not installed. Run npm install first.")
    process.exit(1)
  }

  console.log(`\nStarting on http://localhost:${PORT}`)
  console.log(`Initial mode: ${mode.label}`)
  console.log(mode.blurb)
  console.log("Press Ctrl+C to stop.\n")

  const child = spawn(
    process.execPath,
    [nextBin, "dev", "--hostname", "0.0.0.0", "--port", String(PORT)],
    {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_PUBLIC_PREVIEW_MODE: mode.id,
        LUMA_PREVIEW_MODE: mode.id,
      },
    }
  )

  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal)
    process.exit(code ?? 0)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
