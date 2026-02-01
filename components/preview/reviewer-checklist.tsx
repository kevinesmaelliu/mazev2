"use client"

import { useState } from "react"
import { TestBlock } from "@/components/test/test-block-editor"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, ChevronDown, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewerChecklistProps {
  blocks: TestBlock[]
  currentBlockIndex: number
  block: TestBlock
  isFirstBlock: boolean
  isLastBlock: boolean
  onBack: () => void
  onNext: () => void
}

export function ReviewerChecklist({
  blocks,
  currentBlockIndex,
  block,
  isFirstBlock,
  isLastBlock,
  onBack,
  onNext,
}: ReviewerChecklistProps) {
  const [feedback, setFeedback] = useState("")
  const completedBlocks = new Set<number>()

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground mb-2">Reviewer Checklist</h2>
        <div className="text-xs text-muted-foreground">
          Question {currentBlockIndex + 1} of {blocks.length}
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Current Question */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Current Question</h3>
            <div className="bg-background rounded-lg p-3 border border-border">
              <p className="text-sm text-foreground">
                {block.content || `Question ${currentBlockIndex + 1}`}
              </p>
              {block.description && (
                <p className="text-xs text-muted-foreground mt-2">{block.description}</p>
              )}
            </div>
          </div>

          {/* Block List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Questions</h3>
            <div className="space-y-2">
              {blocks.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => {
                    // In a real app, this would navigate
                  }}
                  className={cn(
                    "w-full text-left text-xs p-2 rounded-lg border transition-colors",
                    idx === currentBlockIndex
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary text-foreground"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {completedBlocks.has(idx) ? (
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="line-clamp-2">{b.content || `Question ${idx + 1}`}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Feedback</label>
            <Textarea
              placeholder="Add feedback for this question..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="text-xs min-h-20"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            disabled={isFirstBlock}
            className="flex-1 gap-1"
          >
            <ChevronUp className="h-4 w-4" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={onNext}
            disabled={isLastBlock}
            className="flex-1 gap-1"
          >
            {isLastBlock ? "Finish" : "Next"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          {currentBlockIndex + 1} / {blocks.length}
        </div>
      </div>
    </div>
  )
}
