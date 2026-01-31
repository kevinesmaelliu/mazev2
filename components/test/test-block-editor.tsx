/**
 * TestBlockEditor - Component for creating and editing test blocks
 * Used in test creation panel
 */

"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SlidersHorizontal,
  Trash2,
  MessageSquare,
  GaugeCircle,
  ListChecks,
  Library,
  GripVertical,
  Sparkles,
  MousePointerClick,
  CheckSquare,
  Heart,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface TestBlock {
  id: string
  type: "first-click" | "task" | "preference" | "short-question" | "vibe-check" | "multiple-choice" | "rating-scale" | "semantic-differential" | "matrix" | "likert"
  content: string
  description?: string
  scaleLeftLabel?: string
  scaleRightLabel?: string
  options?: string[]
}

function getTestTypeIcon(type: TestBlock["type"]): LucideIcon {
  const icons: Record<TestBlock["type"], LucideIcon> = {
    "first-click": MousePointerClick,
    task: CheckSquare,
    preference: Heart,
    "short-question": MessageSquare,
    "vibe-check": GaugeCircle,
    "multiple-choice": ListChecks,
    "rating-scale": GaugeCircle,
    "semantic-differential": SlidersHorizontal,
    matrix: LayoutGrid,
    likert: GaugeCircle,
  }
  return icons[type] ?? MessageSquare
}

interface TestBlockEditorProps {
  block: TestBlock
  index: number
  blockNumber: number
  onChange: (block: TestBlock) => void
  onDelete: () => void
  onBrowseBlocks?: () => void
  moveBlock: (dragIndex: number, hoverIndex: number) => void
}

export function TestBlockEditor({
  block,
  index,
  blockNumber,
  onChange,
  onDelete,
  onBrowseBlocks,
  moveBlock,
}: TestBlockEditorProps) {
  const [isFocused, setIsFocused] = useState(false)

  const getPlaceholder = () => {
    switch (block.type) {
      case "first-click":
        return "Where would you click to start a new project?"
      case "task":
        return "Find and click on the settings button"
      case "preference":
        return "Which design do you prefer and why?"
      case "vibe-check":
      case "likert":
        return "How would you rate the visual appeal of this design?"
      case "short-question":
        return "What are your initial thoughts about this design?"
      case "multiple-choice":
        return "Which feature is most important to you?"
      default:
        return "Enter your question here..."
    }
  }

  const quickAccessTypes = [
    { value: "short-question" as const, label: "Short Question", icon: MessageSquare },
    { value: "vibe-check" as const, label: "Vibe Check", icon: GaugeCircle },
    { value: "multiple-choice" as const, label: "Multiple Choice", icon: ListChecks },
  ]

  const handleAIGenerate = () => {
    const suggestions: Partial<Record<TestBlock["type"], string[]>> = {
      "first-click": [
        "Where would you click first to find product pricing information?",
        "If you wanted to contact support, where would you click?",
        "Where would you click to create a new account?",
      ],
      task: [
        "Find and complete the checkout process",
        "Navigate to the settings page and change your profile picture",
        "Search for a specific product and add it to your cart",
      ],
      preference: [
        "Which homepage layout do you prefer and why?",
        "Compare these two navigation designs. Which feels more intuitive?",
        "Which color scheme better represents the brand identity?",
      ],
      "vibe-check": [
        "How would you rate the visual appeal of this design?",
        "How user-friendly is this interface?",
        "How likely are you to recommend this product to a friend?",
      ],
      "short-question": [
        "What are your initial thoughts about this design?",
        "What would you improve about this interface?",
        "What frustrates you most about this experience?",
      ],
      "multiple-choice": [
        "Which feature is most important to you?",
        "How would you primarily use this product?",
        "Which design element stands out most?",
      ],
    }
    const typeSuggestions = suggestions[block.type] ?? suggestions["short-question"] ?? []
    const randomSuggestion = typeSuggestions[Math.floor(Math.random() * typeSuggestions.length)] ?? "Enter your question here..."
    onChange({ ...block, content: randomSuggestion })
    toast.success("AI generated question", {
      description: "Feel free to customize it further",
    })
  }

  const TypeIcon = getTestTypeIcon(block.type)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", String(index))
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10)
    if (Number.isNaN(dragIndex) || dragIndex === index) return
    moveBlock(dragIndex, index)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "rounded-lg bg-muted/30 border border-border/50 p-4 space-y-3",
        "cursor-grab active:cursor-grabbing"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing p-0.5 -ml-1 hover:bg-muted rounded transition-colors"
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/50" />
          </button>
          <span className="text-xs font-medium text-muted-foreground">
            Q{blockNumber}
          </span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TypeIcon className="h-3 w-3" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Change block type"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Quick Access
                </div>
                {quickAccessTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        onChange({ ...block, type: type.value })
                      }
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                        block.type === type.value
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </button>
                  )
                })}
                <Separator className="my-2" />
                {onBrowseBlocks && (
                  <button
                    type="button"
                    onClick={onBrowseBlocks}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted"
                  >
                    <Library className="h-4 w-4" />
                    Browse all blocks
                  </button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete block"
            className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Textarea
            placeholder={getPlaceholder()}
            value={block.content}
            onChange={(e) =>
              onChange({ ...block, content: e.target.value })
            }
            className="bg-transparent border border-input min-h-[36px] resize-none text-sm text-foreground placeholder:text-muted-foreground pr-10"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {isFocused && (
            <button
              type="button"
              onClick={handleAIGenerate}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-transparent hover:bg-primary/10 border border-border hover:border-primary/30 transition-all group"
              title="Generate with AI"
              aria-label="Generate with AI"
            >
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          )}
        </div>

        {/* Vibe Check (Likert Scale) Configuration */}
        {(block.type === "vibe-check" || block.type === "likert") && (
          <div className="space-y-2 pt-2 border-t border-border/30">
            <Label className="text-xs font-semibold text-muted-foreground">
              Scale Labels (1-7)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor={`scale-left-${block.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Left (1)
                </Label>
                <Input
                  id={`scale-left-${block.id}`}
                  placeholder="e.g., Not appealing"
                  value={block.scaleLeftLabel ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      scaleLeftLabel: e.target.value,
                    })
                  }
                  className="h-8 text-xs bg-transparent text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor={`scale-right-${block.id}`}
                  className="text-xs text-muted-foreground"
                >
                  Right (7)
                </Label>
                <Input
                  id={`scale-right-${block.id}`}
                  placeholder="e.g., Very appealing"
                  value={block.scaleRightLabel ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      scaleRightLabel: e.target.value,
                    })
                  }
                  className="h-8 text-xs bg-transparent text-foreground placeholder:text-muted-foreground border-input"
                />
              </div>
            </div>
            {/* Scale Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground">
                <span className="flex-1 text-left truncate">
                  {block.scaleLeftLabel ?? "Left"}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div
                      key={num}
                      className="w-6 h-6 rounded-full border border-border/50 flex items-center justify-center text-[9px] font-medium"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <span className="flex-1 text-right truncate">
                  {block.scaleRightLabel ?? "Right"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
