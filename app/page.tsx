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
  const [websiteUrl, setWebsiteUrl] = useState<string | undefined>()
  const [figmaUrl, setFigmaUrl] = useState<string | undefined>()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
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
  ]

  const handleUploadComplete = (data: { method: string; websiteUrl?: string; figmaUrl?: string }) => {
    if (data.method === "canvas") {
      setCanvasMode("drawing")
      setWebsiteUrl(undefined)
      setFigmaUrl(undefined)
      setUploadedImages([])
      setImageFiles([])
    } else if (data.method === "url" && data.websiteUrl) {
      setCanvasMode("url-preview")
      setWebsiteUrl(data.websiteUrl)
      setFigmaUrl(undefined)
      setImageFiles([])
    } else if (data.method === "figma" && data.figmaUrl) {
      setCanvasMode("url-preview")
      setFigmaUrl(data.figmaUrl)
      setWebsiteUrl(undefined)
      setImageFiles([])
    }
  }

  const handleCanvasClear = () => {
    setCanvasMode("drawing")
    setWebsiteUrl(undefined)
    setFigmaUrl(undefined)
    setUploadedImages([])
    setImageFiles([])
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

  const handleAddBlocksGenerated = (generatedBlocks: TestBlock[]) => {
    setBlocks([...blocks, ...generatedBlocks])
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
      <div className="flex flex-1 overflow-hidden relative">
        {/* Canvas - takes remaining space */}
        <div className="flex-1 overflow-auto relative bg-[#130f0c]">
          <Canvas
            mode={canvasMode}
            websiteUrl={websiteUrl}
            figmaUrl={figmaUrl}
            imageUrl={uploadedImages[0]}
            imageFiles={imageFiles}
            onClear={handleCanvasClear}
            onImagesInserted={() => {
              setImageFiles([])
            }}
          />
          {canvasMode === "drawing" && !websiteUrl && !figmaUrl && uploadedImages.length === 0 && imageFiles.length === 0 && showUploadModal && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
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
          onAddBlocksGenerated={handleAddBlocksGenerated}
          credits={50}
        />
      </div>

      {(websiteUrl || figmaUrl) && (
        <UploadDesignModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  )
}
