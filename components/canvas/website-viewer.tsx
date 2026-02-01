"use client"

import { useRef, useCallback } from "react"
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

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget
      onScroll?.(container.scrollLeft, container.scrollTop)
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
      {/* Tall wrapper to enable scrolling - both iframe and overlay are positioned within this */}
      <div className="relative" style={{ minHeight: '3000px' }}>
        {/* Iframe for website preview */}
        {url && (
          <iframe
            ref={iframeRef}
            src={url}
            title="Website Preview"
            className="absolute inset-0 w-full border-none"
            style={{ height: '3000px' }}
            scrolling="no"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            onLoad={onLoad}
          />
        )}

        {/* Annotation overlay - wrapper positioned absolutely */}
        <div className="absolute inset-0 w-full" style={{ height: '3000px' }}>
          <AnnotationOverlay
            annotations={annotations}
            selectedAnnotationId={selectedAnnotationId}
            currentColor={annotationColor}
            onAnnotationAdd={onAnnotationAdd}
            onAnnotationSelect={onAnnotationSelect}
            isInteractive={isAnnotating}
            scrollContainerRef={scrollContainerRef}
          />
        </div>
      </div>
    </div>
  )
}
