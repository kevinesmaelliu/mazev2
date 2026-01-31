"use client"

import { useState, useRef, useLayoutEffect, useCallback, useEffect } from "react"
import { gsap } from "gsap"
import { TestBlockEditor, TestBlock } from "./test-block-editor"
import { BlockAddButton } from "./block-add-button"

interface DraggableBlocksListProps {
  blocks: TestBlock[]
  onUpdateBlock: (id: string, block: TestBlock) => void
  onDeleteBlock: (id: string) => void
  onAddBlockAtIndex: (index: number, type?: TestBlock["type"]) => void
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void
  onBrowseAllBlocks: () => void
  onAddBlockAtIndexWithType: (index: number, type: TestBlock["type"]) => void
}

type SlotItem =
  | { type: "placeholder" }
  | { type: "block"; block: TestBlock; originalIndex: number }

function getDisplaySlots(
  blocks: TestBlock[],
  dragIndex: number | null,
  dragOverIndex: number | null
): SlotItem[] {
  if (dragIndex === null || dragOverIndex === null) {
    return blocks.map((block, i) => ({ type: "block" as const, block, originalIndex: i }))
  }
  const nonDragged = blocks.filter((_, i) => i !== dragIndex)
  const slots: SlotItem[] = []
  for (let i = 0; i < blocks.length; i++) {
    if (i === dragOverIndex) {
      slots.push({ type: "placeholder" })
    } else {
      const idx = i < dragOverIndex ? i : i - 1
      const block = nonDragged[idx]!
      const originalIndex = idx < dragIndex ? idx : idx + 1
      slots.push({ type: "block", block, originalIndex })
    }
  }
  return slots
}

const BLOCK_PLACEHOLDER_HEIGHT = 120

export function DraggableBlocksList({
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlockAtIndex,
  onMoveBlock,
  onBrowseAllBlocks,
  onAddBlockAtIndexWithType,
}: DraggableBlocksListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const slotRefsMap = useRef<Map<string, HTMLDivElement>>(new Map())
  const lastOldRects = useRef<Map<string, DOMRect>>(new Map())
  const cloneRef = useRef<HTMLElement | null>(null)

  const displaySlots = getDisplaySlots(blocks, dragIndex, dragOverIndex)
  const isDragging = dragIndex !== null

  const setSlotRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) slotRefsMap.current.set(key, el)
    else slotRefsMap.current.delete(key)
  }, [])

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
    setDragOverIndex(index)
  }, [])

  const handleDragOverSlot = useCallback(
    (slotIndex: number) => {
      if (!isDragging || slotIndex === dragOverIndex) return
      const map = slotRefsMap.current
      const oldRects = new Map<string, DOMRect>()
      map.forEach((el, key) => {
        const rect = el.getBoundingClientRect()
        oldRects.set(key, rect)
      })
      lastOldRects.current = oldRects
      setDragOverIndex(slotIndex)
    },
    [isDragging, dragOverIndex]
  )

  const displayKeys = displaySlots.map((s) => (s.type === "block" ? s.block.id : "placeholder")).join(",")
  useLayoutEffect(() => {
    if (!isDragging || lastOldRects.current.size === 0) return
    const map = slotRefsMap.current
    const newRects = new Map<string, DOMRect>()
    map.forEach((el, key) => {
      newRects.set(key, el.getBoundingClientRect())
    })
    const oldRects = lastOldRects.current
    map.forEach((el, key) => {
      const oldRect = oldRects.get(key)
      const newRect = newRects.get(key)
      if (!oldRect || !newRect) return
      const deltaY = oldRect.top - newRect.top
      if (Math.abs(deltaY) < 1) return
      gsap.set(el, { y: deltaY })
      gsap.to(el, {
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => gsap.set(el, { clearProps: "y" }),
      })
    })
    lastOldRects.current = new Map()
  }, [isDragging, dragOverIndex, displayKeys])

  useEffect(() => {
    const onDragEnd = () => {
      cloneRef.current?.remove()
      cloneRef.current = null
      setDragIndex(null)
      setDragOverIndex(null)
    }
    document.addEventListener("dragend", onDragEnd)
    return () => document.removeEventListener("dragend", onDragEnd)
  }, [])

  const handleDropAtSlot = useCallback(
    (slotIndex: number) => {
      if (dragIndex === null) return
      onMoveBlock(dragIndex, slotIndex)
      setDragIndex(null)
      setDragOverIndex(null)
    },
    [dragIndex, onMoveBlock]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (dragIndex === null || dragOverIndex === null) return
      onMoveBlock(dragIndex, dragOverIndex)
      setDragIndex(null)
      setDragOverIndex(null)
    },
    [dragIndex, dragOverIndex, onMoveBlock]
  )

  const handleDragOverContainer = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  if (blocks.length === 0) return null

  return (
    <>
      <BlockAddButton
        onAdd={() => onAddBlockAtIndex(0)}
        onAddShortQuestion={() => onAddBlockAtIndexWithType(0, "short-question")}
        onAddVibeCheck={() => onAddBlockAtIndexWithType(0, "vibe-check")}
        onAddMultipleChoice={() => onAddBlockAtIndexWithType(0, "multiple-choice")}
        onBrowseAllBlocks={onBrowseAllBlocks}
      />
      <div
        className="space-y-0"
        onDrop={handleDrop}
        onDragOver={handleDragOverContainer}
      >
        {displaySlots.map((slot, slotIndex) => {
          if (slot.type === "placeholder") {
            return (
              <div
                key="placeholder"
                ref={(el) => setSlotRef("placeholder", el)}
                className="rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center text-xs text-muted-foreground transition-colors"
                style={{ minHeight: BLOCK_PLACEHOLDER_HEIGHT }}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDragOverSlot(slotIndex)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDropAtSlot(slotIndex)
                }}
              >
                Drop here
              </div>
            )
          }
          const { block, originalIndex } = slot
          const blockNumber = originalIndex + 1
          return (
            <div
              key={block.id}
              ref={(el) => setSlotRef(block.id, el)}
              className="space-y-2"
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDragOverSlot(slotIndex)
              }}
            >
              <TestBlockEditor
                block={block}
                index={originalIndex}
                blockNumber={blockNumber}
                slotIndex={slotIndex}
                onChange={(updatedBlock) => onUpdateBlock(block.id, updatedBlock)}
                onDelete={() => onDeleteBlock(block.id)}
                onBrowseBlocks={onBrowseAllBlocks}
                moveBlock={(fromIndex, toIndex) => onMoveBlock(fromIndex, toIndex)}
                onDragStart={handleDragStart}
                onDragOverSlot={handleDragOverSlot}
                onDropAtSlot={handleDropAtSlot}
                cloneRef={cloneRef}
                isDragging={isDragging}
              />
              <BlockAddButton
                onAdd={() => onAddBlockAtIndex(slotIndex + 1)}
                onAddShortQuestion={() => onAddBlockAtIndexWithType(slotIndex + 1, "short-question")}
                onAddVibeCheck={() => onAddBlockAtIndexWithType(slotIndex + 1, "vibe-check")}
                onAddMultipleChoice={() => onAddBlockAtIndexWithType(slotIndex + 1, "multiple-choice")}
                onBrowseAllBlocks={onBrowseAllBlocks}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}
