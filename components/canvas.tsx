"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { TLDrawCanvas } from "@/components/canvas/tldraw-canvas"
import { insertImageFromFile } from "@/lib/tldraw-utils"
import { Editor } from "tldraw"

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
  onEditorMount?: (editor: Editor) => void
  initialCanvasState?: unknown
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
}: CanvasProps) {
  const [isLoading, setIsLoading] = useState(!!websiteUrl)
  const editorRef = useRef<Editor | null>(null)

  // Handle backwards compatibility with canvasMode prop
  const mode: CanvasMode = propMode || (canvasMode ? 'drawing' : 'url-preview')
  const isDrawingMode = mode === 'drawing'
  const isPreviewMode = mode === 'url-preview'

  // Handle uploaded image files insertion
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0 && editorRef.current) {
      const insertImages = async () => {
        try {
          for (const file of imageFiles) {
            await insertImageFromFile(editorRef.current!, file)
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

  const handleEditorMount = (editor: Editor) => {
    editorRef.current = editor
    onEditorMount?.(editor)
  }

  // Drawing mode - TLDrawCanvas
  if (isDrawingMode) {
    return (
      <div className="w-full h-full bg-background border-t border-border">
        <TLDrawCanvas
          width="100%"
          height="100%"
          onEditorMount={handleEditorMount}
          initialState={initialCanvasState}
          autoSave={true}
          autoSaveInterval={5000}
        />
      </div>
    )
  }

  // URL preview mode with no loaded content - empty state
  if (isPreviewMode && !websiteUrl) {
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

  // URL preview mode - iframe
  return (
    <div className="w-full h-full bg-background border-t border-border flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {websiteUrl ? new URL(websiteUrl).hostname : 'Preview'}
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

      {/* Iframe container */}
      {websiteUrl && (
        <div className="flex-1 overflow-hidden">
          <iframe
            src={websiteUrl}
            title="Imported Website"
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
    </div>
  )
}
