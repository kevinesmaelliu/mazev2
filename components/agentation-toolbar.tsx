"use client"

import { AgentationWithSelectionDepth } from "agentation-selection-depth"

/**
 * Dev-only visual feedback toolbar for AI coding agents.
 * @see https://agentation.com/
 * @see https://github.com/kevinesmaelliu/agentation-selection-depth
 *
 * Click the bottom-right icon, annotate UI, then copy markdown or sync via MCP
 * (`endpoint` → agentation-mcp on port 4747).
 *
 * While picking: ↑ parent container, ↓ child (via agentation-selection-depth).
 */
export function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <AgentationWithSelectionDepth
      endpoint="http://localhost:4747"
      appName="Luma"
    />
  )
}
