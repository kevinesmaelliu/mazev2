"use client"

import { Annotation } from "@/types/annotation"

interface CanvasPageData {
  id: string
  name: string
  annotations: Annotation[]
}

interface CanvasState {
  mode: "drawing" | "url-preview"
  websiteUrl?: string
  figmaUrl?: string
  uploadedImages: string[]
  imageFiles: File[]
  showUploadModal: boolean
}

interface CanvasPreviewPanelProps {
  canvasPages: CanvasPageData[]
  canvasStateMap: Record<string, CanvasState>
}

export function CanvasPreviewPanel({
  canvasPages,
  canvasStateMap,
}: CanvasPreviewPanelProps) {
  if (!canvasPages || canvasPages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No canvas or design uploaded</p>
        </div>
      </div>
    )
  }

  const firstPage = canvasPages[0]
  const canvasState = canvasStateMap?.[firstPage.id]

  if (!canvasState) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Canvas not loaded</p>
      </div>
    )
  }

  if (canvasState.mode === "url-preview") {
    if (canvasState.websiteUrl) {
      return (
        <div className="w-full h-full bg-background">
          <iframe
            src={canvasState.websiteUrl}
            className="w-full h-full border-0"
            title="Preview of website"
          />
        </div>
      )
    }

    if (canvasState.figmaUrl) {
      return (
        <div className="w-full h-full bg-background">
          <iframe
            src={canvasState.figmaUrl}
            className="w-full h-full border-0"
            title="Preview of Figma file"
          />
        </div>
      )
    }
  }

  if (canvasState.uploadedImages && canvasState.uploadedImages.length > 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background p-4">
        <img
          src={canvasState.uploadedImages[0]}
          alt="Canvas preview"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <p className="text-muted-foreground">No content available</p>
    </div>
  )
}
