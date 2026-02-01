"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Search, Plus, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type TestType =
  | "short-question"
  | "vibe-check"
  | "multiple-choice"
  | "first-click"
  | "task"
  | "preference"
  | "semantic-differential"
  | "matrix"
  | "rating-scale"

export interface BlockTemplate {
  id: string
  type: TestType
  category: string
  title: string
  description: string
  content: string
  scaleLeftLabel?: string
  scaleRightLabel?: string
  featured?: boolean
}

interface BlockBrowserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectBlock: (template: BlockTemplate) => void
  onSelectBlocks?: (templates: BlockTemplate[]) => void
  singleSelectMode?: boolean
}

// Icon mapping for test types
export function getTestTypeIcon(type: TestType) {
  const iconMap: Record<TestType, React.ComponentType<{ className?: string }>> = {
    "short-question": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
    ),
    "vibe-check": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c2.49 0 4.5 2.01 4.5 4.5S14.49 16.5 12 16.5s-4.5-2.01-4.5-4.5 2.01-4.5 4.5-4.5zm0 7c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z" />
      </svg>
    ),
    "multiple-choice": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2V7h2v10zm4 0h-2v-3h2v3z" />
      </svg>
    ),
    "first-click": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    ),
    "task": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    "preference": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    "semantic-differential": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v20h-2zm4-2h2v24h-2zm4 4h2v20h-2zm4 2h2v16h-2z" />
      </svg>
    ),
    "matrix": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 10.02h5V21h-5z M16.01 10.02h5V21h-5zM10 0h5v8.99h-5z M16.01 0h5v8.99h-5zM0 10.02h5V21H0z M0 0h5v8.99H0z" />
      </svg>
    ),
    "rating-scale": ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  }

  const Icon = iconMap[type] || iconMap["short-question"]
  return Icon
}

// Comprehensive block templates
const BLOCK_TEMPLATES: BlockTemplate[] = [
  // Short Questions
  {
    id: "short-1",
    type: "short-question",
    category: "Questions",
    title: "Open-ended feedback",
    description: "Gather qualitative insights from users",
    content: "What are your initial thoughts about this design?",
  },
  {
    id: "short-2",
    type: "short-question",
    category: "Questions",
    title: "Improvement suggestions",
    description: "Ask users what could be better",
    content: "What would you improve about this interface?",
  },
  {
    id: "short-3",
    type: "short-question",
    category: "Questions",
    title: "Pain points",
    description: "Identify frustrations and blockers",
    content: "What frustrates you most about this experience?",
  },

  // Vibe Check (Likert Scale)
  {
    id: "vibe-1",
    type: "vibe-check",
    category: "Vibe Check",
    title: "Visual appeal",
    description: "Rate aesthetic quality",
    content: "How would you rate the visual appeal of this design?",
    scaleLeftLabel: "Not appealing",
    scaleRightLabel: "Very appealing",
    featured: true,
  },
  {
    id: "vibe-2",
    type: "vibe-check",
    category: "Vibe Check",
    title: "User-friendliness",
    description: "Measure ease of use",
    content: "How user-friendly is this interface?",
    scaleLeftLabel: "Very difficult",
    scaleRightLabel: "Very easy",
  },
  {
    id: "vibe-3",
    type: "vibe-check",
    category: "Vibe Check",
    title: "Trust & credibility",
    description: "Assess brand perception",
    content: "How trustworthy does this design feel?",
    scaleLeftLabel: "Not trustworthy",
    scaleRightLabel: "Very trustworthy",
    featured: true,
  },
  {
    id: "vibe-4",
    type: "vibe-check",
    category: "Vibe Check",
    title: "NPS Score",
    description: "Net Promoter Score question",
    content: "How likely are you to recommend this product to a friend?",
    scaleLeftLabel: "Not likely",
    scaleRightLabel: "Very likely",
  },

  // Multiple Choice
  {
    id: "mc-1",
    type: "multiple-choice",
    category: "Multiple Choice",
    title: "Preference selection",
    description: "Choose between options",
    content: "Which design element stands out most to you?",
  },
  {
    id: "mc-2",
    type: "multiple-choice",
    category: "Multiple Choice",
    title: "Use case",
    description: "Understand user context",
    content: "How would you primarily use this product?",
  },
  {
    id: "mc-3",
    type: "multiple-choice",
    category: "Multiple Choice",
    title: "Industry segment",
    description: "Segment your audience",
    content: "Which industry do you work in?",
  },

  // First Click Tests
  {
    id: "fc-1",
    type: "first-click",
    category: "Interactive",
    title: "Navigation first click",
    description: "Test primary navigation",
    content: "Where would you click to find pricing information?",
    featured: true,
  },
  {
    id: "fc-2",
    type: "first-click",
    category: "Interactive",
    title: "CTA discovery",
    description: "Test call-to-action visibility",
    content: "Where would you click to create a new account?",
  },
  {
    id: "fc-3",
    type: "first-click",
    category: "Interactive",
    title: "Support access",
    description: "Test help/support discoverability",
    content: "If you needed help, where would you click first?",
  },

  // Task-based Tests
  {
    id: "task-1",
    type: "task",
    category: "Interactive",
    title: "Checkout flow",
    description: "Complete purchase process",
    content: "Find a product and complete the checkout process",
  },
  {
    id: "task-2",
    type: "task",
    category: "Interactive",
    title: "Settings navigation",
    description: "Navigate to specific settings",
    content: "Navigate to your profile settings and change your notification preferences",
  },
  {
    id: "task-3",
    type: "task",
    category: "Interactive",
    title: "Search & filter",
    description: "Test search functionality",
    content: "Search for a specific item and filter by price",
  },

  // Preference Tests
  {
    id: "pref-1",
    type: "preference",
    category: "Comparison",
    title: "Layout preference",
    description: "Compare different layouts",
    content: "Which homepage layout do you prefer and why?",
  },
  {
    id: "pref-2",
    type: "preference",
    category: "Comparison",
    title: "Color scheme",
    description: "Choose between color options",
    content: "Which color scheme better represents the brand?",
  },
  {
    id: "pref-3",
    type: "preference",
    category: "Comparison",
    title: "Feature prioritization",
    description: "Rank features by importance",
    content: "Which feature would be most valuable to you?",
  },

  // Semantic Differential
  {
    id: "sem-1",
    type: "semantic-differential",
    category: "Advanced",
    title: "Brand perception",
    description: "Measure brand attributes",
    content: "Rate this brand on the following attributes",
  },

  // Matrix Questions
  {
    id: "matrix-1",
    type: "matrix",
    category: "Advanced",
    title: "Feature satisfaction",
    description: "Rate multiple features at once",
    content: "Rate your satisfaction with the following features",
  },

  // Rating Scale
  {
    id: "rating-1",
    type: "rating-scale",
    category: "Questions",
    title: "Star rating",
    description: "5-star rating question",
    content: "How would you rate your overall experience?",
  },
]

const CATEGORIES = [
  {
    id: "recommended",
    name: "Recommended",
    count: BLOCK_TEMPLATES.filter((b) => b.featured).length,
  },
  {
    id: "Questions",
    name: "Questions",
    count: BLOCK_TEMPLATES.filter((b) => b.category === "Questions").length,
  },
  {
    id: "Vibe Check",
    name: "Vibe Check",
    count: BLOCK_TEMPLATES.filter((b) => b.category === "Vibe Check").length,
  },
  {
    id: "Multiple Choice",
    name: "Multiple Choice",
    count: BLOCK_TEMPLATES.filter((b) => b.category === "Multiple Choice")
      .length,
  },
  {
    id: "Interactive",
    name: "Interactive",
    count: BLOCK_TEMPLATES.filter((b) => b.category === "Interactive").length,
  },
  {
    id: "Comparison",
    name: "Comparison",
    count: BLOCK_TEMPLATES.filter((b) => b.category === "Comparison").length,
  },
  {
    id: "Advanced",
    name: "Advanced",
    count: BLOCK_TEMPLATES.filter((b) => b.category === "Advanced").length,
  },
]

/**
 * BlockBrowserModal - Comprehensive test block browser
 * Coda-inspired clean design with sidebar navigation
 */
export function BlockBrowserModal({
  open,
  onOpenChange,
  onSelectBlock,
  onSelectBlocks,
  singleSelectMode,
}: BlockBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("recommended")
  const [selectedBlocks, setSelectedBlocks] = useState<BlockTemplate[]>([])

  // Filter blocks
  const filteredBlocks = BLOCK_TEMPLATES.filter((block) => {
    const matchesSearch =
      block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      (selectedCategory === "recommended" && block.featured) ||
      block.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleToggleBlock = (template: BlockTemplate) => {
    if (singleSelectMode) {
      // In single select mode, immediately select and close
      onSelectBlock(template)
      onOpenChange(false)
      setSearchQuery("")
      setSelectedCategory("recommended")
    } else {
      // Multi-select mode
      setSelectedBlocks((prev) => {
        const isSelected = prev.some((b) => b.id === template.id)
        if (isSelected) {
          return prev.filter((b) => b.id !== template.id)
        } else {
          return [...prev, template]
        }
      })
    }
  }

  const handleRemoveBlock = (blockId: string) => {
    setSelectedBlocks((prev) => prev.filter((b) => b.id !== blockId))
  }

  const handleAddBlocks = () => {
    selectedBlocks.forEach((block) => {
      onSelectBlock(block)
    })
    if (onSelectBlocks) {
      onSelectBlocks(selectedBlocks)
    }
    setSelectedBlocks([])
    onOpenChange(false)
    setSearchQuery("")
    setSelectedCategory("recommended")
  }

  const isBlockSelected = (blockId: string) => {
    return selectedBlocks.some((b) => b.id === blockId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-18rem)] h-[96vh] max-w-[calc(100vw-18rem)] p-0 gap-0 bg-background sm:max-w-[calc(100vw-18rem)] left-[3vw]">
        {/* Accessible title and description for screen readers */}
        <DialogTitle className="sr-only">Test Blocks</DialogTitle>
        <DialogDescription className="sr-only">
          Choose from pre-built templates to gather feedback and insights from users
        </DialogDescription>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Main horizontal flex container for sidebar and content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Coda style */}
            <aside className="w-64 border-r border-border bg-card flex flex-col">
              <div className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>

                {/* Start blank block button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-9 font-normal"
                  onClick={() => {
                    // Create a blank block (can be customized)
                    onSelectBlock({
                      id: `blank-${Date.now()}`,
                      type: "short-question",
                      category: "Questions",
                      title: "Custom Block",
                      description: "Create your own question",
                      content: "",
                    })
                    onOpenChange(false)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Start blank block
                </Button>
              </div>

              <div className="px-4 pt-2 pb-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Templates
                </div>
              </div>

              <ScrollArea className="flex-1 px-2">
                <div className="space-y-0.5 pb-4">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                        selectedCategory === category.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50 text-foreground"
                      )}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-8 pt-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-2xl font-bold">Test Blocks</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose from pre-built templates to gather feedback and insights from users
                  </p>
                </div>
              </div>

              {/* Content grid */}
              <ScrollArea className="flex-1">
                <div className="p-8">
                  {filteredBlocks.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center space-y-2">
                        <p className="text-muted-foreground">
                          No blocks found matching your search
                        </p>
                        <Button
                          variant="link"
                          onClick={() => setSearchQuery("")}
                          className="text-sm"
                        >
                          Clear search
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-5">
                      {filteredBlocks.map((block) => {
                        const Icon = getTestTypeIcon(block.type)
                        const selected = isBlockSelected(block.id)
                        return (
                          <button
                            key={block.id}
                            onClick={() => handleToggleBlock(block)}
                            className={cn(
                              "group relative rounded-xl border bg-card p-0 transition-all text-left overflow-hidden",
                              "hover:shadow-lg hover:border-primary/30",
                              selected
                                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                                : "border-border"
                            )}
                          >
                            {/* Preview/Icon area */}
                            <div
                              className={cn(
                                "relative h-32 flex items-center justify-center transition-colors",
                                selected ? "bg-primary/10" : "bg-muted/30"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex items-center justify-center w-16 h-16 rounded-xl transition-all",
                                  selected
                                    ? "bg-primary/20 text-primary scale-110"
                                    : "bg-background text-muted-foreground"
                                )}
                              >
                                <Icon className="h-8 w-8" />
                              </div>

                              {/* Selection indicator */}
                              {selected && (
                                <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}

                              {/* Hover indicator for non-selected cards */}
                              {!selected && !singleSelectMode && (
                                <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Plus className="h-4 w-4" />
                                </div>
                              )}

                              {/* Featured badge */}
                              {block.featured && !selected && (
                                <Badge
                                  variant="secondary"
                                  className="absolute top-3 right-3 text-xs group-hover:opacity-0 transition-opacity"
                                >
                                  Featured
                                </Badge>
                              )}
                            </div>

                            {/* Content area */}
                            <div className="p-4 space-y-2">
                              <h3
                                className={cn(
                                  "font-semibold text-sm",
                                  selected && "text-primary"
                                )}
                              >
                                {block.title}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {block.description}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Bottom action bar - always visible, spans full width */}
          {!singleSelectMode && (
            <div className="border-t border-border bg-card/50 backdrop-blur-sm px-8 py-4 flex items-center justify-between gap-4">
              {selectedBlocks.length === 0 ? (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-muted-foreground">
                      Select blocks from the templates above to add them to your test
                    </span>
                  </div>
                  <Button onClick={() => onOpenChange(false)} variant="outline">
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <span className="text-sm font-medium whitespace-nowrap">
                      {selectedBlocks.length} block{selectedBlocks.length !== 1 ? "s" : ""} selected
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {selectedBlocks.slice(0, 3).map((block) => {
                        const Icon = getTestTypeIcon(block.type)
                        return (
                          <div
                            key={block.id}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs group/chip"
                          >
                            <Icon className="h-3 w-3" />
                            <span className="max-w-[120px] truncate">
                              {block.title}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveBlock(block.id)
                              }}
                              className="ml-0.5 hover:text-foreground transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )
                      })}
                      {selectedBlocks.length > 3 && (
                        <span className="text-xs text-muted-foreground px-2">
                          +{selectedBlocks.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBlocks([])}
                    >
                      Clear
                    </Button>
                    <Button onClick={handleAddBlocks}>
                      Add {selectedBlocks.length} Block{selectedBlocks.length !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
