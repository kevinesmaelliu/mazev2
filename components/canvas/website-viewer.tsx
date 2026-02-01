"use client"

import { useState, useRef, useCallback } from "react"
import { AnnotationOverlay } from "@/components/canvas/annotation-overlay"
import type { Annotation } from "@/app/page"

interface WebsiteViewerProps {
  isAnnotating: boolean
  annotations: Annotation[]
  selectedAnnotationId: string | null
  annotationColor: string
  onAnnotationAdd: (annotation: Annotation) => void
  onAnnotationSelect: (id: string | null) => void
  onScroll?: (scrollLeft: number, scrollTop: number) => void
}

export function WebsiteViewer({
  isAnnotating,
  annotations,
  selectedAnnotationId,
  annotationColor,
  onAnnotationAdd,
  onAnnotationSelect,
  onScroll,
}: WebsiteViewerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
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
      className={`relative flex-1 overflow-auto bg-[#130f0c] transition-all duration-200 ${
        isAnnotating
          ? "scale-98 border border-transparent bg-gradient-to-b from-purple-500/10 to-blue-500/10"
          : ""
      }`}
    >
      {/* Placeholder iframe for website preview */}
      <iframe
        src="https://example.com"
        title="Website Preview"
        className="w-full min-h-full border-none"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
      />

      {/* Annotation overlay absolutely positioned over iframe */}
      {isAnnotating && (
        <AnnotationOverlay
          annotations={annotations}
          selectedAnnotationId={selectedAnnotationId}
          currentColor={annotationColor}
          scrollLeft={scrollOffset.left}
          scrollTop={scrollOffset.top}
          onAnnotationAdd={onAnnotationAdd}
          onAnnotationSelect={onAnnotationSelect}
        />
      )}
    </div>
  )
}
