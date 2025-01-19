import * as React from "react"
import { cn } from "@/lib/utils"

interface IntervalToggleProps {
  isYearly: boolean
  onChange: (isYearly: boolean) => void
}

export function IntervalToggle({ isYearly, onChange }: IntervalToggleProps) {
  return (
    <div className="flex justify-end mb-4 sm:mb-8">
      <div className="inline-flex items-center gap-2 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "px-3 py-1 rounded-md transition-colors",
            !isYearly ? "bg-zinc-100 dark:bg-zinc-800" : "text-zinc-500",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "px-3 py-1 rounded-md transition-colors",
            isYearly ? "bg-zinc-100 dark:bg-zinc-800" : "text-zinc-500",
          )}
        >
          Yearly
        </button>
      </div>
    </div>
  )
}