"use client"

import { useState } from "react"
import { CanvasHeader } from "@/components/layout/canvas-header"
import type { CanvasPage } from "@/components/layout/canvas-header"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"
import { CanvasSidebar } from "@/components/layout/canvas-sidebar"
import { TestBlock } from "@/components/test/test-block-editor"

export interface CanvasPageState extends CanvasPage {
  canvasMode: "drawing" | "url-preview"
  websiteUrl?: string
  figmaUrl?: string
  uploadedImages: string[]
  imageFiles: File[]
}

const createEmptyCanvasPage = (id: string, name: string): CanvasPageState => ({
  id,
  name,
  canvasMode: "drawing",
  websiteUrl: undefined,
  figmaUrl: undefined,
  uploadedImages: [],
  imageFiles: [],
})

export default function Home() {
  const [showUploadModal, setShowUploadModal] = useState(true)
  const [canvasPages, setCanvasPages] = useState<CanvasPageState[]>([
    createEmptyCanvasPage("canvas-1", "Canvas"),
  ])
  const [activePageId, setActivePageId] = useState("canvas-1")
  const [testTitle, setTestTitle] = useState("")
  const [blocks, setBlocks] = useState<TestBlock[]>([
    {
      id: "block-1",
      type: "first-click",
      content: "",
    },
  ])

  const activePage = canvasPages.find((p) => p.id === activePageId) ?? canvasPages[0]

  const updateActivePage = (updater: (p: CanvasPageState) => CanvasPageState) => {
    setCanvasPages((pages) =>
      pages.map((p) => (p.id === activePageId ? updater(p) : p))
    )
  }

  const handleCanvasPageAdd = () => {
    const newId = `canvas-${Date.now()}`
    const newPage = createEmptyCanvasPage(newId, `Canvas ${canvasPages.length + 1}`)
    setCanvasPages((prev) => [...prev, newPage])
    setActivePageId(newId)
  }

  const handleCanvasPageClose = (id: string) => {
    const filtered = canvasPages.filter((p) => p.id !== id)
    if (filtered.length === 0) return
    const newActiveId =
      activePageId === id
        ? (filtered[Math.max(0, canvasPages.findIndex((p) => p.id === id) - 1)] ?? filtered[0]).id
        : activePageId
    setCanvasPages(filtered)
    setActivePageId(newActiveId)
  }

  const handleUploadComplete = (data: { method: string; websiteUrl?: string; figmaUrl?: string }) => {
    if (data.method === "canvas") {
      updateActivePage((p) => ({
        ...p,
        canvasMode: "drawing",
        websiteUrl: undefined,
        figmaUrl: undefined,
        uploadedImages: [],
        imageFiles: [],
      }))
    } else if (data.method === "url" && data.websiteUrl) {
      updateActivePage((p) => ({
        ...p,
        canvasMode: "url-preview",
        websiteUrl: data.websiteUrl,
        figmaUrl: undefined,
        imageFiles: [],
      }))
    } else if (data.method === "figma" && data.figmaUrl) {
      updateActivePage((p) => ({
        ...p,
        canvasMode: "url-preview",
        figmaUrl: data.figmaUrl,
        websiteUrl: undefined,
        imageFiles: [],
      }))
    }
  }

  const handleCanvasClear = () => {
    updateActivePage((p) => ({
      ...p,
      canvasMode: "drawing",
      websiteUrl: undefined,
      figmaUrl: undefined,
      uploadedImages: [],
      imageFiles: [],
    }))
    setShowUploadModal(true)
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
        onCanvasPageAdd={handleCanvasPageAdd}
        onCanvasPageClose={handleCanvasPageClose}
        onSave={() => console.log("Save clicked")}
        onPublish={() => setShowUploadModal(true)}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Main content area with canvas and sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas - takes remaining space */}
        <div className="flex-1 overflow-auto relative bg-[#130f0c]">
          <Canvas
            key={activePageId}
            mode={activePage.canvasMode}
            websiteUrl={activePage.websiteUrl}
            figmaUrl={activePage.figmaUrl}
            imageUrl={activePage.uploadedImages[0]}
            imageFiles={activePage.imageFiles}
            onClear={handleCanvasClear}
            onImagesInserted={() => {
              updateActivePage((p) => ({ ...p, imageFiles: [] }))
            }}
            uploadModalOpen={showUploadModal}
          />
          {activePage.canvasMode === "drawing" && !activePage.websiteUrl && !activePage.figmaUrl && activePage.uploadedImages.length === 0 && activePage.imageFiles.length === 0 && showUploadModal && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <UploadDesignModal
                open={showUploadModal}
                onOpenChange={setShowUploadModal}
                onUploadComplete={handleUploadComplete}
                embedded={true}
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

      {(activePage.websiteUrl || activePage.figmaUrl) && (
        <UploadDesignModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  )
}
