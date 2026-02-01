/**
 * CanvasHeader - Top navigation bar for canvas page
 * Contains project info, navigation, credits, and primary actions
 * Features (left to right): back button, project name, current tab, add tab button, credits, save, publish and share, profile
 */

"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, Plus, Save, X, Layout } from "lucide-react"
import { CreditDisplay } from "./credit-display"
import { cn } from "@/lib/utils"

export interface CanvasPage {
  id: string
  name: string
}

interface CanvasHeaderProps {
  projectName?: string
  credits?: number
  canvasPages?: CanvasPage[]
  activeCanvasPageId?: string
  userInitial?: string
  onBack?: () => void
  onSave?: () => void
  onPublish?: () => void
  onCanvasPageSelect?: (id: string) => void
  onCanvasPageAdd?: () => void
  onCanvasPageClose?: (id: string) => void
  onProfileClick?: () => void
}

export function CanvasHeader({
  projectName = "Untitled Design Review",
  credits = 0,
  canvasPages = [],
  activeCanvasPageId,
  userInitial = "U",
  onBack,
  onSave,
  onPublish,
  onCanvasPageSelect,
  onCanvasPageAdd,
  onCanvasPageClose,
  onProfileClick,
}: CanvasHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-card px-6 py-2 border-b border-border">
      <div className="flex items-center gap-8">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
          aria-label="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Project name and tabs section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">{projectName}</span>
          </div>

          {/* Canvas page tabs - relative positioning for pseudo-elements */}
          <div className="relative flex items-baseline gap-0">
            {canvasPages.map((page) => (
              <div
                key={page.id}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-1.5 rounded-t-lg transition-all border border-b-0",
                  activeCanvasPageId === page.id
                    ? "tab-connector bg-muted border-border text-foreground z-10"
                    : "bg-transparent text-muted-foreground border-transparent z-0 hover:bg-muted/30"
                )}
              >
                <button
                  onClick={() => onCanvasPageSelect?.(page.id)}
                  className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
                >
                  <Layout className="h-3.5 w-3.5" />
                  {page.name}
                </button>

                {canvasPages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onCanvasPageClose?.(page.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-muted rounded p-0.5 transition-opacity"
                    aria-label={`Close ${page.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="relative z-0 h-10 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-t-lg border-b-0"
              onClick={onCanvasPageAdd}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <CreditDisplay credits={credits} />

        <div className="h-6 w-px bg-border" />

        <Button variant="outline" size="sm" className="h-8 gap-2" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button size="sm" className="h-8 whitespace-nowrap" onClick={onPublish}>
          Publish and Share
        </Button>

        <button
          onClick={onProfileClick}
          className="hover:opacity-80 transition-opacity ml-1"
          aria-label="Open profile"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium">{userInitial}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
