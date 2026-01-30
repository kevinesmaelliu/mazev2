"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UploadDesignModal } from "@/components/upload-design-modal"

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Upload Design Modal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Click the button below to open the modal
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          size="lg"
          className="mt-4"
        >
          Open Upload Modal
        </Button>
      </div>

      <UploadDesignModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUploadComplete={(data) => {
          console.log("Upload data:", data)
        }}
      />
    </div>
  )
}
