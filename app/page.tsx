"use client"

import { useState } from "react"
import { CanvasHeader } from "@/components/layout/canvas-header"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"
import { CanvasSidebar } from "@/components/layout/canvas-sidebar"
import { TestBlock } from "@/components/test/test-block-editor"

export default function Home() {
  const [showUploadModal, setShowUploadModal] = useState(true)
  const [canvasMode, setCanvasMode] = useState<"drawing" | "url-preview">("drawing")
  const [importedUrl, setImportedUrl] = useState<string | undefined>()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [activePageId, setActivePageId] = useState("canvas-1")
  const [testTitle, setTestTitle] = useState("")
  const [blocks, setBlocks] = useState<TestBlock[]>([
    {
      id: "block-1",
      type: "first-click",
      content: "",
    },
  ])

  const canvasPages = [
    { id: "canvas-1", name: "Canvas" },
    { id: "canvas-2", name: "Feedback" },
  ]

  const handleUploadComplete = (data: { method: string; websiteUrl?: string; figmaUrl?: string; imageFiles?: File[] }) => {
    if (data.method === "canvas") {
      setCanvasMode("drawing")
      setImportedUrl(undefined)
      setImageFiles([])
    } else if ((data.method === "url" || data.method === "figma") && (data.websiteUrl || data.figmaUrl)) {
      setCanvasMode("url-preview")
      setImportedUrl(data.websiteUrl || data.figmaUrl)
      setImageFiles([])
    } else if (data.method === "image" && data.imageFiles) {
      setCanvasMode("drawing")
      setImportedUrl(undefined)
      setImageFiles(data.imageFiles)
    }
  }

  const handleAddBlock = () => {
    const newBlock: TestBlock = {
      id: `block-${Date.now()}`,
      type: "first-click",
      content: "",
    }
    setBlocks([...blocks, newBlock])
  }

  const handleAddBlockAtIndex = (index: number) => {
    const newBlock: TestBlock = {
      id: `block-${Date.now()}`,
      type: "first-click",
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
        onCanvasPageAdd={() => console.log("Add page clicked")}
        onCanvasPageClose={(id) => {
          const filtered = canvasPages.filter((p) => p.id !== id)
          if (filtered.length > 0) {
            setActivePageId(filtered[0].id)
          }
        }}
        onSave={() => console.log("Save clicked")}
        onPublish={() => setShowUploadModal(true)}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Main content area with canvas and sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas - takes remaining space */}
        <div className="flex-1 overflow-auto relative">
          <Canvas
            mode={canvasMode}
            websiteUrl={importedUrl}
            imageFiles={imageFiles}
            onClear={() => {
              setImportedUrl(undefined)
              setCanvasMode("drawing")
              setImageFiles([])
            }}
            onImagesInserted={() => {
              setImageFiles([])
            }}
          />
          {canvasMode === "drawing" && !importedUrl && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-auto">
              <UploadDesignModal
                open={showUploadModal}
                onOpenChange={setShowUploadModal}
                onUploadComplete={handleUploadComplete}
                embedded
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
          credits={50}
        />
      </div>

      {importedUrl && (
        <UploadDesignModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  )
}
