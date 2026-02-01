"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { AnnotationOverlay } from "@/components/canvas/annotation-overlay"
import type { Annotation } from "@/app/page"
import type { HighlightColor } from "@/components/canvas/annotation-toolbar"

interface WebsiteViewerProps {
  url?: string
  isAnnotating: boolean
  annotations: Annotation[]
  selectedAnnotationId: string | null
  annotationColor: HighlightColor
  onAnnotationAdd: (annotation: Annotation) => void
  onAnnotationSelect: (id: string | null) => void
  onScroll?: (scrollLeft: number, scrollTop: number) => void
  onLoad?: () => void
}

const colorToRgb: Record<HighlightColor, string> = {
  red: "239 68 68",      // #ef4444
  yellow: "250 204 21",  // #facc15
  blue: "59 130 246",    // #3b82f6
  green: "34 197 94",    // #22c55e
}

export function WebsiteViewer({
  url,
  isAnnotating,
  annotations,
  selectedAnnotationId,
  annotationColor,
  onAnnotationAdd,
  onAnnotationSelect,
  onScroll,
  onLoad,
}: WebsiteViewerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [scrollOffset, setScrollOffset] = useState({ left: 0, top: 0 })

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget
      const newOffset = {
        left: container.scrollLeft,
        top: container.scrollTop,
      }
      setScrollOffset(newOffset)
      onScroll?.(newOffset.left, newOffset.top)
    },
    [onScroll]
  )

  const glowColor = useMemo(() => colorToRgb[annotationColor], [annotationColor])

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      style={{
        "--glow-color": glowColor,
      } as React.CSSProperties & { "--glow-color": string }}
      className={`relative flex-1 overflow-auto bg-background transition-all duration-300 ease-in-out rounded-md ${
        isAnnotating
          ? "scale-[0.98] annotate-mode-active"
          : ""
      }`}
    >
      {/* Iframe for website preview */}
      {url && (
        <iframe
          ref={iframeRef}
          src={url}
          title="Website Preview"
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          onLoad={onLoad}
        />
      )}

      {/* Annotation overlay - always visible, positioned absolutely over content */}
      <AnnotationOverlay
        annotations={annotations}
        selectedAnnotationId={selectedAnnotationId}
        currentColor={annotationColor}
        scrollLeft={scrollOffset.left}
        scrollTop={scrollOffset.top}
        onAnnotationAdd={onAnnotationAdd}
        onAnnotationSelect={onAnnotationSelect}
        isInteractive={isAnnotating}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  )
}
