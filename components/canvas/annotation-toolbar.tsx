"use client"

import { useEffect } from "react"
import { Eye, Highlighter, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type HighlightColor = "yellow" | "red" | "blue" | "green"

interface AnnotationToolbarProps {
  isAnnotating: boolean
  selectedAnnotationId: string | null
  currentColor: HighlightColor
  onModeChange: (isAnnotating: boolean) => void
  onColorChange: (color: HighlightColor) => void
  onDeleteAnnotation: () => void
}

const colorMap: Record<HighlightColor, { bg: string; border: string }> = {
  yellow: { bg: "bg-yellow-400", border: "border-yellow-500" },
  red: { bg: "bg-red-400", border: "border-red-500" },
  blue: { bg: "bg-blue-400", border: "border-blue-500" },
  green: { bg: "bg-green-400", border: "border-green-500" },
}

export function AnnotationToolbar({
  isAnnotating,
  selectedAnnotationId,
  currentColor,
  onModeChange,
  onColorChange,
  onDeleteAnnotation,
}: AnnotationToolbarProps) {
  const colors: HighlightColor[] = ["yellow", "red", "blue", "green"]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "1") {
        // Switch to View mode
        if (isAnnotating) {
          onModeChange(false)
        }
      } else if (e.key === "2") {
        // Switch to Annotate mode
        if (!isAnnotating) {
          onModeChange(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAnnotating, onModeChange])

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1.5 shadow-lg">
      {/* View Mode Button */}
      <Button
        variant={!isAnnotating ? "default" : "ghost"}
        size="sm"
        className="h-7 gap-1.5 px-2"
        onClick={() => isAnnotating && onModeChange(false)}
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="text-xs">View</span>
        <kbd className="ml-0.5 rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
          1
        </kbd>
      </Button>

      {/* Annotate Mode Button */}
      <Button
        variant={isAnnotating ? "default" : "ghost"}
        size="sm"
        className="h-7 gap-1.5 px-2"
        onClick={() => onModeChange(!isAnnotating)}
      >
        <Highlighter className="h-3.5 w-3.5" />
        <span className="text-xs">Annotate</span>
        <kbd className="ml-0.5 rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
          2
        </kbd>
      </Button>

      {/* Color Picker - Only show when annotating */}
      {isAnnotating && (
        <>
          <Separator orientation="vertical" className="h-5 mx-0.5" />

          <div className="flex items-center gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={cn(
                  "h-5 w-5 rounded transition-all",
                  colorMap[color].bg,
                  currentColor === color
                    ? `ring-2 ring-offset-1 ring-offset-card ${colorMap[color].border.replace("border-", "ring-")}`
                    : "opacity-70 hover:opacity-100"
                )}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Button - visible only when annotation selected */}
      {selectedAnnotationId && (
        <>
          <Separator orientation="vertical" className="h-5 mx-0.5" />

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-destructive hover:text-destructive"
            onClick={onDeleteAnnotation}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="text-xs">Delete</span>
          </Button>
        </>
      )}
    </div>
  )
}
