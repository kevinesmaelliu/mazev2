"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PreviewNavigationProps {
  isFirstBlock: boolean
  isLastBlock: boolean
  onBack: () => void
  onNext: () => void
}

export function PreviewNavigation({
  isFirstBlock,
  isLastBlock,
  onBack,
  onNext,
}: PreviewNavigationProps) {
  return (
    <div className="border-t border-border bg-card p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isFirstBlock}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={isLastBlock}
          className="gap-2"
        >
          {isLastBlock ? "Finish" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
