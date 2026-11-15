"use client"

import { useState, useRef } from "react"
import type { Annotation } from "@/types/annotation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AnnotationOverlayProps {
  annotations: Annotation[]
  selectedAnnotationId: string | null
  currentColor: string
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

    // Account for scroll position in parent container
    const scrollTop = scrollContainerRef?.current?.scrollTop ?? 0
    const scrollLeft = scrollContainerRef?.current?.scrollLeft ?? 0

    // Calculate position as percentage of overlay dimensions
    const startX = ((e.clientX - rect.left + scrollLeft) / rect.width) * 100
    const startY = ((e.clientY - rect.top + scrollTop) / rect.height) * 100

    // Check if clicking on existing annotation
    const clickedAnnotation = annotations.find((ann) => {
      // Account for scroll position
      const scrollTop = scrollContainerRef?.current?.scrollTop ?? 0
      const scrollLeft = scrollContainerRef?.current?.scrollLeft ?? 0

      // Convert annotation percentage to pixel range
      const annLeft = (ann.x / 100) * rect.width
      const annTop = (ann.y / 100) * rect.height
      const annWidth = (ann.width / 100) * rect.width
      const annHeight = (ann.height / 100) * rect.height
      const mouseX = e.clientX - rect.left + scrollLeft
      const mouseY = e.clientY - rect.top + scrollTop

      return (
        mouseX >= annLeft &&
        mouseX <= annLeft + annWidth &&
        mouseY >= annTop &&
        mouseY <= annTop + annHeight
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

    // Account for scroll position in parent container
    const scrollTop = scrollContainerRef?.current?.scrollTop ?? 0
    const scrollLeft = scrollContainerRef?.current?.scrollLeft ?? 0

    // Calculate position as percentage of overlay dimensions
    const currentX = ((e.clientX - rect.left + scrollLeft) / rect.width) * 100
    const currentY = ((e.clientY - rect.top + scrollTop) / rect.height) * 100

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

    // Only proceed if it has meaningful dimensions (width/height are in percentages)
    if (width > 2 && height > 2) {
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
      className="absolute inset-0 w-full pointer-events-none"
      style={{
        cursor: isInteractive && drawingState.isDrawing ? "crosshair" : "default",
        pointerEvents: isInteractive ? "auto" : "none",
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
              left: `${annotation.x}%`,
              top: `${annotation.y}%`,
              width: `${annotation.width}%`,
              height: `${annotation.height}%`,
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
            left: `${previewBox.left}%`,
            top: `${previewBox.top}%`,
            width: `${previewBox.width}%`,
            height: `${previewBox.height}%`,
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
            left: `${pendingAnnotation.x}%`,
            top: `${pendingAnnotation.y}%`,
            width: `${pendingAnnotation.width}%`,
            height: `${pendingAnnotation.height}%`,
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
            left: `${pendingAnnotation.x}%`,
            top: `calc(${pendingAnnotation.y + pendingAnnotation.height}% + 8px)`,
            pointerEvents: "auto",
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
