"use client"

import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { TestBlock } from "./test-block-editor"

interface AIBlocksGeneratorProps {
  onBlocksGenerate: (blocks: TestBlock[]) => void
}

/**
 * AIBlocksGenerator - Skeuomorphic button to generate test blocks with AI
 * Positioned at the top of the blocks section in the sidebar
 */
export function AIBlocksGenerator({ onBlocksGenerate }: AIBlocksGeneratorProps) {
  const handleGenerateBlocks = () => {
    // TODO: Integrate with actual AI API
    // For now, generate placeholder blocks
    const generatedBlocks: TestBlock[] = [
      {
        id: `block-${Date.now()}-1`,
        type: "first-click",
        content: "Where would you click first to complete the main task?",
      },
      {
        id: `block-${Date.now()}-2`,
        type: "task",
        content: "Complete the following task using the design",
      },
      {
        id: `block-${Date.now()}-3`,
        type: "preference",
        content: "What is your overall impression of this design?",
      },
    ]

    onBlocksGenerate(generatedBlocks)
  }

  return (
    <div className="py-2">
      <button
        onClick={handleGenerateBlocks}
        className={cn(
          "w-full relative group",
          "px-3 py-1.5 rounded-md",
          "transition-all duration-500 ease-out",
          "cursor-pointer",
          "hover:translate-y-[-2px]",
          "active:translate-y-0"
        )}
        style={{
          background: "linear-gradient(to bottom, rgba(220, 180, 140, 0.4), rgba(210, 170, 130, 0.3))",
          boxShadow: "inset 0pt 2pt 2pt -1pt rgba(255, 255, 255, 0.3), 0pt 3pt 4pt -2pt rgba(0, 0, 0, 0.2)",
          borderBottom: "2pt solid rgba(139, 109, 79, 0.5)",
          border: "1px solid rgba(160, 130, 100, 0.3)",
          borderBottomWidth: "2pt",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderBottom = "3pt solid rgba(139, 109, 79, 0.5)"
          e.currentTarget.style.boxShadow = "inset 0pt 2pt 2pt -1pt rgba(255, 255, 255, 0.3), 0pt 2pt 3pt -2pt rgba(0, 0, 0, 0.15)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderBottom = "2pt solid rgba(139, 109, 79, 0.5)"
          e.currentTarget.style.boxShadow = "inset 0pt 2pt 2pt -1pt rgba(255, 255, 255, 0.3), 0pt 3pt 4pt -2pt rgba(0, 0, 0, 0.2)"
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.boxShadow = "inset 0pt 2pt 2pt -1pt rgba(255, 255, 255, 0.3), 0pt 1pt 2pt -2pt rgba(0, 0, 0, 0.1)"
          e.currentTarget.style.borderBottom = "1pt solid rgba(139, 109, 79, 0.5)"
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.borderBottom = "3pt solid rgba(139, 109, 79, 0.5)"
          e.currentTarget.style.boxShadow = "inset 0pt 2pt 2pt -1pt rgba(255, 255, 255, 0.3), 0pt 2pt 3pt -2pt rgba(0, 0, 0, 0.15)"
        }}
        type="button"
        aria-label="Generate test blocks with AI"
      >
        <div className="flex items-center justify-center gap-1.5 relative z-10">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
          <span className="text-xs font-semibold text-foreground transition-colors duration-200 group-hover:text-foreground">
            Generate with AI
          </span>
        </div>
      </button>
    </div>
  )
}
