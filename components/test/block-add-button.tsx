"use client"

import { Plus } from "lucide-react"

interface BlockAddButtonProps {
  onAdd: () => void
}

/**
 * BlockAddButton - Hover-activated button to add blocks between existing blocks
 */
export function BlockAddButton({ onAdd }: BlockAddButtonProps) {
  return (
    <div className="relative h-px group/add">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover/add:opacity-100 transition-all duration-200 z-10">
        <div className="flex-1 h-px bg-primary/40 group-hover/add:bg-primary/60 transition-colors duration-200" />
        <button
          onClick={onAdd}
          className="flex items-center justify-center h-7 w-7 rounded-full bg-primary hover:bg-primary text-primary-foreground transition-all duration-200 mx-2 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 active:scale-95"
          type="button"
          aria-label="Add block here"
        >
          <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover/add:rotate-90" />
        </button>
        <div className="flex-1 h-px bg-primary/40 group-hover/add:bg-primary/60 transition-colors duration-200" />
      </div>
    </div>
  )
}
