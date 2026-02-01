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
      {/* Content wrapper that positions annotations relative to scrollable content */}
      <div className="relative w-full min-h-full">
        {/* Iframe for website preview */}
        {url && (
          <iframe
            ref={iframeRef}
            src={url}
            title="Website Preview"
            className="w-full h-full border-none block"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            onLoad={onLoad}
          />
        )}

        {/* Annotation overlay - positioned absolutely over the content */}
        <AnnotationOverlay
          annotations={annotations}
          selectedAnnotationId={selectedAnnotationId}
          currentColor={annotationColor}
          scrollLeft={scrollOffset.left}
          scrollTop={scrollOffset.top}
          onAnnotationAdd={onAnnotationAdd}
          onAnnotationSelect={onAnnotationSelect}
          isInteractive={isAnnotating}
        />
      </div>
    </div>
  )
}
