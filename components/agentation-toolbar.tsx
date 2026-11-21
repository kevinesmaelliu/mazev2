"use client"

import { useEffect } from "react"
import { Agentation } from "agentation"

/**
 * Dev-only visual feedback toolbar for AI coding agents.
 * @see https://www.agentation.com/
 *
 * Click the bottom-right icon, annotate UI, then copy markdown or sync via MCP
 * (`endpoint` → agentation-mcp on port 4747).
 *
 * While picking: ↑ walks to the parent container, ↓ walks back to the child.
 * (Agentation has no built-in hierarchy keys; we nudge hit-testing under the cursor.)
 */
export function AgentationToolbar() {
  useAgentationSelectionDepth()

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return <Agentation endpoint="http://localhost:4747" appName="Luma" />
}

const SKIP_ATTR = "data-agentation-depth-skip"
const AGENTATION_UI =
  "agentation-toolbar, [data-feedback-toolbar], [data-annotation-popup], [data-annotation-marker], [data-agentation-portal]"

function useAgentationSelectionDepth() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    let lastX = 0
    let lastY = 0
    let hasPoint = false
    let syntheticMove = false
    const skipped: HTMLElement[] = []

    const isFeedbackActive = () => {
      const host = document.querySelector("agentation-toolbar")
      const root = host?.shadowRoot
      if (!root) return false
      return !!root.querySelector(
        '[aria-label="Exit"][aria-expanded="true"]',
      )
    }

    const isAgentationUi = (el: Element | null) => {
      if (!el || !(el instanceof Element)) return true
      if (el.tagName.toLowerCase() === "agentation-toolbar") return true
      try {
        return !!el.closest(AGENTATION_UI)
      } catch {
        return false
      }
    }

    const clearSkips = () => {
      for (const el of skipped) {
        if (!el.isConnected) continue
        const prev = el.dataset.agentationPrevPe
        if (prev === undefined || prev === "") {
          el.style.removeProperty("pointer-events")
        } else {
          el.style.pointerEvents = prev
        }
        delete el.dataset.agentationPrevPe
        el.removeAttribute(SKIP_ATTR)
      }
      skipped.length = 0
    }

    const pickUnderPoint = (x: number, y: number): HTMLElement | null => {
      for (const el of document.elementsFromPoint(x, y)) {
        if (!(el instanceof HTMLElement)) continue
        if (isAgentationUi(el)) continue
        if (el.hasAttribute(SKIP_ATTR)) continue
        if (el === document.documentElement || el === document.body) continue
        return el
      }
      return null
    }

    const refreshHover = (x: number, y: number) => {
      const target = pickUnderPoint(x, y) ?? document.body
      syntheticMove = true
      target.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          view: window,
        }),
      )
      queueMicrotask(() => {
        syntheticMove = false
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      if (syntheticMove) {
        lastX = e.clientX
        lastY = e.clientY
        hasPoint = true
        return
      }
      const moved =
        hasPoint &&
        (Math.abs(e.clientX - lastX) > 2 || Math.abs(e.clientY - lastY) > 2)
      lastX = e.clientX
      lastY = e.clientY
      hasPoint = true
      if (moved && skipped.length > 0) clearSkips()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing) return
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return
      }

      if (!isFeedbackActive() || !hasPoint) return

      if (e.key === "ArrowUp") {
        const current = pickUnderPoint(lastX, lastY)
        if (!current) return
        const parent = current.parentElement
        if (
          !parent ||
          parent === document.documentElement ||
          isAgentationUi(parent)
        ) {
          return
        }

        e.preventDefault()
        e.stopPropagation()

        current.dataset.agentationPrevPe = current.style.pointerEvents
        current.style.pointerEvents = "none"
        current.setAttribute(SKIP_ATTR, "")
        skipped.push(current)
        refreshHover(lastX, lastY)
        return
      }

      // ArrowDown — restore the last skipped child
      if (skipped.length === 0) return
      e.preventDefault()
      e.stopPropagation()
      const child = skipped.pop()
      if (child?.isConnected) {
        const prev = child.dataset.agentationPrevPe
        if (prev === undefined || prev === "") {
          child.style.removeProperty("pointer-events")
        } else {
          child.style.pointerEvents = prev
        }
        delete child.dataset.agentationPrevPe
        child.removeAttribute(SKIP_ATTR)
      }
      refreshHover(lastX, lastY)
    }

    const onBlur = () => clearSkips()

    document.addEventListener("mousemove", onMouseMove, true)
    window.addEventListener("keydown", onKeyDown, true)
    window.addEventListener("blur", onBlur)

    return () => {
      clearSkips()
      document.removeEventListener("mousemove", onMouseMove, true)
      window.removeEventListener("keydown", onKeyDown, true)
      window.removeEventListener("blur", onBlur)
    }
  }, [])
}
