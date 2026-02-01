"use client"

import { useState } from "react"
import { TestBlock } from "@/components/test/test-block-editor"
import { Annotation } from "@/app/page"
import { PreviewHeader } from "./preview-header"
import { BlockRenderer } from "./block-renderer"
import { PreviewNavigation } from "./preview-navigation"

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
}

interface TestPreviewProps {
  testData: {
    title: string
    blocks: TestBlock[]
    canvasPages: CanvasPageData[]
    canvasStateMap: Record<string, CanvasState>
  }
}

export function TestPreview({ testData }: TestPreviewProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)

  if (!testData.blocks || testData.blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">No blocks in test</h1>
          <p className="text-muted-foreground">This test doesn&apos;t have any questions yet.</p>
        </div>
      </div>
    )
  }

  const currentBlock = testData.blocks[currentBlockIndex]
  const isFirstBlock = currentBlockIndex === 0
  const isLastBlock = currentBlockIndex === testData.blocks.length - 1

  const handleNext = () => {
    if (!isLastBlock) {
      setCurrentBlockIndex(currentBlockIndex + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstBlock) {
      setCurrentBlockIndex(currentBlockIndex - 1)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <PreviewHeader
        testTitle={testData.title}
        currentBlockIndex={currentBlockIndex}
        totalBlocks={testData.blocks.length}
      />

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            <BlockRenderer
              block={currentBlock}
              canvasPages={testData.canvasPages}
              canvasStateMap={testData.canvasStateMap}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <PreviewNavigation
        isFirstBlock={isFirstBlock}
        isLastBlock={isLastBlock}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  )
}
