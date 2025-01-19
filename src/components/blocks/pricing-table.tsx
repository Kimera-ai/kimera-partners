"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { PlanCard } from "./pricing/PlanCard"
import { IntervalToggle } from "./pricing/IntervalToggle"
import { FeaturesTable } from "./pricing/FeaturesTable"

export type PlanLevel = "starter" | "pro" | "all" | string

export interface PricingFeature {
  name: string
  included: PlanLevel | null
}

export interface PricingPlan {
  name: string
  level: PlanLevel
  price: {
    monthly: number
    yearly: number
  }
  popular?: boolean
}

export interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  features: PricingFeature[]
  plans: PricingPlan[]
  onPlanSelect?: (plan: PlanLevel) => void
  defaultPlan?: PlanLevel
  defaultInterval?: "monthly" | "yearly"
  containerClassName?: string
  buttonClassName?: string
}

export function PricingTable({
  features,
  plans,
  onPlanSelect,
  defaultPlan = "pro",
  defaultInterval = "monthly",
  className,
  containerClassName,
  buttonClassName,
  ...props
}: PricingTableProps) {
  const [isYearly, setIsYearly] = React.useState(defaultInterval === "yearly")
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>(defaultPlan)

  const handlePlanSelect = (plan: PlanLevel) => {
    setSelectedPlan(plan)
    onPlanSelect?.(plan)
  }

  return (
    <section
      className={cn(
        "bg-background text-foreground",
        "py-12 sm:py-24 md:py-32 px-4",
        "fade-bottom overflow-hidden pb-0",
      )}
    >
      <div className={cn("w-full max-w-2xl mx-auto px-4", containerClassName)} {...props}>
        <IntervalToggle isYearly={isYearly} onChange={setIsYearly} />

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.level}
              plan={plan}
              isYearly={isYearly}
              selectedPlan={selectedPlan}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        <FeaturesTable features={features} plans={plans} selectedPlan={selectedPlan} />

        <div className="mt-8 text-center">
          <Button
            className={cn(
              "w-full sm:w-auto bg-blue-500 hover:bg-blue-600 px-8 py-2 rounded-xl",
              buttonClassName,
            )}
          >
            Get started with {plans.find((p) => p.level === selectedPlan)?.name}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}