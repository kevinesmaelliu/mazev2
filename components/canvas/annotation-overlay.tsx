"use client"

import { useState, useRef, useEffect } from "react"
import type { Annotation } from "@/app/page"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AnnotationOverlayProps {
  annotations: Annotation[]
  selectedAnnotationId: string | null
  currentColor: string
  scrollLeft: number
  scrollTop: number
  onAnnotationAdd: (annotation: Annotation) => void
  onAnnotationSelect: (id: string | null) => void
  isInteractive?: boolean
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

interface DrawingState {
  isDrawing: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
}

const colorMap: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#3b82f6",
}

export function AnnotationOverlay({
  annotations,
  selectedAnnotationId,
  currentColor,
  scrollLeft,
  scrollTop,
  onAnnotationAdd,
  onAnnotationSelect,
  isInteractive = true,
  scrollContainerRef,
}: AnnotationOverlayProps) {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  })
  const [pendingAnnotation, setPendingAnnotation] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [commentInput, setCommentInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // DIAGNOSTIC: Global pointer event reporter
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const element = document.elementFromPoint(e.clientX, e.clientY)
      window.__CURRENT_ELEMENT__ = element
      window.__ELEMENT_INFO__ = {
        tagName: element?.tagName,
        className: element?.className,
        id: element?.id,
        pointerEvents: window.getComputedStyle(element as Element).pointerEvents,
      }
    }
    window.addEventListener("mousemove", handleGlobalMouseMove)
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove)
  }, [])

  // Generate auto-incrementing label (A1, A2, A3...)
  const getNextLabel = () => {
    const labels = annotations.map((a) => a.label)
    let index = 1
    while (labels.includes(`A${index}`)) {
      index++
    }
    return `A${index}`
  }

  // Handle mouse down - start drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // Only left click

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const startX = e.clientX - rect.left + scrollLeft
    const startY = e.clientY - rect.top + scrollTop

    // Check if clicking on existing annotation
    const clickedAnnotation = annotations.find((ann) => {
      // Calculate screen position of annotation accounting for transform
      const screenLeft = rect.left + ann.x - scrollLeft
      const screenTop = rect.top + ann.y - scrollTop
      return (
        e.clientX >= screenLeft &&
        e.clientX <= screenLeft + ann.width &&
        e.clientY >= screenTop &&
        e.clientY <= screenTop + ann.height
      )
    })

    if (clickedAnnotation) {
      onAnnotationSelect(clickedAnnotation.id)
      return
    }

    // Only start drawing if in interactive mode
    if (!isInteractive) return

    setDrawingState({
      isDrawing: true,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    })
  }

  // Handle mouse move - update drawing preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingState.isDrawing) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const currentX = e.clientX - rect.left + scrollLeft
    const currentY = e.clientY - rect.top + scrollTop

    setDrawingState((prev) => ({
      ...prev,
      currentX,
      currentY,
    }))
  }

  // Handle mouse up - finalize annotation
  const handleMouseUp = () => {
    if (!drawingState.isDrawing) return

    const width = Math.abs(drawingState.currentX - drawingState.startX)
    const height = Math.abs(drawingState.currentY - drawingState.startY)

    // Only proceed if it has meaningful dimensions
    if (width > 10 && height > 10) {
      const x = Math.min(drawingState.startX, drawingState.currentX)
      const y = Math.min(drawingState.startY, drawingState.currentY)

      // Set pending annotation instead of immediately creating
      setPendingAnnotation({ x, y, width, height })
      setCommentInput("")
    }

    setDrawingState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    })
  }

  // Forward wheel events to the scroll container for scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // DIAGNOSTIC: Event bubbling log
    console.log('Wheel event captured by Overlay', {
      deltaY: e.deltaY,
      deltaX: e.deltaX,
      hasScrollRef: !!scrollContainerRef?.current,
    })
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTop += e.deltaY
      scrollContainerRef.current.scrollLeft += e.deltaX
    }
  }

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (!pendingAnnotation || !commentInput) return

    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      x: pendingAnnotation.x,
      y: pendingAnnotation.y,
      width: pendingAnnotation.width,
      height: pendingAnnotation.height,
      label: getNextLabel(),
      color: currentColor,
      comment: commentInput,
    }

    onAnnotationAdd(newAnnotation)

    // Clear pending state
    setPendingAnnotation(null)
    setCommentInput("")
  }

  // Get drawing preview box if currently drawing
  const getPreviewBox = () => {
    if (!drawingState.isDrawing) return null

    const left = Math.min(drawingState.startX, drawingState.currentX)
    const top = Math.min(drawingState.startY, drawingState.currentY)
    const width = Math.abs(drawingState.currentX - drawingState.startX)
    const height = Math.abs(drawingState.currentY - drawingState.startY)

    return { left, top, width, height }
  }

  const previewBox = getPreviewBox()

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className="absolute inset-0 will-change-transform pointer-events-none bg-blue-500/10"
      style={{
        cursor: isInteractive && drawingState.isDrawing ? "crosshair" : "default",
        transform: `translate(${-scrollLeft}px, ${-scrollTop}px)`,
        pointerEvents: isInteractive ? "auto" : "none",
        border: "2px dashed red",
      }}
    >
      {/* Render existing annotations */}
      {annotations.map((annotation) => {
        const isSelected = annotation.id === selectedAnnotationId

        return (
          <div
            key={annotation.id}
            onClick={() => onAnnotationSelect(annotation.id)}
            className="absolute group cursor-pointer transition-all pointer-events-auto"
            style={{
              left: `${annotation.x}px`,
              top: `${annotation.y}px`,
              width: `${annotation.width}px`,
              height: `${annotation.height}px`,
              pointerEvents: "auto",
            }}
          >
            {/* Annotation border */}
            <div
              className={`absolute inset-0 border-2 transition-all ${
                isSelected ? "border-blue-500 shadow-lg shadow-blue-500/20" : ""
              } group-hover:shadow-lg group-hover:shadow-current/20`}
              style={{
                borderColor: isSelected ? "#3b82f6" : colorMap[annotation.color] || "#ef4444",
              }}
            />

            {/* Label chip */}
            <div
              className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white shadow-md"
              style={{
                backgroundColor: colorMap[annotation.color] || "#ef4444",
              }}
            >
              {annotation.label}
            </div>
          </div>
        )
      })}

      {/* Drawing preview */}
      {previewBox && (
        <div
          className="absolute border-2 border-dashed"
          style={{
            left: `${previewBox.left}px`,
            top: `${previewBox.top}px`,
            width: `${previewBox.width}px`,
            height: `${previewBox.height}px`,
            borderColor: colorMap[currentColor] || "#ef4444",
            backgroundColor: colorMap[currentColor] || "#ef4444",
            opacity: 0.3,
          }}
        />
      )}

      {/* Pending Annotation Rectangle - persists while comment box is open */}
      {pendingAnnotation && (
        <div
          className="absolute border-2"
          style={{
            left: `${pendingAnnotation.x - scrollLeft}px`,
            top: `${pendingAnnotation.y - scrollTop}px`,
            width: `${pendingAnnotation.width}px`,
            height: `${pendingAnnotation.height}px`,
            borderColor: colorMap[currentColor] || "#ef4444",
            backgroundColor: colorMap[currentColor] || "#ef4444",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Comment Input Box - appears below the pending annotation */}
      {pendingAnnotation && (
        <Card
          className="absolute z-50 w-72 shadow-lg bg-popover border-border"
          style={{
            left: `${pendingAnnotation.x}px`,
            top: `${pendingAnnotation.y + pendingAnnotation.height + 8}px`,
            pointerEvents: "auto",
            transform: `translate(${-scrollLeft}px, ${-scrollTop}px)`,
          }}
        >
          <CardContent className="p-3 space-y-2.5">
            {/* Annotation number badge */}
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              Annotation {annotations.length + 1}
            </Badge>

            <Input
              autoFocus
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentInput) {
                  handleCommentSubmit()
                } else if (e.key === "Escape") {
                  setPendingAnnotation(null)
                  setCommentInput("")
                }
              }}
              placeholder="Add a comment..."
              className="bg-background"
            />

            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  setPendingAnnotation(null)
                  setCommentInput("")
                }}
              >
                Cancel
                <kbd className="ml-0.5 rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </Button>
              <Button
                size="sm"
                onClick={handleCommentSubmit}
                disabled={!commentInput}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
