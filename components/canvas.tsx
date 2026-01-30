"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CanvasProps {
  websiteUrl?: string
  onClear?: () => void
}

export function Canvas({ websiteUrl, onClear }: CanvasProps) {
  const [isLoading, setIsLoading] = useState(!!websiteUrl)

  if (!websiteUrl) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center border-t border-border">
        <div className="text-center">
          <p className="text-muted-foreground">No design loaded</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click "Open Upload Modal" to import a design
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-background border-t border-border flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {new URL(websiteUrl).hostname}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading website...</p>
          </div>
        </div>
      )}

      {/* Iframe container */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={websiteUrl}
          title="Imported Website"
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </div>
  )
}
