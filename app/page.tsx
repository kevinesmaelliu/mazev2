"use client"

import { useState } from "react"
import { CanvasHeader } from "@/components/layout/canvas-header"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"
import { CanvasSidebar } from "@/components/layout/canvas-sidebar"
import { TestBlock } from "@/components/test/test-block-editor"

interface CanvasState {
  mode: "drawing" | "url-preview"
  websiteUrl?: string
  figmaUrl?: string
  uploadedImages: string[]
  imageFiles: File[]
  showUploadModal: boolean
}

export default function Home() {
  const [activePageId, setActivePageId] = useState("canvas-1")
  const [canvasPages, setCanvasPages] = useState([
    { id: "canvas-1", name: "Canvas" },
  ])
  const [canvasStateMap, setCanvasStateMap] = useState<Record<string, CanvasState>>({
    "canvas-1": {
      mode: "drawing",
      websiteUrl: undefined,
      figmaUrl: undefined,
      uploadedImages: [],
      imageFiles: [],
      showUploadModal: true,
    },
  })
  const [testTitle, setTestTitle] = useState("")
  const [blocks, setBlocks] = useState<TestBlock[]>([
    {
      id: "block-1",
      type: "first-click",
      content: "",
    },
  ])

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
      },
    }))
  }

  const handleAddBlock = () => {
    const newBlock: TestBlock = {
      id: `block-${Date.now()}`,
      type: "first-click",
      content: "",
    }
    setBlocks([...blocks, newBlock])
  }

  const handleAddBlockAtIndex = (index: number, type: TestBlock["type"] = "first-click") => {
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
          type: "first-click",
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

  const handleAddCanvasPage = () => {
    const newPageId = `canvas-${Date.now()}`
    const newPageNumber = canvasPages.length + 1
    setCanvasPages([...canvasPages, { id: newPageId, name: `Canvas ${newPageNumber}` }])
    setCanvasStateMap((prev) => ({
      ...prev,
      [newPageId]: {
        mode: "drawing",
        websiteUrl: undefined,
        figmaUrl: undefined,
        uploadedImages: [],
        imageFiles: [],
        showUploadModal: true,
      },
    }))
    setActivePageId(newPageId)
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

  return (
    <div className="flex flex-col h-screen bg-[#130f0c]">
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
        onSave={() => console.log("Save clicked")}
        onPublish={() => updateCanvasState({ showUploadModal: true })}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Main content area with canvas and sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas - takes remaining space */}
        <div className="flex-1 overflow-auto relative bg-[#130f0c]">
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
            uploadModalOpen={currentCanvasState.showUploadModal}
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
