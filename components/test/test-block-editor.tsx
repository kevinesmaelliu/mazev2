"use client"

import { Sparkles, Trash2, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export interface TestBlock {
  id: string
  type: "first-click" | "task" | "preference"
  content: string
}

interface TestBlockEditorProps {
  block: TestBlock
  blockNumber: number
  onChange: (block: TestBlock) => void
  onDelete: () => void
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
}: TestBlockEditorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)

  const blockTypes: Array<TestBlock["type"]> = ["first-click", "task", "preference"]

  const typeLabel: Record<TestBlock["type"], string> = {
    "first-click": "First Click",
    task: "Task",
    preference: "Preference",
  }

  return (
    <div className="bg-card rounded-lg border border-border p-3 space-y-2">
      {/* Block Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs font-semibold text-muted-foreground">
            Q{blockNumber}
          </span>
          <div className="relative">
            <button
              onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
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

            {/* Type dropdown menu */}
            {isTypeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded shadow-lg z-10 min-w-max">
                {blockTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      onChange({ ...block, type })
                      setIsTypeMenuOpen(false)
                    }}
                    className={cn(
                      "block w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors",
                      block.type === type && "bg-muted font-semibold"
                    )}
                    type="button"
                  >
                    {typeLabel[type]}
                  </button>
                ))}
              </div>
            )}
          </div>
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
