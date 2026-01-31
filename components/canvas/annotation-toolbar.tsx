"use client"

import { Eye, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnnotationToolbarProps {
  isAnnotating: boolean
  selectedAnnotationId: string | null
  currentColor: string
  onModeChange: (isAnnotating: boolean) => void
  onColorChange: (color: string) => void
  onDeleteAnnotation: () => void
}

const colors = [
  { name: "red", hex: "#ef4444", label: "Red" },
  { name: "orange", hex: "#f97316", label: "Orange" },
  { name: "yellow", hex: "#eab308", label: "Yellow" },
  { name: "green", hex: "#22c55e", label: "Green" },
  { name: "blue", hex: "#3b82f6", label: "Blue" },
]

export function AnnotationToolbar({
  isAnnotating,
  selectedAnnotationId,
  currentColor,
  onModeChange,
  onColorChange,
  onDeleteAnnotation,
}: AnnotationToolbarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-background border border-border rounded-full px-2 py-2 flex items-center gap-2 shadow-lg">
      {/* View/Annotate Toggle */}
      <Button
        variant={isAnnotating ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange(!isAnnotating)}
        className="rounded-full h-9 w-9 p-0"
        title={isAnnotating ? "Switch to View Mode" : "Switch to Annotate Mode"}
      >
        {isAnnotating ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </Button>

      {/* Color Picker */}
      <div className="flex items-center gap-1 px-1">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name)}
            title={color.label}
            className={`h-6 w-6 rounded-full border-2 transition-all ${
              currentColor === color.name
                ? "border-foreground ring-2 ring-offset-2 ring-offset-background"
                : "border-transparent hover:border-foreground/50"
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>

      {/* Delete Button - visible only when annotation selected */}
      {selectedAnnotationId && (
        <>
          <div className="w-px h-6 bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeleteAnnotation}
            className="rounded-full h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            title="Delete selected annotation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}
