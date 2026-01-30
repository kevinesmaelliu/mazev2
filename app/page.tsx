"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CanvasHeader } from "@/components/layout/canvas-header"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [importedUrl, setImportedUrl] = useState<string | undefined>()
  const [activePageId, setActivePageId] = useState("canvas-1")

  const canvasPages = [
    { id: "canvas-1", name: "Canvas" },
    { id: "canvas-2", name: "Feedback" },
  ]

  const handleUploadComplete = (data: { method: string; websiteUrl?: string }) => {
    if (data.method === "url" && data.websiteUrl) {
      setImportedUrl(data.websiteUrl)
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
        onPublish={() => setModalOpen(true)}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Canvas */}
      <Canvas
        websiteUrl={importedUrl}
        onClear={() => setImportedUrl(undefined)}
      />

      <UploadDesignModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
