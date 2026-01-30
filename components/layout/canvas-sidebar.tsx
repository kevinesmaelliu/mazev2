"use client"

import { Sparkles, MessageSquare, ClipboardList } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestBlockEditor, TestBlock } from "@/components/test/test-block-editor"
import { BlockAddButton } from "@/components/test/block-add-button"

interface CanvasSidebarProps {
  testTitle?: string
  onTestTitleChange?: (title: string) => void
  blocks?: TestBlock[]
  onAddBlock?: () => void
  onUpdateBlock?: (id: string, block: TestBlock) => void
  onDeleteBlock?: (id: string) => void
  onAddBlockAtIndex?: (index: number) => void
  credits?: number
}

/**
 * CanvasSidebar - Right sidebar for test configuration
 * Provides tabs for test setup and annotations
 * Allows users to configure test title, blocks, and view annotations
 */
export function CanvasSidebar({
  testTitle = "",
  onTestTitleChange,
  blocks = [],
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlockAtIndex,
  credits = 0,
}: CanvasSidebarProps) {
  const handleAddBlockAtIndex = (index: number) => {
    onAddBlockAtIndex?.(index)
  }

  const handleUpdateBlock = (id: string, updatedBlock: TestBlock) => {
    onUpdateBlock?.(id, updatedBlock)
  }

  const handleDeleteBlock = (id: string) => {
    onDeleteBlock?.(id)
  }

  return (
    <aside className="w-96 border-l border-border bg-sidebar flex flex-col">
      <Tabs defaultValue="test" className="flex-1 flex flex-col">
        {/* Tabs Header */}
        <div className="px-4 py-3 border-b border-border">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test" className="text-xs gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              Test Setup
            </TabsTrigger>
            <TabsTrigger value="annotations" className="text-xs gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Annotations
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Test Setup Tab */}
        <TabsContent value="test" className="flex-1 m-0">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between mb-0.5">
              <h2 className="font-semibold text-sm">Create Test</h2>
              <Badge variant="secondary" className="text-xs">
                {credits} credits
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure your design feedback test
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Test Title Input */}
              <div className="space-y-1.5 pb-4 border-b border-border">
                <Label htmlFor="test-title" className="text-xs font-semibold">
                  Test Title
                </Label>
                <Input
                  id="test-title"
                  placeholder="e.g., Homepage Navigation Test"
                  value={testTitle}
                  onChange={(e) => onTestTitleChange?.(e.target.value)}
                  className="bg-background h-9"
                />
              </div>

              {/* Blocks Section */}
              <div className="space-y-2 pb-4 border-b border-border">
                <Label className="text-xs font-semibold">Blocks</Label>

                <div className="space-y-0">
                  {blocks.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground">
                        No blocks yet. Add one to get started.
                      </p>
                    </div>
                  ) : (
                    <>
                      <BlockAddButton onAdd={() => handleAddBlockAtIndex(0)} />
                      {blocks.map((block, index) => (
                        <div key={block.id} className="space-y-2">
                          <TestBlockEditor
                            block={block}
                            onChange={(updatedBlock) =>
                              handleUpdateBlock(block.id, updatedBlock)
                            }
                            onDelete={() => handleDeleteBlock(block.id)}
                            blockNumber={index + 1}
                          />
                          <BlockAddButton
                            onAdd={() => handleAddBlockAtIndex(index + 1)}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Auto-generate Section */}
              <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-1.5">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      Auto-generate blocks
                    </p>
                    <p>
                      Add a walkthrough recording and we&apos;ll create relevant
                      questions for you automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Annotations Tab */}
        <TabsContent value="annotations" className="flex-1 m-0">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-semibold text-sm">Annotations</h2>
            <p className="text-xs text-muted-foreground">
              View and manage your highlights
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              <p className="text-xs text-muted-foreground text-center py-8">
                No annotations yet
              </p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
