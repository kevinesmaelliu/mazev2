"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { TLDrawCanvas } from "@/components/canvas/tldraw-canvas"
import { Editor } from "tldraw"

type CanvasMode = "drawing" | "url-preview"

interface CanvasProps {
  mode?: CanvasMode
  websiteUrl?: string
  onClear?: () => void
  onEditorMount?: (editor: Editor) => void
  initialCanvasState?: unknown
}

export function Canvas({
  mode = "drawing",
  websiteUrl,
  onClear,
  onEditorMount,
  initialCanvasState,
}: CanvasProps) {
  const [isLoading, setIsLoading] = useState(!!websiteUrl)

  // Drawing mode - TLDraw canvas with image/Figma loading
  if (mode === "drawing") {
    return (
      <div className="w-full h-full bg-background border-t border-border">
        <TLDrawCanvas
          width="100%"
          height="100%"
          onEditorMount={onEditorMount}
          initialState={initialCanvasState}
          autoSave={true}
          autoSaveInterval={5000}
        />
      </div>
    )
  }

  // URL preview mode - iframe for website/Figma imports
  // Render empty state when no URL
  if (!websiteUrl) {
    return (
      <div className="w-full h-full bg-background flex items-center justify-center border-t border-border">
        <div className="text-center">
          <p className="text-muted-foreground">No design loaded</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click &quot;Open Upload Modal&quot; to import a design
          </p>
        </div>
      </div>
    )
  }

  // Render iframe for URL imports
  const handleIframeLoad = () => {
    setIsLoading(false)
    toast.success("Design loaded successfully")
  }

  const handleIframeError = () => {
    setIsLoading(false)
    toast.error("Failed to load design. Please check the URL and try again.")
  }

  return (
    <div className="w-full h-full bg-background border-t border-border flex flex-col">
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
            <p className="text-sm text-muted-foreground">Loading design...</p>
          </div>
        </div>
      )}

      {/* Iframe container */}
      <div className="flex-1 overflow-hidden">
        <iframe
          src={websiteUrl}
          title="Imported Design"
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
        />
      </div>
    </div>
  )
}
