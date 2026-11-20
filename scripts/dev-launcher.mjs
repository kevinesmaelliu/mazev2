#!/usr/bin/env node
/**
 * Local preview launcher: choose Dev (simulated login) or Staging.
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

const MODES = {
  dev: {
    id: "dev",
    label: "Dev",
    blurb: "Simulated login · no real credentials · port 3000",
    port: 3000,
  },
  staging: {
    id: "staging",
    label: "Staging",
    blurb: "Credentials required · closer to shared staging · port 3001",
    port: 3001,
  },
}

function printHelp() {
  console.log(`
Luma local preview launcher

Usage:
  npm run preview              Interactive picker
  npm run preview:dev          Dev preview (simulated login)
  npm run preview:staging      Staging preview (credentials)

Env:
  NEXT_PUBLIC_PREVIEW_MODE=dev|staging
  STAGING_LOGIN_EMAIL / STAGING_LOGIN_PASSWORD  (optional staging gate)
`)
}

async function askMode() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) =>
    new Promise((resolve) => rl.question(q, (answer) => resolve(answer.trim())))

  console.log("\nLuma local preview\n")
  console.log("  1) Dev      — simulated login, no real credentials  (port 3000)")
  console.log("  2) Staging  — credentials required                 (port 3001)")
  console.log("")

  const answer = await question("Choose preview [1/2]: ")
  rl.close()

  if (answer === "2" || /^stag/i.test(answer)) return MODES.staging
  if (answer === "1" || /^dev/i.test(answer) || answer === "") return MODES.dev
  console.error(`Unknown choice: ${answer}`)
  process.exit(1)
}

function resolveMode(argv) {
  const flag = argv.find((a) => a === "dev" || a === "staging" || a.startsWith("--mode="))
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

  console.log(`\nStarting ${mode.label} preview on http://localhost:${mode.port}`)
  console.log(mode.blurb)
  console.log("Press Ctrl+C to stop.\n")

  const child = spawn(
    process.execPath,
    [nextBin, "dev", "--hostname", "0.0.0.0", "--port", String(mode.port)],
    {
      cwd: root,
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_PUBLIC_PREVIEW_MODE: mode.id,
        // Keep Next in development; this only names our preview flavor.
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
