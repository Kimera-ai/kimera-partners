import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlanLevel, PricingFeature, PricingPlan } from "../pricing-table"

interface FeaturesTableProps {
  features: PricingFeature[]
  plans: PricingPlan[]
  selectedPlan: PlanLevel
}

function shouldShowCheck(included: PricingFeature["included"], level: string): boolean {
  if (included === "all") return true
  if (included === "pro" && (level === "pro" || level === "all")) return true
  if (included === "starter" && (level === "starter" || level === "pro" || level === "all"))
    return true
  return false
}

export function FeaturesTable({ features, plans, selectedPlan }: FeaturesTableProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[480px] divide-y divide-zinc-200 dark:divide-zinc-800">
          <div className="flex items-center p-3 bg-zinc-50 dark:bg-zinc-900">
            <div className="flex-1 text-sm font-medium">Features</div>
            <div className="flex items-center gap-4 text-sm">
              {plans.map((plan) => (
                <div key={plan.level} className="w-12 text-center font-medium">
                  {plan.name}
                </div>
              ))}
            </div>
          </div>
          {features.map((feature) => (
            <div
              key={feature.name}
              className={cn(
                "flex items-center p-3 transition-colors",
                feature.included === selectedPlan && "bg-blue-50/50 dark:bg-blue-900/20",
              )}
            >
              <div className="flex-1 text-sm">{feature.name}</div>
              <div className="flex items-center gap-4 text-sm">
                {plans.map((plan) => (
                  <div
                    key={plan.level}
                    className={cn(
                      "w-12 flex justify-center",
                      plan.level === selectedPlan && "font-medium",
                    )}
                  >
                    {shouldShowCheck(feature.included, plan.level) ? (
                      <Check className="w-4 h-4 text-blue-500" />
                    ) : (
                      <span className="text-zinc-300 dark:text-zinc-700">-</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}