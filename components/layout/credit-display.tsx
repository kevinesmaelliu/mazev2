/**
 * CreditDisplay - Shows the current user credit balance
 * Displays credit count with an icon
 */

import { Zap } from "lucide-react"

interface CreditDisplayProps {
  credits?: number
}

export function CreditDisplay({ credits = 0 }: CreditDisplayProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Zap className="h-4 w-4" />
      <span>{credits}</span>
    </div>
  )
}
