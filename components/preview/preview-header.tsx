"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PreviewHeaderProps {
  testTitle: string
  currentBlockIndex: number
  totalBlocks: number
}

export function PreviewHeader({
  testTitle,
  currentBlockIndex,
  totalBlocks,
}: PreviewHeaderProps) {
  return (
    <div className="border-b border-border bg-card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="text-xs font-medium">
              Preview Mode
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
            {testTitle || "Untitled Test"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Question {currentBlockIndex + 1} of {totalBlocks}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.close()}
          className="h-8 w-8 p-0"
          title="Close preview"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
