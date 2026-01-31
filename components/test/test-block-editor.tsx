"use client"

import { Sparkles, Trash2, ChevronDown, MessageSquare, GaugeCircle, ListChecks, Library } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

export interface TestBlock {
  id: string
  type: "first-click" | "task" | "preference" | "short-question" | "vibe-check" | "multiple-choice" | "rating-scale" | "semantic-differential" | "matrix" | "likert"
  content: string
  description?: string
  scaleLeftLabel?: string
  scaleRightLabel?: string
  options?: string[]
}

interface TestBlockEditorProps {
  block: TestBlock
  blockNumber: number
  onChange: (block: TestBlock) => void
  onDelete: () => void
  onBrowseBlocks?: () => void
}

/**
 * TestBlockEditor - Component for editing individual test blocks
 * Allows users to change block type and edit question content
 * Shows AI assistant icon when focused
 */
export function TestBlockEditor({
  block,
  blockNumber,
  onChange,
  onDelete,
  onBrowseBlocks,
}: TestBlockEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isTypePopoverOpen, setIsTypePopoverOpen] = useState(false)

  // Quick access types shown in popover
  const quickAccessTypes = [
    { value: "short-question" as const, label: "Short Question", icon: MessageSquare },
    { value: "vibe-check" as const, label: "Vibe Check", icon: GaugeCircle },
    { value: "multiple-choice" as const, label: "Multiple Choice", icon: ListChecks },
  ]

  const typeLabel: Record<TestBlock["type"], string> = {
    "first-click": "First Click",
    task: "Task",
    preference: "Preference",
    "short-question": "Short Question",
    "vibe-check": "Vibe Check",
    "multiple-choice": "Multiple Choice",
    "rating-scale": "Rating Scale",
    "semantic-differential": "Semantic Differential",
    matrix: "Matrix",
    likert: "Likert Scale",
  }

  return (
    <div className="bg-card rounded-lg border border-border p-3 space-y-2">
      {/* Block Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-semibold text-muted-foreground">
            Q{blockNumber}
          </span>
          <Popover open={isTypePopoverOpen} onOpenChange={setIsTypePopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "px-2 py-1 text-xs rounded border transition-colors",
                  "bg-background border-border hover:bg-muted",
                  "flex items-center gap-1"
                )}
                type="button"
              >
                {typeLabel[block.type]}
                <ChevronDown className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Quick Access
                </div>
                {quickAccessTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      onChange({ ...block, type: type.value })
                      setIsTypePopoverOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                      block.type === type.value
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    type="button"
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </button>
                ))}

                <Separator className="my-2" />

                {onBrowseBlocks && (
                  <button
                    onClick={() => {
                      onBrowseBlocks()
                      setIsTypePopoverOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted"
                    type="button"
                  >
                    <Library className="h-4 w-4" />
                    Browse all blocks
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-destructive/10 transition-colors"
          type="button"
          aria-label="Delete block"
        >
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>

      {/* Block Content */}
      <div className="relative">
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Write your question here..."
          className={cn(
            "w-full bg-background text-foreground placeholder-muted-foreground rounded px-3 py-2 text-xs",
            "border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "resize-none min-h-20 transition-colors",
            isFocused && "pr-10"
          )}
        />

        {/* AI Assistant Icon - appears when focused */}
        {isFocused && (
          <button
            onClick={() => {
              // AI help will be triggered here in future implementation
            }}
            className="absolute right-2 bottom-2 p-1.5 rounded hover:bg-primary/10 transition-colors"
            type="button"
            title="Get AI help writing this question"
            aria-label="AI question assistant"
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </button>
        )}
      </div>
    </div>
  )
}
