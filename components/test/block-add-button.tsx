"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlockAddButtonProps {
  onAdd: () => void
}

/**
 * BlockAddButton - Small button for inserting a block at a specific position
 * Appears between blocks and at the top of the block list
 */
export function BlockAddButton({ onAdd }: BlockAddButtonProps) {
  return (
    <div className="py-1 px-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        className="h-6 w-full gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        type="button"
      >
        <Plus className="h-3 w-3" />
        Insert
      </Button>
    </div>
  )
}
