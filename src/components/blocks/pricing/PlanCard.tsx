import * as React from "react"
import { cn } from "@/lib/utils"
import NumberFlow from "@number-flow/react"
import { PlanLevel, PricingPlan } from "../pricing-table"

interface PlanCardProps {
  plan: PricingPlan
  isYearly: boolean
  selectedPlan: PlanLevel
  onSelect: (plan: PlanLevel) => void
}

export function PlanCard({ plan, isYearly, selectedPlan, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.level)}
      className={cn(
        "flex-1 p-3 rounded-xl text-left transition-all",
        "border border-zinc-200 dark:border-zinc-800",
        selectedPlan === plan.level && "ring-2 ring-blue-500 dark:ring-blue-400",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{plan.name}</span>
        {plan.popular && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">
            Popular
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <NumberFlow
          format={{
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }}
          value={isYearly ? plan.price.yearly : plan.price.monthly}
          className="text-2xl font-bold"
        />
        <span className="text-sm font-normal text-zinc-500">
          /{isYearly ? "year" : "month"}
        </span>
      </div>
    </button>
  )
}