"use client"

import { useRef, useCallback, useMemo, useState, useEffect } from "react"
import { AnnotationOverlay } from "@/components/canvas/annotation-overlay"
import type { Annotation } from "@/app/page"
import type { HighlightColor } from "@/components/canvas/annotation-toolbar"
import { transformUrlForIframe, validateUrl } from "@/lib/url-transform"

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
  useProxy?: boolean
}

const MIN_HEIGHT = 300
const MAX_HEIGHT = 15000
const FALLBACK_HEIGHT = 3000
const HEIGHT_DETECTION_TIMEOUT = 5000

const HEIGHT_DETECTION_SCRIPT = `
  (function() {
    function getContentHeight() {
      const body = document.body;
      const html = document.documentElement;

      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
    }

    function sendHeight() {
      const height = getContentHeight();
      window.parent.postMessage({
        type: 'IFRAME_HEIGHT_UPDATE',
        height: height,
        url: window.location.href
      }, '*');
    }

    sendHeight();

    // Watch for DOM changes
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(function() {
        clearTimeout(window._heightUpdateTimer);
        window._heightUpdateTimer = setTimeout(sendHeight, 300);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Watch for image loads
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', sendHeight);
      }
    });

    setTimeout(sendHeight, 1000);
    setTimeout(sendHeight, 3000);
  })();
`;

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
  useProxy = false,
}: WebsiteViewerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState<number>(FALLBACK_HEIGHT)
  const [heightDetectionStatus, setHeightDetectionStatus] = useState<'pending' | 'detected' | 'fallback'>('pending')

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget
      onScroll?.(container.scrollLeft, container.scrollTop)
    },
    [onScroll]
  )

  // Listen for postMessage from iframe with height updates
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'IFRAME_HEIGHT_UPDATE' &&
        typeof event.data?.height === 'number'
      ) {
        const receivedHeight = event.data.height

        const clampedHeight = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, receivedHeight)
        )

        if (Math.abs(clampedHeight - iframeHeight) > 10) {
          setIframeHeight(clampedHeight)
          setHeightDetectionStatus('detected')
          console.log(`[Height Detection] Updated to ${clampedHeight}px`)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [iframeHeight])


  // Detect height on iframe load
  useEffect(() => {
    if (!url || !iframeRef.current) return

    setIframeHeight(FALLBACK_HEIGHT)
    setHeightDetectionStatus('pending')

    // Reset scroll position when URL changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
      scrollContainerRef.current.scrollLeft = 0
    }

    const iframe = iframeRef.current
    let timeoutId: NodeJS.Timeout

    const attemptHeightDetection = () => {
      try {
        // Try same-origin direct access
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

        if (iframeDoc) {
          const height = Math.max(
            iframeDoc.body.scrollHeight,
            iframeDoc.body.offsetHeight,
            iframeDoc.documentElement.clientHeight,
            iframeDoc.documentElement.scrollHeight,
            iframeDoc.documentElement.offsetHeight
          )

          const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height))
          setIframeHeight(clampedHeight)
          setHeightDetectionStatus('detected')
          console.log('[Height Detection] Same-origin successful:', clampedHeight)

          // Watch for resize
          const resizeObserver = new ResizeObserver(() => {
            const newHeight = Math.max(
              iframeDoc.body.scrollHeight,
              iframeDoc.documentElement.scrollHeight
            )
            const clampedNewHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight))
            if (Math.abs(clampedNewHeight - iframeHeight) > 10) {
              setIframeHeight(clampedNewHeight)
            }
          })

          resizeObserver.observe(iframeDoc.body)

          return () => resizeObserver.disconnect()
        }
      } catch {
        // Cross-origin: use postMessage
        console.log('[Height Detection] Cross-origin detected, using postMessage')

        try {
          iframe.contentWindow?.postMessage({
            type: 'INJECT_HEIGHT_DETECTOR',
            script: HEIGHT_DETECTION_SCRIPT
          }, '*')
        } catch (e) {
          console.warn('[Height Detection] Failed to inject script:', e)
        }
      }

      // Fallback timeout
      timeoutId = setTimeout(() => {
        if (heightDetectionStatus === 'pending') {
          console.warn('[Height Detection] Timeout, using fallback')
          setHeightDetectionStatus('fallback')
        }
      }, HEIGHT_DETECTION_TIMEOUT)
    }

    const handleLoad = () => {
      attemptHeightDetection()
      onLoad?.()
    }

    iframe.addEventListener('load', handleLoad)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      clearTimeout(timeoutId)
    }
  }, [url, onLoad, heightDetectionStatus, iframeHeight])

  const glowColor = useMemo(() => colorToRgb[annotationColor], [annotationColor])

  // Transform URL for iframe
  const transformedUrl = useMemo(() => {
    if (!url) return undefined

    const validation = validateUrl(url)
    if (!validation.valid) {
      console.error('[URL Validation]', validation.error)
      return undefined
    }

    // Use proxy if enabled
    return transformUrlForIframe(url, { useProxy })
  }, [url, useProxy])

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
      {/* Tall wrapper to enable scrolling - both iframe and overlay are positioned within this */}
      <div className="relative" style={{ minHeight: `${iframeHeight}px` }}>
        {/* Iframe for website preview */}
        {transformedUrl && (
          <iframe
            ref={iframeRef}
            src={transformedUrl}
            title="Website Preview"
            className="absolute inset-0 w-full border-none"
            style={{ height: `${iframeHeight}px` }}
            scrolling="no"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            onLoad={onLoad}
          />
        )}

        {/* Annotation overlay - wrapper positioned absolutely */}
        <div className="absolute inset-0 w-full" style={{ height: `${iframeHeight}px` }}>
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
