/**
 * UploadDesignModal - Modal for importing designs to canvas
 * Clean card-based layout with visual previews for canvas and URL/Figma import
 * Follows DEVELOPMENT_GUIDELINES with theme colors and shadcn/ui components
 */

"use client"

import { useState } from "react"
import { ArrowRight, X } from "lucide-react"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface UploadDesignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (data: UploadData) => void
  embedded?: boolean
}

interface UploadData {
  method: "url" | "figma" | "canvas"
  websiteUrl?: string
  figmaUrl?: string
}

export function UploadDesignModal({
  open,
  onOpenChange,
  onUploadComplete,
  embedded = false,
}: UploadDesignModalProps) {
  const [url, setUrl] = useState("")

  const handleUrlSubmit = () => {
    if (url.trim()) {
      if (url.includes("figma.com/proto") || url.includes("figma.com/file")) {
        onUploadComplete?.({ method: "figma", figmaUrl: url })
      } else {
        onUploadComplete?.({ method: "url", websiteUrl: url })
      }
      onOpenChange(false)
      setUrl("")
    }
  }

  const handleCanvasClick = () => {
    onUploadComplete?.({ method: "canvas" })
    onOpenChange(false)
  }

  const handleClose = () => {
    setUrl("")
    onOpenChange(false)
  }

  const modalContent = (
    <Card className="w-full max-w-4xl shadow-2xl relative">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 h-8 w-8 rounded-full z-10"
        onClick={handleClose}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="p-8">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <p className="text-sm text-muted-foreground">Get Started</p>
          <h2 className="text-2xl font-semibold text-foreground">Import your design for testing</h2>
        </div>

        {/* Two cards grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Canvas Card */}
          <div className="relative bg-muted/10 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all h-96">
            {/* Background Preview */}
            <div className="absolute inset-0 flex items-start justify-center pt-8">
              <div className="relative w-48 h-48">
                {/* Canvas illustration - simplified geometric shapes */}
                <div className="absolute top-0 left-8 w-16 h-16">
                  {/* Blue pin/location marker shape */}
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-blue-500 rounded-full opacity-80"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-t-blue-500 opacity-80"></div>
                  </div>
                </div>

                {/* Gradient sphere with arrow */}
                <div className="absolute bottom-4 right-4 w-20 h-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-80"></div>
                  {/* Small arrow overlay */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-background/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-4 h-4 border-t-2 border-r-2 border-foreground/50 rotate-45 -translate-x-0.5"></div>
                  </div>
                </div>

                {/* Rectangles in background */}
                <div className="absolute top-8 right-8 w-24 h-32 bg-muted/40 rounded-lg"></div>
                <div className="absolute top-16 right-16 w-20 h-24 bg-muted/30 rounded-lg"></div>
              </div>
            </div>

            {/* Gradient overlay for fade effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background/95"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Dark overlay behind text */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>

              <div className="relative space-y-2 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Use Canvas</h3>
                <p className="text-sm text-muted-foreground">
                  Add designs on a blank canvas with drawing tools
                </p>
              </div>

              {/* Action */}
              <Button onClick={handleCanvasClick} className="w-full relative" size="lg">
                Start Drawing
              </Button>
            </div>
          </div>

          {/* URL/Figma Card */}
          <div className="relative bg-muted/10 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all h-96">
            {/* Background Preview */}
            <div className="absolute inset-0 flex items-start justify-center pt-8">
              <div className="relative w-56 h-40">
                {/* Browser window mockup */}
                <div className="absolute inset-0 bg-card/60 backdrop-blur-sm border border-border rounded-lg overflow-hidden shadow-xl">
                  {/* Browser chrome */}
                  <div className="h-8 bg-muted/40 border-b border-border/50 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                    </div>
                  </div>
                  {/* Content area with gradient bars */}
                  <div className="p-4 space-y-3">
                    <div className="h-2.5 bg-gradient-to-r from-primary/50 to-primary/20 rounded w-3/4"></div>
                    <div className="h-2.5 bg-gradient-to-r from-primary/40 to-primary/10 rounded w-1/2"></div>
                    <div className="h-20 bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/20 rounded-lg mt-4"></div>
                  </div>
                </div>

                {/* Floating orb accent */}
                <div className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full blur-md opacity-60"></div>
                <div className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Gradient overlay for fade effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background/95"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {/* Dark overlay behind text */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>

              <div className="relative space-y-2 mb-6">
                <h3 className="text-lg font-semibold text-foreground">Import Website or Figma Prototype</h3>
                <p className="text-sm text-muted-foreground">
                  Paste any website URL or Figma prototype link
                </p>
              </div>

              {/* Action */}
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://example.com or figma.com/proto/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pr-12 bg-background border-border/50 h-11"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUrlSubmit()
                    }
                  }}
                />
                <Button
                  onClick={handleUrlSubmit}
                  disabled={!url.trim()}
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  if (embedded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-8">
        {modalContent}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          {modalContent}
        </div>
      </DialogPortal>
    </Dialog>
  )
}
