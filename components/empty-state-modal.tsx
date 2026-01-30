/**
 * EmptyStateModal - Shows when canvas has no design loaded
 * Prompts user to add a design via URL, upload, or Figma
 * Appears by default and centered on blank canvas
 */

"use client"

import { Upload, Link2, Figma, Plus } from "lucide-react"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EmptyStateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (data: UploadData) => void
}

interface UploadData {
  method: "upload" | "url" | "figma"
  websiteUrl?: string
  figmaUrl?: string
}

export function EmptyStateModal({
  open,
  onOpenChange,
  onUploadComplete,
}: EmptyStateModalProps) {
  const handleOptionClick = (method: "upload" | "url" | "figma") => {
    // For now, just trigger the upload modal by calling onOpenChange
    // The parent component (page.tsx) will handle opening UploadDesignModal
    onOpenChange(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl mx-4">
            <div className="p-8 text-center">
              {/* Header */}
              <div className="space-y-3 mb-8">
                <div className="inline-flex h-16 w-16 rounded-full bg-primary/10 items-center justify-center">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Start by adding a design
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Upload an image, paste a website URL, or import from Figma to
                  begin your design review
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <OptionCard
                  icon={Upload}
                  title="Upload images"
                  description="PNG, JPG, or SVG"
                  onClick={() => handleOptionClick("upload")}
                />
                <OptionCard
                  icon={Link2}
                  title="Import URL"
                  description="Paste a website link"
                  onClick={() => handleOptionClick("url")}
                />
                <OptionCard
                  icon={Figma}
                  title="Figma file"
                  description="Connect your Figma"
                  onClick={() => handleOptionClick("figma")}
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  You can also use the &quot;Publish and Share&quot; button in the top bar
                  to add a design anytime
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogPortal>
    </Dialog>
  )
}

interface OptionCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  onClick: () => void
}

function OptionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-6 rounded-lg border border-border transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
      )}
    >
      <div className="inline-flex h-12 w-12 rounded-lg bg-muted items-center justify-center mb-3">
        <Icon className="h-6 w-6 text-foreground" />
      </div>
      <h3 className="font-medium text-foreground text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  )
}
