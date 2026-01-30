"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UploadDesignModal } from "@/components/upload-design-modal"
import { Canvas } from "@/components/canvas"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const [importedUrl, setImportedUrl] = useState<string | undefined>()

  const handleUploadComplete = (data: { method: string; websiteUrl?: string }) => {
    if (data.method === "url" && data.websiteUrl) {
      setImportedUrl(data.websiteUrl)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Design Canvas</h1>
          <Button
            onClick={() => setModalOpen(true)}
            size="sm"
          >
            Open Upload Modal
          </Button>
        </div>
      </div>

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
