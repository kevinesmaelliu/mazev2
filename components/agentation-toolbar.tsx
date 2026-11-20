"use client"

import { Agentation } from "agentation"

/**
 * Dev-only visual feedback toolbar for AI coding agents.
 * @see https://www.agentation.com/
 *
 * Click the bottom-right icon, annotate UI, then copy markdown or sync via MCP
 * (`endpoint` → agentation-mcp on port 4747).
 */
export function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return <Agentation endpoint="http://localhost:4747" appName="Luma" />
}
