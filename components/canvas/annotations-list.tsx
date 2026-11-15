"use client"

import type { Annotation } from "@/types/annotation"

interface AnnotationsListProps {
  annotations: Annotation[]
  selectedAnnotationId: string | null
  onSelectAnnotation: (id: string) => void
}

const colorMap: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#3b82f6",
}

const colorNames: Record<string, string> = {
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue",
}

export function AnnotationsList({
  annotations,
  selectedAnnotationId,
  onSelectAnnotation,
}: AnnotationsListProps) {
  if (annotations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xs text-muted-foreground">No annotations yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Switch to Annotate mode and draw on the canvas
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {annotations.map((annotation) => {
        const isSelected = annotation.id === selectedAnnotationId
        const colorHex = colorMap[annotation.color] || "#ef4444"
        const colorLabel = colorNames[annotation.color] || "Unknown"

        return (
          <button
            key={annotation.id}
            onClick={() => onSelectAnnotation(annotation.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-all border border-transparent ${
              isSelected
                ? "bg-blue-500/10 border-blue-500/30"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Color indicator */}
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colorHex }}
              />

              {/* Label and info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{annotation.label}</p>
                <p className="text-xs text-muted-foreground">
                  {colorLabel} • {annotation.width} × {annotation.height}px
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
