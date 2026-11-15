"use client"

import { useState } from "react"
import { TestBlock } from "@/components/test/test-block-editor"
import { Annotation } from "@/types/annotation"
import { PreviewHeader } from "./preview-header"
import { CanvasPreviewPanel } from "./canvas-preview-panel"
import { ReviewerChecklist } from "./reviewer-checklist"

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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <PreviewHeader
        testTitle={testData.title}
        currentBlockIndex={currentBlockIndex}
        totalBlocks={testData.blocks.length}
      />

      {/* Main content - Two column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Canvas Preview */}
        <div className="flex-1 overflow-auto border-r border-border">
          <CanvasPreviewPanel
            canvasPages={testData.canvasPages}
            canvasStateMap={testData.canvasStateMap}
          />
        </div>

        {/* Right: Reviewer Checklist */}
        <div className="w-80 overflow-hidden flex flex-col bg-card border-l border-border">
          <ReviewerChecklist
            blocks={testData.blocks}
            currentBlockIndex={currentBlockIndex}
            block={currentBlock}
            isFirstBlock={isFirstBlock}
            isLastBlock={isLastBlock}
            onBack={handleBack}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  )
}
