"use client"

import { useState, useRef, useCallback, useEffect } from "react"
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

  // Track iframe internal scroll position
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const updateIframeScroll = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const newOffset = {
            left: iframeDoc.documentElement.scrollLeft || iframeDoc.body.scrollLeft,
            top: iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop,
          }
          setScrollOffset(newOffset)
          onScroll?.(newOffset.left, newOffset.top)
        }
      } catch (e) {
        // Cross-origin iframe - can't access scroll position
        console.warn("Cannot access iframe scroll position (cross-origin)")
      }
    }

    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          // Listen to scroll events inside the iframe
          iframeDoc.addEventListener("scroll", updateIframeScroll)
          iframeDoc.defaultView?.addEventListener("scroll", updateIframeScroll)
          updateIframeScroll() // Initial position
        }
      } catch (e) {
        console.warn("Cannot attach scroll listener (cross-origin)")
      }
    }

    iframe.addEventListener("load", handleIframeLoad)

    return () => {
      iframe.removeEventListener("load", handleIframeLoad)
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          iframeDoc.removeEventListener("scroll", updateIframeScroll)
          iframeDoc.defaultView?.removeEventListener("scroll", updateIframeScroll)
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }, [onScroll])

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
      {/* Iframe for website preview */}
      {url && (
        <iframe
          ref={iframeRef}
          src={url}
          title="Website Preview"
          className="w-full border-none"
          style={{
            pointerEvents: isAnnotating ? "none" : "auto",
            minHeight: "100%",
            display: "block"
          }}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          onLoad={onLoad}
        />
      )}

      {/* Annotation overlay absolutely positioned over iframe - visible in both modes */}
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
  )
}
