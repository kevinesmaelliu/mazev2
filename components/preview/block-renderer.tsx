"use client"

import { useState } from "react"
import { TestBlock } from "@/components/test/test-block-editor"
import { Annotation } from "@/app/page"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CanvasPageData {
  id: string
  name: string
  annotations: Annotation[]
}

interface CanvasState {
  mode: "drawing" | "url-preview"
  websiteUrl?: string
  figmaUrl?: string
  uploadedImages: string[]
  imageFiles: File[]
  showUploadModal: boolean
}

interface BlockRendererProps {
  block: TestBlock
  canvasPages: CanvasPageData[]
  canvasStateMap: Record<string, CanvasState>
}

export function BlockRenderer({
  block,
  canvasPages,
  canvasStateMap,
}: BlockRendererProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [checkedOptions, setCheckedOptions] = useState<Set<string>>(new Set())
  const [rating, setRating] = useState<number | null>(null)
  const [textInput, setTextInput] = useState("")

  if (block.type === "description") {
    return (
      <div className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <p className="text-lg text-foreground whitespace-pre-wrap">{block.content}</p>
        </div>
      </div>
    )
  }

  if (block.type === "first-click") {
    return (
      <div className="space-y-6">
        {block.content && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {block.content}
            </h2>
            {block.description && (
              <p className="text-muted-foreground">{block.description}</p>
            )}
          </div>
        )}

        {/* Canvas preview */}
        <CanvasPreview canvasPages={canvasPages} canvasStateMap={canvasStateMap} />

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Click the element or area that you would click first
          </p>
        </div>
      </div>
    )
  }

  if (block.type === "task") {
    return (
      <div className="space-y-6">
        {block.content && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {block.content}
            </h2>
            {block.description && (
              <p className="text-muted-foreground">{block.description}</p>
            )}
          </div>
        )}

        <CanvasPreview canvasPages={canvasPages} canvasStateMap={canvasStateMap} />

        <div className="space-y-3">
          <Label htmlFor="completion" className="text-base font-medium">
            Did you complete the task?
          </Label>
          <RadioGroup>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="completed" id="completed" />
              <Label htmlFor="completed" className="cursor-pointer font-normal">
                Yes, I completed it
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not-completed" id="not-completed" />
              <Label htmlFor="not-completed" className="cursor-pointer font-normal">
                No, I couldn&apos;t complete it
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    )
  }

  if (block.type === "preference") {
    return (
      <div className="space-y-6">
        {block.content && (
          <h2 className="text-2xl font-bold text-foreground">
            {block.content}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(block.options || []).map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(option)}
              className={cn(
                "p-4 rounded-lg border-2 transition-colors text-left",
                selectedOption === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              )}
            >
              <p className="font-medium">{option}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "multiple-choice") {
    return (
      <div className="space-y-6">
        {block.content && (
          <h2 className="text-2xl font-bold text-foreground">
            {block.content}
          </h2>
        )}

        <div className="space-y-3">
          {(block.options || []).map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={checkedOptions.has(option)}
                onCheckedChange={(checked) => {
                  const newChecked = new Set(checkedOptions)
                  if (checked) {
                    newChecked.add(option)
                  } else {
                    newChecked.delete(option)
                  }
                  setCheckedOptions(newChecked)
                }}
              />
              <Label htmlFor={option} className="cursor-pointer font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "short-question") {
    return (
      <div className="space-y-6">
        {block.content && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {block.content}
            </h2>
            {block.description && (
              <p className="text-muted-foreground">{block.description}</p>
            )}
          </div>
        )}

        <Textarea
          placeholder="Enter your answer here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="min-h-24"
        />
      </div>
    )
  }

  if (block.type === "rating-scale") {
    return (
      <div className="space-y-6">
        {block.content && (
          <h2 className="text-2xl font-bold text-foreground">
            {block.content}
          </h2>
        )}

        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className={cn(
                "w-10 h-10 rounded-lg font-semibold transition-colors border",
                rating === num
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary"
              )}
            >
              {num}
            </button>
          ))}
        </div>

        {block.scaleLeftLabel || block.scaleRightLabel ? (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {block.scaleLeftLabel && <span>{block.scaleLeftLabel}</span>}
            {block.scaleRightLabel && <span>{block.scaleRightLabel}</span>}
          </div>
        ) : null}
      </div>
    )
  }

  if (block.type === "vibe-check") {
    return (
      <div className="space-y-6">
        {block.content && (
          <h2 className="text-2xl font-bold text-foreground">
            {block.content}
          </h2>
        )}

        <div className="grid grid-cols-3 gap-4">
          {["😞", "😐", "😊"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedOption(emoji)}
              className={cn(
                "py-6 rounded-lg border-2 text-3xl transition-colors flex items-center justify-center",
                selectedOption === emoji
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-border bg-card hover:border-primary"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === "semantic-differential" || block.type === "likert" || block.type === "matrix") {
    return (
      <div className="space-y-6">
        {block.content && (
          <h2 className="text-2xl font-bold text-foreground">
            {block.content}
          </h2>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2 text-center text-sm text-muted-foreground">
            {block.scaleLeftLabel && (
              <div className="col-span-1">{block.scaleLeftLabel}</div>
            )}
            <div />
            <div />
            <div />
            {block.scaleRightLabel && (
              <div className="col-span-1">{block.scaleRightLabel}</div>
            )}
          </div>

          <div className="flex justify-between gap-2">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={cn(
                  "flex-1 py-3 rounded-lg font-medium transition-colors border",
                  rating === num
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Fallback for unknown block types
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {block.content || "Question"}
      </h2>
      {block.description && (
        <p className="text-muted-foreground">{block.description}</p>
      )}
    </Card>
  )
}

interface CanvasPreviewProps {
  canvasPages: CanvasPageData[]
  canvasStateMap: Record<string, CanvasState>
}

function CanvasPreview({ canvasPages, canvasStateMap }: CanvasPreviewProps) {
  if (!canvasPages || canvasPages.length === 0) {
    return null
  }

  const firstPage = canvasPages[0]
  const canvasState = canvasStateMap?.[firstPage.id]

  if (!canvasState) {
    return null
  }

  if (canvasState.mode === "url-preview") {
    if (canvasState.websiteUrl) {
      return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <iframe
            src={canvasState.websiteUrl}
            className="w-full h-96 border-0"
            title="Preview of website"
          />
        </div>
      )
    }

    if (canvasState.figmaUrl) {
      return (
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <iframe
            src={canvasState.figmaUrl}
            className="w-full h-96 border-0"
            title="Preview of Figma file"
          />
        </div>
      )
    }
  }

  // For drawing mode or uploaded images
  if (canvasState.uploadedImages && canvasState.uploadedImages.length > 0) {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <img
          src={canvasState.uploadedImages[0]}
          alt="Canvas preview"
          className="w-full h-auto max-h-96 object-contain"
        />
      </div>
    )
  }

  return null
}
