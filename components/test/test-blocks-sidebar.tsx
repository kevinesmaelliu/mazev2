"use client"

import { useState } from "react"
import { Plus, Wand2, Trash2, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TestBlock {
  id: string
  label: string
  type: "first-click" | "task" | "preference"
  question: string
}

interface TestBlocksSidebarProps {
  testTitle?: string
  onTestTitleChange?: (title: string) => void
  blocks?: TestBlock[]
  onAddBlock?: () => void
  onUpdateBlock?: (id: string, block: Partial<TestBlock>) => void
  onDeleteBlock?: (id: string) => void
  credits?: number
}

export function TestBlocksSidebar({
  testTitle = "",
  onTestTitleChange,
  blocks = [],
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  credits = 0,
}: TestBlocksSidebarProps) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

  const handleAddBlock = () => {
    onAddBlock?.()
  }

  return (
    <div className="w-96 flex flex-col h-full bg-background border-l border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Test</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your design feedback test
            </p>
          </div>
          <div className="bg-card px-3 py-1 rounded-lg border border-border">
            <span className="text-sm text-muted-foreground">
              {credits}
            </span>
            <span className="text-sm text-foreground ml-1">credits</span>
          </div>
        </div>

        {/* Test Title Input */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Test Title
          </label>
          <Input
            placeholder="e.g., Homepage Navigation Test"
            value={testTitle}
            onChange={(e) => onTestTitleChange?.(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Blocks Section */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Blocks</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddBlock}
            className="gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            Add Block
          </Button>
        </div>

        <div className="space-y-3">
          {blocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No blocks yet. Add one to get started.
              </p>
            </div>
          ) : (
            blocks.map((block) => (
              <TestBlock
                key={block.id}
                block={block}
                isActive={activeBlockId === block.id}
                focusedInput={focusedInput}
                onSelect={() => setActiveBlockId(block.id)}
                onQuestionChange={(question) => {
                  onUpdateBlock?.(block.id, { question })
                }}
                onDelete={() => {
                  onDeleteBlock?.(block.id)
                  if (activeBlockId === block.id) {
                    setActiveBlockId(null)
                  }
                }}
                onInputFocus={() => setFocusedInput(block.id)}
                onInputBlur={() => setFocusedInput(null)}
              />
            ))
          )}
        </div>
      </div>

      {/* Auto-generate Section */}
      <div className="border-t border-border p-6">
        <div className="flex items-start gap-3 bg-card p-4 rounded-lg border border-border">
          <Wand2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Auto-generate blocks
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add a walkthrough recording and we&apos;ll create relevant questions for
              you automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TestBlockProps {
  block: TestBlock
  isActive: boolean
  focusedInput: string | null
  onSelect: () => void
  onQuestionChange: (question: string) => void
  onDelete: () => void
  onInputFocus: () => void
  onInputBlur: () => void
}

function TestBlock({
  block,
  isActive,
  focusedInput,
  onSelect,
  onQuestionChange,
  onDelete,
  onInputFocus,
  onInputBlur,
}: TestBlockProps) {
  const showAI = focusedInput === block.id

  return (
    <div
      onClick={onSelect}
      className={cn(
        "bg-card rounded-lg border transition-all cursor-pointer",
        isActive ? "border-primary" : "border-border"
      )}
    >
      {/* Block Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {block.label}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Type selector will go here
            }}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Change block type"
          >
            <Wand2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Settings will go here
            }}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Block settings"
            type="button"
          >
            <Settings2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 hover:bg-destructive/10 rounded transition-colors"
            title="Delete block"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Block Content */}
      <div className="p-4 relative">
        <textarea
          value={block.question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onClick={(e) => e.stopPropagation()}
          placeholder="Write your question here..."
          className={cn(
            "w-full bg-muted text-foreground placeholder-muted-foreground rounded px-3 py-2 text-sm",
            "border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "resize-none min-h-24 transition-colors",
            showAI && "pr-10"
          )}
        />

        {/* AI Icon - appears when input is focused */}
        {showAI && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              // AI help will be triggered here
            }}
            className="absolute right-3 top-3 p-2 rounded hover:bg-primary/10 transition-colors"
            title="Get AI help writing this question"
            type="button"
            aria-label="AI question assistant"
          >
            <svg
              className="h-4 w-4 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
