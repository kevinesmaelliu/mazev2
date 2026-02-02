"use client"

import { Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProxyToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  disabled?: boolean
}

export function ProxyToggle({ enabled, onToggle, disabled }: ProxyToggleProps) {
  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={() => onToggle(!enabled)}
      disabled={disabled}
      className={cn(
        "absolute top-4 right-4 z-40 gap-2",
        enabled && "bg-blue-600 hover:bg-blue-700"
      )}
      title={enabled ? "CORS proxy enabled" : "CORS proxy disabled"}
    >
      <Network className="h-4 w-4" />
      <span className="text-xs">{enabled ? "Proxy ON" : "Proxy OFF"}</span>
    </Button>
  )
}
