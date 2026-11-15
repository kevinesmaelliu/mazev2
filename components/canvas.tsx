"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { KonvaCanvas } from "@/components/canvas/konva-canvas"
import { WebsiteViewer } from "@/components/canvas/website-viewer"
import { ProxyToggle } from "@/components/canvas/proxy-toggle"
import { insertImageFromFile } from "@/lib/konva-utils-client"
import type Konva from "konva"
import type { Annotation } from "@/types/annotation"
import type { HighlightColor } from "@/components/canvas/annotation-toolbar"

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
  isAnnotating?: boolean
  annotations?: Annotation[]
  selectedAnnotationId?: string | null
  annotationColor?: HighlightColor
  onAnnotationAdd?: (annotation: Annotation) => void
  onAnnotationSelect?: (id: string | null) => void
  useProxy?: boolean
  onProxyToggle?: (enabled: boolean) => void
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
  isAnnotating,
  annotations = [],
  selectedAnnotationId,
  annotationColor = "red",
  onAnnotationAdd,
  onAnnotationSelect,
  useProxy = false,
  onProxyToggle,
}: CanvasProps) {
  const [isLoading, setIsLoading] = useState(!!websiteUrl || !!figmaUrl || !!imageUrl || !!imageFiles)
  const [canvasReady, setCanvasReady] = useState(false)
  const stageRef = useRef<Konva.Stage | null>(null)
  const prevModeRef = useRef<CanvasMode | null>(null)

  // Handle backwards compatibility with canvasMode prop
  const mode: CanvasMode = propMode || (canvasMode ? 'drawing' : 'url-preview')
  const isDrawingMode = mode === 'drawing'
  const isPreviewMode = mode === 'url-preview'

  // Reset canvas ready only when entering drawing mode so skeleton shows again
  useEffect(() => {
    if (isDrawingMode && prevModeRef.current !== "drawing") {
      setCanvasReady(false)
    }
    prevModeRef.current = mode
  }, [isDrawingMode, mode])

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

  // Drawing mode - KonvaCanvas with skeleton loading
  if (isDrawingMode) {
    return (
      <div className="w-full h-full bg-background relative">
        {!canvasReady && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            aria-busy="true"
            aria-label="Loading canvas"
          >
            <div className="grid w-full h-full max-w-4xl max-h-[85%] gap-4 grid-cols-3 grid-rows-3">
              <Skeleton className="rounded-lg" />
              <Skeleton className="rounded-lg" />
              <Skeleton className="rounded-lg" />
              <Skeleton className="rounded-lg col-span-2" />
              <Skeleton className="rounded-lg" />
              <Skeleton className="rounded-lg col-span-3" />
            </div>
          </div>
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
      <div className="w-full h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No design loaded</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click &quot;Open Upload Modal&quot; to import a design
          </p>
        </div>
      </div>
    )
  }

  // URL preview mode
  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
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
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Website/Figma preview container with annotation support */}
      {(websiteUrl || figmaUrl) && (
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {websiteUrl && (
            <ProxyToggle
              enabled={useProxy}
              onToggle={onProxyToggle || (() => {})}
            />
          )}
          <WebsiteViewer
            url={websiteUrl || figmaUrl}
            isAnnotating={isAnnotating || false}
            annotations={annotations}
            selectedAnnotationId={selectedAnnotationId || null}
            annotationColor={annotationColor}
            onAnnotationAdd={onAnnotationAdd || (() => {})}
            onAnnotationSelect={onAnnotationSelect || (() => {})}
            onLoad={() => setIsLoading(false)}
            useProxy={useProxy}
          />
        </div>
      )}

      {/* Image preview container */}
      {imageUrl && !websiteUrl && !figmaUrl && (
        <div className="flex-1 overflow-hidden flex items-center justify-center bg-background">
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
