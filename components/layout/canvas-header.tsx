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
    <header className="flex items-center justify-between bg-card px-6 py-3">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
          aria-label="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium">{projectName}</span>
          </div>

          {/* Canvas page tabs */}
          <div className="flex items-center gap-1">
            {canvasPages.map((page) => (
              <div
                key={page.id}
                className={cn(
                  "group relative flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-all border border-b-0",
                  activeCanvasPageId === page.id
                    ? "tab-connector bg-muted border-border text-foreground"
                    : "bg-transparent hover:bg-muted/50 text-muted-foreground border-transparent"
                )}
              >
                <button
                  onClick={() => onCanvasPageSelect?.(page.id)}
                  className="flex items-center gap-1.5 text-sm font-medium"
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
                    className="opacity-0 group-hover:opacity-100 hover:bg-background/50 rounded p-0.5 transition-opacity"
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
              className="h-9 gap-1.5 text-muted-foreground hover:text-foreground rounded-t-lg border-b-0"
              onClick={onCanvasPageAdd}
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <CreditDisplay credits={credits} />

        <Button variant="outline" size="sm" className="h-8 gap-2" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>

        <Button size="sm" className="h-8" onClick={onPublish}>
          Publish and Share
        </Button>

        <button
          onClick={onProfileClick}
          className="hover:opacity-80 transition-opacity"
          aria-label="Open profile"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
