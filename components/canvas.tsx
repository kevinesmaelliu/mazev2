"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { KonvaCanvas } from "@/components/canvas/konva-canvas"
import { insertImageFromFile } from "@/lib/konva-utils-client"
import type Konva from "konva"

type CanvasMode = 'drawing' | 'url-preview'

interface CanvasProps {
  mode?: CanvasMode
  websiteUrl?: string
  imageUrl?: string
  figmaUrl?: string
  imageFiles?: File[]
  onClear?: () => void
  onImagesInserted?: () => void
  /** @deprecated Use mode prop instead */
  canvasMode?: boolean
  onEditorMount?: (stage: Konva.Stage) => void
  initialCanvasState?: unknown
  /** When true, upload modal is open – hide skeleton so modal stays clickable */
  uploadModalOpen?: boolean
}

export function Canvas({
  mode: propMode,
  websiteUrl,
  imageUrl,
  figmaUrl,
  imageFiles,
  onClear,
  onImagesInserted,
  canvasMode,
  onEditorMount,
  initialCanvasState,
  uploadModalOpen = false,
}: CanvasProps) {
  const [isLoading, setIsLoading] = useState(!!websiteUrl || !!figmaUrl || !!imageUrl || !!imageFiles)
  const [canvasReady, setCanvasReady] = useState(false)
  const [shimmerMinTimePassed, setShimmerMinTimePassed] = useState(true)
  const stageRef = useRef<Konva.Stage | null>(null)
  const prevModeRef = useRef<CanvasMode | null>(null)
  const prevUploadModalOpenRef = useRef(uploadModalOpen)

  // Handle backwards compatibility with canvasMode prop
  const mode: CanvasMode = propMode || (canvasMode ? 'drawing' : 'url-preview')
  const isDrawingMode = mode === 'drawing'
  const isPreviewMode = mode === 'url-preview'

  // Reset canvas ready only when entering drawing mode so shimmer shows again
  useEffect(() => {
    if (isDrawingMode && prevModeRef.current !== "drawing") {
      setCanvasReady(false)
    }
    prevModeRef.current = mode
  }, [isDrawingMode, mode])

  // When user closes upload modal and enters canvas view, show shimmer for minimum duration
  useEffect(() => {
    const justEnteredCanvasView = !uploadModalOpen && prevUploadModalOpenRef.current
    prevUploadModalOpenRef.current = uploadModalOpen

    if (isDrawingMode && justEnteredCanvasView) {
      setShimmerMinTimePassed(false)
    }
    if (uploadModalOpen) {
      setShimmerMinTimePassed(true)
    }
  }, [uploadModalOpen, isDrawingMode])

  const SHIMMER_MIN_MS = 900

  useEffect(() => {
    if (!isDrawingMode || uploadModalOpen || shimmerMinTimePassed) return
    const t = setTimeout(() => setShimmerMinTimePassed(true), SHIMMER_MIN_MS)
    return () => clearTimeout(t)
  }, [isDrawingMode, uploadModalOpen, shimmerMinTimePassed])

  // Handle uploaded image files insertion
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0 && stageRef.current) {
      const insertImages = async () => {
        try {
          for (const file of imageFiles) {
            await insertImageFromFile(stageRef.current!, file)
          }
          onImagesInserted?.()
          toast.success('Images inserted', {
            description: `${imageFiles.length} image${imageFiles.length !== 1 ? 's' : ''} added to canvas`,
          })
        } catch (error) {
          console.error('Failed to insert images:', error)
          toast.error('Failed to insert images', {
            description: 'One or more images could not be inserted. Please try again.',
          })
        }
      }
      insertImages()
    }
  }, [imageFiles, onImagesInserted])

  // Handle image loading errors
  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onerror = () => {
        toast.error('Failed to load image', {
          description: 'The image could not be loaded. Please try uploading a different file.',
        })
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  // Handle Figma frame loading
  useEffect(() => {
    if (figmaUrl) {
      // Validate Figma URL format
      if (!figmaUrl.includes('figma.com')) {
        toast.error('Invalid Figma URL', {
          description: 'Please provide a valid Figma file or prototype URL.',
        })
      }
    }
  }, [figmaUrl])

  const handleEditorMount = (stage: Konva.Stage) => {
    stageRef.current = stage
    onEditorMount?.(stage)
    setCanvasReady(true)
  }

  // Drawing mode - KonvaCanvas with shimmer on entry (hide when modal is open; min duration so user sees it)
  if (isDrawingMode) {
    const showShimmer = !uploadModalOpen && (!shimmerMinTimePassed || !canvasReady)
    return (
      <div className="w-full h-full bg-background border-t border-border relative">
        {showShimmer && (
          <div
            className="canvas-shimmer-wrap canvas-shimmer-bg absolute inset-0 z-10 bg-muted/50"
            aria-busy="true"
            aria-label="Loading canvas"
          />
        )}
        <KonvaCanvas
          width="100%"
          height="100%"
          onEditorMount={handleEditorMount}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialState={initialCanvasState as any}
          autoSave={true}
          autoSaveInterval={5000}
        />
      </div>
    )
  }

  // URL preview mode with no loaded content - empty state
  if (isPreviewMode && !websiteUrl && !figmaUrl && !imageUrl) {
    return (
      <div className="w-full h-full bg-[#130f0c] flex items-center justify-center border-t border-border">
        <div className="text-center">
          <p className="text-muted-foreground">No design loaded</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click &quot;Open Upload Modal&quot; to import a design
          </p>
        </div>
      </div>
    )
  }

  // URL preview mode - iframe
  return (
    <div className="w-full h-full bg-[#130f0c] border-t border-border flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {websiteUrl ? new URL(websiteUrl).hostname : figmaUrl ? 'Figma' : imageUrl ? 'Image Preview' : 'Preview'}
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
        <div className="absolute inset-0 bg-[#130f0c]/50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Iframe/Preview container */}
      {(websiteUrl || figmaUrl) && (
        <div className="flex-1 overflow-hidden">
          <iframe
            src={websiteUrl || figmaUrl}
            title={websiteUrl ? "Imported Website" : "Figma Design"}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              toast.error('Failed to load preview', {
                description: 'The website or Figma prototype could not be loaded. Please check the URL and try again.',
              })
            }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          />
        </div>
      )}

      {/* Image preview container */}
      {imageUrl && !websiteUrl && !figmaUrl && (
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-[#130f0c]">
          <img
            src={imageUrl}
            alt="Uploaded design"
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              toast.error('Failed to load image', {
                description: 'The image could not be loaded. Please try uploading a different file.',
              })
            }}
          />
        </div>
      )}
    </div>
  )
}
