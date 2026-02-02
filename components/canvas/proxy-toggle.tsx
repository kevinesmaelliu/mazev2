"use client"

import { Network } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProxyToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
}

export function ProxyToggle({ enabled, onToggle, disabled }: ProxyToggleProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      disabled={disabled}
      className={cn(
        "absolute top-4 right-4 z-40 p-2 rounded-lg transition-colors",
        "text-foreground hover:bg-muted",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        enabled && "text-primary"
      )}
      title={enabled ? "CORS proxy enabled" : "CORS proxy disabled"}
    >
      <Network className="h-5 w-5" />
    </button>
  )
}
