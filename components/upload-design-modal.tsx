"use client"

import { useState } from "react"
import { Download, Link, Figma, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type UploadStep = 1 | 2 | 3

interface UploadDesignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: (data: UploadData) => void
}

interface UploadData {
  step: UploadStep
  websiteUrl?: string
  figmaUrl?: string
}

export function UploadDesignModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadDesignModalProps) {
  const [step, setStep] = useState<UploadStep>(1)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [figmaUrl, setFigmaUrl] = useState("")

  const handleStepSelect = (selectedStep: UploadStep) => {
    setStep(selectedStep)
  }

  const handleSubmit = (selectedStep: UploadStep) => {
    const data: UploadData = {
      step: selectedStep,
      websiteUrl: selectedStep === 2 ? websiteUrl : undefined,
      figmaUrl: selectedStep === 3 ? figmaUrl : undefined,
    }
    onUploadComplete?.(data)
    onOpenChange(false)
  }

  const resetModal = () => {
    setStep(1)
    setWebsiteUrl("")
    setFigmaUrl("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetModal()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-card px-6 py-4 text-center">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Upload your design for testing
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-0">
          {/* Left panel - Options */}
          <div className="border-r border-border bg-card p-6">
            <div className="space-y-3">
              <UploadOption
                icon={Download}
                title="Upload images"
                description="Drag and drop or browse for PNG, JPG, or SVG"
                selected={step === 1}
                onClick={() => handleStepSelect(1)}
              />
              <UploadOption
                icon={Link}
                title="Import from URL"
                description="Paste a website URL to capture the entire page"
                selected={step === 2}
                onClick={() => handleStepSelect(2)}
              />
              <UploadOption
                icon={Figma}
                title="Import from Figma"
                description="Connect your Figma file to import frames as artboards"
                selected={step === 3}
                onClick={() => handleStepSelect(3)}
              />
            </div>
          </div>

          {/* Right panel - Step content */}
          <div className="bg-background p-6">
            {step === 1 && <StepOneContent />}
            {step === 2 && (
              <StepTwoContent
                url={websiteUrl}
                onUrlChange={setWebsiteUrl}
                onSubmit={() => handleSubmit(2)}
              />
            )}
            {step === 3 && (
              <StepThreeContent
                url={figmaUrl}
                onUrlChange={setFigmaUrl}
                onSubmit={() => handleSubmit(3)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface UploadOptionProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

function UploadOption({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
}: UploadOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border px-4 py-3 text-left transition-colors",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:bg-accent"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn(
          "mt-0.5 h-5 w-5 flex-shrink-0",
          selected ? "text-primary" : "text-muted-foreground"
        )} />
        <div className="flex-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}

function StepOneContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
        <Download className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">Drag files here</p>
        <p className="text-sm text-muted-foreground">PNG, JPG, or SVG files</p>
      </div>
    </div>
  )
}

interface StepTwoContentProps {
  url: string
  onUrlChange: (url: string) => void
  onSubmit: () => void
}

function StepTwoContent({ url, onUrlChange, onSubmit }: StepTwoContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Step 1:</p>
        <p className="text-sm text-muted-foreground">
          Paste the URL of the website you want to test
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Step 2:</p>
        <p className="text-sm text-muted-foreground">
          Name the site and we&apos;ll capture the entire page
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Step 3:</p>
        <p className="text-sm text-muted-foreground">
          Add questions and create your test
        </p>
      </div>
      <div className="space-y-4 border-t border-border pt-4">
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="bg-input"
        />
        <Button
          onClick={onSubmit}
          disabled={!url}
          className="w-full"
          size="lg"
        >
          Import Website
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface StepThreeContentProps {
  url: string
  onUrlChange: (url: string) => void
  onSubmit: () => void
}

function StepThreeContent({ url, onUrlChange, onSubmit }: StepThreeContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Step 1:</p>
        <p className="text-sm text-muted-foreground">
          Make sure your Figma file has link sharing enabled
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Step 2:</p>
        <p className="text-sm text-muted-foreground">
          Copy the share link from Figma
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Step 3:</p>
        <p className="text-sm text-muted-foreground">
          All frames will be imported as separate artboards
        </p>
      </div>
      <div className="space-y-4 border-t border-border pt-4">
        <Input
          placeholder="https://figma.com/file/..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="bg-input"
        />
        <Button
          onClick={onSubmit}
          disabled={!url}
          className="w-full"
          size="lg"
        >
          Import from Figma
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
