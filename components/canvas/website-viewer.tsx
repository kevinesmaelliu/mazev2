"use client"

import { useState, useRef, useCallback } from "react"
import { AnnotationOverlay } from "@/components/canvas/annotation-overlay"
import type { Annotation } from "@/app/page"

interface WebsiteViewerProps {
  url?: string
  isAnnotating: boolean
  annotations: Annotation[]
  selectedAnnotationId: string | null
  annotationColor: string
  onAnnotationAdd: (annotation: Annotation) => void
  onAnnotationSelect: (id: string | null) => void
  onScroll?: (scrollLeft: number, scrollTop: number) => void
  onLoad?: () => void
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

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={`relative flex-1 overflow-auto bg-background transition-all duration-200 ${
        isAnnotating
          ? "scale-98 border border-transparent bg-gradient-to-b from-purple-500/10 to-blue-500/10"
          : ""
      }`}
    >
      {/* Content wrapper - both iframe and overlay scroll together */}
      <div className="relative w-full" style={{ minHeight: "100%" }}>
        {/* Iframe for website preview - disabled internal scrolling */}
        {url && (
          <iframe
            ref={iframeRef}
            src={url}
            title="Website Preview"
            className="relative block w-full border-none"
            style={{
              pointerEvents: isAnnotating ? "none" : "auto",
              minHeight: "100%",
            }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            scrolling="no"
            onLoad={onLoad}
          />
        )}

        {/* Annotation overlay - positioned absolutely over iframe, scrolls with container */}
        <div
          className="absolute inset-0 w-full z-10"
          style={{
            pointerEvents: isAnnotating ? "auto" : "none",
            minHeight: "100%",
          }}
        >
          <AnnotationOverlay
            annotations={annotations}
            selectedAnnotationId={selectedAnnotationId}
            currentColor={annotationColor}
            scrollLeft={scrollOffset.left}
            scrollTop={scrollOffset.top}
            isAnnotating={isAnnotating}
            onAnnotationAdd={onAnnotationAdd}
            onAnnotationSelect={onAnnotationSelect}
          />
        </div>
      </div>
    </div>
  )
}
