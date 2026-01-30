/**
 * UploadDesignModal - Modal for uploading designs to canvas
 * Three methods: drag/drop images, paste URL, or import from Figma
 * Follows DEVELOPMENT_GUIDELINES with theme colors and shadcn/ui components
 */

"use client"

import { useState, useCallback } from "react"
import { Upload, Link2, Figma, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type UploadMethod = "upload" | "url" | "figma"

interface UploadDesignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (data: UploadData) => void
}

interface UploadData {
  method: UploadMethod
  websiteUrl?: string
  figmaUrl?: string
}

export function UploadDesignModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadDesignModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<UploadMethod>("upload")
  const [isDragging, setIsDragging] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [figmaUrl, setFigmaUrl] = useState("")

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith("image/"))

      if (imageFile) {
        onUploadComplete?.({ method: "upload" })
        onOpenChange(false)
      }
    },
    [onUploadComplete, onOpenChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && file.type.startsWith("image/")) {
        onUploadComplete?.({ method: "upload" })
        onOpenChange(false)
      }
    },
    [onUploadComplete, onOpenChange]
  )

  const handleUrlSubmit = () => {
    if (websiteUrl.trim()) {
      onUploadComplete?.({ method: "url", websiteUrl })
      onOpenChange(false)
      setWebsiteUrl("")
    }
  }

  const handleFigmaSubmit = () => {
    if (figmaUrl.trim()) {
      onUploadComplete?.({ method: "figma", figmaUrl })
      onOpenChange(false)
      setFigmaUrl("")
    }
  }

  const handleClose = () => {
    setSelectedMethod("upload")
    setWebsiteUrl("")
    setFigmaUrl("")
    setIsDragging(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Card className="w-full max-w-4xl mx-4 overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="text-center space-y-2 mb-8">
                <p className="text-sm text-muted-foreground">Get Started</p>
                <h2 className="text-2xl font-semibold text-foreground">
                  Upload your design for testing
                </h2>
              </div>

              {/* Main content - horizontal split */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left side - Options */}
                <div className="space-y-3">
                  <MethodButton
                    icon={Upload}
                    title="Upload images"
                    description="Drag and drop or browse for PNG, JPG, or SVG files"
                    selected={selectedMethod === "upload"}
                    onClick={() => setSelectedMethod("upload")}
                  />
                  <MethodButton
                    icon={Link2}
                    title="Import from URL"
                    description="Paste a website URL to capture the entire page"
                    selected={selectedMethod === "url"}
                    onClick={() => setSelectedMethod("url")}
                  />
                  <MethodButton
                    icon={Figma}
                    title="Import from Figma"
                    description="Connect your Figma file to import frames as artboards"
                    selected={selectedMethod === "figma"}
                    onClick={() => setSelectedMethod("figma")}
                  />
                </div>

                {/* Right side - Preview/Input area */}
                <div className="rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/20 min-h-[400px] flex flex-col">
                  {selectedMethod === "upload" && (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={cn(
                        "h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg p-6 transition-all",
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-border/50"
                      )}
                    >
                      <div className="text-center space-y-3">
                        <div className="inline-flex h-16 w-16 rounded-full bg-background items-center justify-center">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">Drag files here</p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG, or SVG files
                          </p>
                        </div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>
                  )}

                  {selectedMethod === "url" && (
                    <div className="h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Step 1:</p>
                          <p className="text-sm text-muted-foreground">
                            Copy the URL of the website you want to test
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Step 2:</p>
                          <p className="text-sm text-muted-foreground">
                            Paste it below and we&apos;ll capture the entire page
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Step 3:</p>
                          <p className="text-sm text-muted-foreground">
                            Add annotations and create your test
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-background rounded-lg p-4 border border-border">
                          <Input
                            type="url"
                            placeholder="https://example.com"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className="bg-background border-muted-foreground/20"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUrlSubmit()
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleUrlSubmit}
                          disabled={!websiteUrl.trim()}
                          size="lg"
                          className="w-full gap-2"
                        >
                          Import Website
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedMethod === "figma" && (
                    <div className="h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Step 1:</p>
                          <p className="text-sm text-muted-foreground">
                            Make sure your Figma file has link sharing enabled
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Step 2:</p>
                          <p className="text-sm text-muted-foreground">
                            Copy the file or frame URL from Figma
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Step 3:</p>
                          <p className="text-sm text-muted-foreground">
                            All frames will be imported as separate artboards
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-background rounded-lg p-4 border border-border">
                          <Input
                            type="url"
                            placeholder="https://www.figma.com/file/..."
                            value={figmaUrl}
                            onChange={(e) => setFigmaUrl(e.target.value)}
                            className="bg-background border-muted-foreground/20"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleFigmaSubmit()
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleFigmaSubmit}
                          disabled={!figmaUrl.trim()}
                          size="lg"
                          className="w-full gap-2"
                        >
                          Import from Figma
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogPortal>
    </Dialog>
  )
}

interface MethodButtonProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

function MethodButton({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}: MethodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}
