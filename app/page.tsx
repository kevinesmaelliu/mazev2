"use client"

import { useState } from "react"
import { CanvasHeader } from "@/components/layout/canvas-header"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"
import { TestBlocksSidebar } from "@/components/test/test-blocks-sidebar"

interface TestBlock {
  id: string
  label: string
  type: "first-click" | "task" | "preference"
  question: string
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [importedUrl, setImportedUrl] = useState<string | undefined>()
  const [activePageId, setActivePageId] = useState("canvas-1")
  const [testTitle, setTestTitle] = useState("")
  const [blocks, setBlocks] = useState<TestBlock[]>([])

  const canvasPages = [
    { id: "canvas-1", name: "Canvas" },
    { id: "canvas-2", name: "Feedback" },
  ]

  const handleUploadComplete = (data: { method: string; websiteUrl?: string }) => {
    if (data.method === "url" && data.websiteUrl) {
      setImportedUrl(data.websiteUrl)
    }
  }

  const handleAddBlock = () => {
    const newBlock: TestBlock = {
      id: `block-${Date.now()}`,
      label: `Q${blocks.length + 1}`,
      type: "task",
      question: "",
    }
    setBlocks([...blocks, newBlock])
  }

  const handleUpdateBlock = (id: string, updates: Partial<TestBlock>) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, ...updates } : block)))
  }

  const handleDeleteBlock = (id: string) => {
    const newBlocks = blocks.filter((block) => block.id !== id)
    // Update labels after deletion
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      label: `Q${index + 1}`,
    }))
    setBlocks(updatedBlocks)
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
        onPublish={() => setModalOpen(true)}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Main content area with canvas and sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas - takes remaining space */}
        <div className="flex-1 overflow-auto">
          <Canvas
            websiteUrl={importedUrl}
            onClear={() => setImportedUrl(undefined)}
          />
        </div>

        {/* Sidebar - anchored to right */}
        <TestBlocksSidebar
          testTitle={testTitle}
          onTestTitleChange={setTestTitle}
          blocks={blocks}
          onAddBlock={handleAddBlock}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          credits={50}
        />
      </div>

      <UploadDesignModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
