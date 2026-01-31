"use client"

import { useState } from "react"
import { Plus, MessageSquare, GaugeCircle, ListChecks, Library } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface BlockAddButtonProps {
  onAdd: () => void
  onAddShortQuestion?: () => void
  onAddVibeCheck?: () => void
  onAddMultipleChoice?: () => void
  onBrowseAllBlocks?: () => void
}

/**
 * BlockAddButton - Hover-activated button to add blocks between existing blocks
 * Includes a popover menu with quick access options and browse all blocks
 */
export function BlockAddButton({
  onAdd,
  onAddShortQuestion,
  onAddVibeCheck,
  onAddMultipleChoice,
  onBrowseAllBlocks,
}: BlockAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleQuickAddBlock = (callback?: () => void) => {
    callback?.()
    setIsOpen(false)
  }

  return (
    <div className="relative h-px group/add">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/add:opacity-100 transition-all duration-200 z-10">
        <div className="flex-1 h-px bg-primary/40 group-hover/add:bg-primary/60 transition-colors duration-200" />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center justify-center h-7 w-7 rounded-full bg-primary hover:bg-primary text-primary-foreground transition-all duration-200 mx-2 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 active:scale-95"
              type="button"
              aria-label="Add block here"
            >
              <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover/add:rotate-90" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="center" side="top">
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Quick Access
              </div>
              <button
                onClick={() => handleQuickAddBlock(onAddShortQuestion || onAdd)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted"
                type="button"
              >
                <MessageSquare className="h-4 w-4" />
                Short Question
              </button>
              <button
                onClick={() => handleQuickAddBlock(onAddVibeCheck || onAdd)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted"
                type="button"
              >
                <GaugeCircle className="h-4 w-4" />
                Vibe Check
              </button>
              <button
                onClick={() => handleQuickAddBlock(onAddMultipleChoice || onAdd)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted"
                type="button"
              >
                <ListChecks className="h-4 w-4" />
                Multiple Choice
              </button>

              <Separator className="my-2" />

              <button
                onClick={() => handleQuickAddBlock(onBrowseAllBlocks)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors hover:bg-muted"
                type="button"
              >
                <Library className="h-4 w-4" />
                Browse all blocks
              </button>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex-1 h-px bg-primary/40 group-hover/add:bg-primary/60 transition-colors duration-200" />
      </div>
    </div>
  )
}
