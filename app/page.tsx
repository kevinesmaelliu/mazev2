"use client"

import { useState } from "react"
import { CanvasHeader } from "@/components/layout/canvas-header"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"
import { CanvasSidebar } from "@/components/layout/canvas-sidebar"
import { TestBlock } from "@/components/test/test-block-editor"
import { AnnotationToolbar } from "@/components/canvas/annotation-toolbar"
import type { HighlightColor } from "@/components/canvas/annotation-toolbar"

export interface Annotation {
  id: string
  x: number
  y: number
  width: number
  height: number
  label: string
  color: string
  comment: string
}

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
  useProxy?: boolean
}

export default function Home() {
  const [activePageId, setActivePageId] = useState("canvas-1")
  const [canvasPages, setCanvasPages] = useState<CanvasPageData[]>([
    { id: "canvas-1", name: "Canvas", annotations: [] },
  ])
  const [canvasStateMap, setCanvasStateMap] = useState<Record<string, CanvasState>>({
    "canvas-1": {
      mode: "drawing",
      websiteUrl: undefined,
      figmaUrl: undefined,
      uploadedImages: [],
      imageFiles: [],
      showUploadModal: true,
      useProxy: false,
    },
  })
  const [testTitle, setTestTitle] = useState("")
  const [blocks, setBlocks] = useState<TestBlock[]>([
    {
      id: "block-1",
      type: "short-question",
      content: "",
    },
  ])
  const [isAnnotating, setIsAnnotating] = useState(false)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [annotationColor, setAnnotationColor] = useState<HighlightColor>("red")

  // Get current canvas state
  const currentCanvasState = canvasStateMap[activePageId]

  const handleUploadComplete = (data: { method: string; websiteUrl?: string; figmaUrl?: string }) => {
    setCanvasStateMap((prev) => ({
      ...prev,
      [activePageId]: {
        mode: data.method === "canvas" ? "drawing" : "url-preview",
        websiteUrl: data.method === "url" ? data.websiteUrl : undefined,
        figmaUrl: data.method === "figma" ? data.figmaUrl : undefined,
        uploadedImages: data.method === "canvas" ? [] : prev[activePageId]?.uploadedImages || [],
        imageFiles: [],
        showUploadModal: false,
        useProxy: false,
      },
    }))
  }

  const handleCanvasClear = () => {
    setCanvasStateMap((prev) => ({
      ...prev,
      [activePageId]: {
        mode: "drawing",
        websiteUrl: undefined,
        figmaUrl: undefined,
        uploadedImages: [],
        imageFiles: [],
        showUploadModal: true,
        useProxy: false,
      },
    }))
  }

  const handleAddBlock = () => {
    const newBlock: TestBlock = {
      id: `block-${Date.now()}`,
      type: "short-question",
      content: "",
    }
    setBlocks([...blocks, newBlock])
  }

  const handleAddBlockAtIndex = (index: number, type: TestBlock["type"] = "short-question") => {
    const newBlock: TestBlock = {
      id: `block-${Date.now()}`,
      type,
      content: "",
    }
    const newBlocks = [...blocks]
    newBlocks.splice(index, 0, newBlock)
    setBlocks(newBlocks)
  }

  const handleUpdateBlock = (id: string, updatedBlock: TestBlock) => {
    setBlocks(blocks.map((b) => (b.id === id ? updatedBlock : b)))
  }

  const handleDeleteBlock = (id: string) => {
    if (blocks.length === 1) {
      // Reset to empty if it's the last block
      setBlocks([
        {
          id: `block-${Date.now()}`,
          type: "short-question",
          content: "",
        },
      ])
    } else {
      setBlocks(blocks.filter((b) => b.id !== id))
    }
  }

  const handleAddBlocksGenerated = (generatedBlocks: TestBlock[]) => {
    setBlocks([...blocks, ...generatedBlocks])
  }

  const handleMoveBlock = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) return
    const next = [...blocks]
    const [removed] = next.splice(dragIndex, 1)
    next.splice(hoverIndex, 0, removed!)
    setBlocks(next)
  }

  const handleAnnotationAdd = (annotation: Annotation) => {
    setCanvasPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, annotations: [...page.annotations, annotation] }
          : page
      )
    )
  }

  const handleAddCanvasPage = () => {
    const newPageId = `canvas-${Date.now()}`
    const newPageNumber = canvasPages.length + 1
    setCanvasPages([...canvasPages, { id: newPageId, name: `Canvas ${newPageNumber}`, annotations: [] }])
    setCanvasStateMap((prev) => ({
      ...prev,
      [newPageId]: {
        mode: "drawing",
        websiteUrl: undefined,
        figmaUrl: undefined,
        uploadedImages: [],
        imageFiles: [],
        showUploadModal: true,
        useProxy: false,
      },
    }))
    setActivePageId(newPageId)
  }

  const handleDeleteAnnotation = (id: string) => {
    setCanvasPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? { ...page, annotations: page.annotations.filter((a) => a.id !== id) }
          : page
      )
    )
    setSelectedAnnotationId(null)
  }

  const getCurrentPageAnnotations = () => {
    return canvasPages.find((p) => p.id === activePageId)?.annotations || []
  }

  const handleCanvasPageClose = (id: string) => {
    const filtered = canvasPages.filter((p) => p.id !== id)
    setCanvasPages(filtered)

    // Remove the canvas state for the deleted page
    setCanvasStateMap((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })

    // Switch to another tab if the active tab was closed
    if (activePageId === id && filtered.length > 0) {
      setActivePageId(filtered[0].id)
    }
  }

  const updateCanvasState = (updates: Partial<CanvasState>) => {
    setCanvasStateMap((prev) => ({
      ...prev,
      [activePageId]: {
        ...prev[activePageId],
        ...updates,
      },
    }))
  }

  const handleProxyToggle = (enabled: boolean) => {
    updateCanvasState({ useProxy: enabled })
  }

  // Determine if canvas has content (not in upload modal state)
  const hasCanvasContent = !(
    currentCanvasState.mode === "drawing" &&
    !currentCanvasState.websiteUrl &&
    !currentCanvasState.figmaUrl &&
    currentCanvasState.uploadedImages.length === 0 &&
    currentCanvasState.imageFiles.length === 0 &&
    currentCanvasState.showUploadModal
  )

  const handlePreview = () => {
    const testData = {
      title: testTitle,
      blocks,
      canvasPages,
      canvasStateMap,
    }
    const encodedData = encodeURIComponent(JSON.stringify(testData))
    window.open(`/preview?data=${encodedData}`, "_blank")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <CanvasHeader
        projectName="Untitled Design Review"
        credits={50}
        canvasPages={canvasPages}
        activeCanvasPageId={activePageId}
        userInitial="U"
        onBack={() => console.log("Back clicked")}
        onCanvasPageSelect={(id) => setActivePageId(id)}
        onCanvasPageAdd={handleAddCanvasPage}
        onCanvasPageClose={handleCanvasPageClose}
        onPreview={handlePreview}
        onPublish={() => updateCanvasState({ showUploadModal: true })}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Main content area with canvas and sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas - takes remaining space */}
        <div className="flex-1 overflow-hidden relative bg-background">
          <Canvas
            mode={currentCanvasState.mode}
            websiteUrl={currentCanvasState.websiteUrl}
            figmaUrl={currentCanvasState.figmaUrl}
            imageUrl={currentCanvasState.uploadedImages[0]}
            imageFiles={currentCanvasState.imageFiles}
            onClear={handleCanvasClear}
            onImagesInserted={() => {
              updateCanvasState({ imageFiles: [] })
            }}
            isAnnotating={isAnnotating}
            annotations={getCurrentPageAnnotations()}
            selectedAnnotationId={selectedAnnotationId}
            annotationColor={annotationColor}
            onAnnotationAdd={handleAnnotationAdd}
            onAnnotationSelect={setSelectedAnnotationId}
            useProxy={currentCanvasState.useProxy || false}
            onProxyToggle={handleProxyToggle}
          />
          {currentCanvasState.mode === "drawing" && !currentCanvasState.websiteUrl && !currentCanvasState.figmaUrl && currentCanvasState.uploadedImages.length === 0 && currentCanvasState.imageFiles.length === 0 && currentCanvasState.showUploadModal && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <UploadDesignModal
                open={currentCanvasState.showUploadModal}
                onOpenChange={(open) => {
                  updateCanvasState({ showUploadModal: open })
                }}
                embedded={true}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          )}
          {/* Annotation Toolbar - only show when canvas has content */}
          {hasCanvasContent && (
            <AnnotationToolbar
              isAnnotating={isAnnotating}
              selectedAnnotationId={selectedAnnotationId}
              currentColor={annotationColor}
              onModeChange={setIsAnnotating}
              onColorChange={setAnnotationColor}
              onDeleteAnnotation={() => {
                if (selectedAnnotationId) {
                  handleDeleteAnnotation(selectedAnnotationId)
                }
              }}
            />
          )}
        </div>

        {/* Sidebar - anchored to right */}
        <CanvasSidebar
          testTitle={testTitle}
          onTestTitleChange={setTestTitle}
          blocks={blocks}
          onAddBlock={handleAddBlock}
          onAddBlockAtIndex={handleAddBlockAtIndex}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onMoveBlock={handleMoveBlock}
          onAddBlocksGenerated={handleAddBlocksGenerated}
          credits={50}
          annotations={getCurrentPageAnnotations()}
          selectedAnnotationId={selectedAnnotationId}
          onSelectAnnotation={setSelectedAnnotationId}
        />
      </div>

      {(currentCanvasState.websiteUrl || currentCanvasState.figmaUrl) && (
        <UploadDesignModal
          open={currentCanvasState.showUploadModal}
          onOpenChange={(open) => {
            updateCanvasState({ showUploadModal: open })
          }}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  )
}
