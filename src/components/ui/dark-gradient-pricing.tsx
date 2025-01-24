import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BenefitProps {
  text: string
  checked: boolean
}

const Benefit = ({ text, checked }: BenefitProps) => {
  return (
    <div className="flex items-start gap-3">
      {checked ? (
        <span className="grid size-4 shrink-0 place-content-center rounded-full bg-primary text-sm text-primary-foreground mt-0.5">
          <Check className="size-3" />
        </span>
      ) : (
        <span className="grid size-4 shrink-0 place-content-center rounded-full bg-zinc-800 text-sm text-zinc-400 mt-0.5">
          <X className="size-3" />
        </span>
      )}
      <span className="text-sm text-zinc-300">{text}</span>
    </div>
  )
}

interface PricingCardProps {
  tier: string
  price: string
  bestFor: string
  CTA: string
  benefits: Array<{ text: string; checked: boolean }>
  className?: string
  popular?: boolean
}

export const PricingCard = ({
  tier,
  price,
  bestFor,
  CTA,
  benefits,
  className,
  popular,
}: PricingCardProps) => {
  const scrollToCalculator = () => {
    const calculator = document.querySelector('#pricing-calculator')
    if (calculator) {
      calculator.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={cn(
          "group relative h-full w-full overflow-hidden rounded-2xl border transition-all duration-300",
          "border-white/5 bg-gradient-to-br from-white/[0.03] to-white/[0.01]",
          "hover:border-white/10 hover:from-white/[0.05] hover:to-white/[0.02]",
          "before:absolute before:inset-0 before:-translate-y-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-t before:from-transparent before:via-white/10 before:to-transparent",
          "after:absolute after:inset-0 after:translate-y-full after:animate-[shimmer_2s_infinite] before:bg-gradient-to-b after:from-transparent after:via-white/10 after:to-transparent",
          "p-8 flex flex-col",
          className
        )}
      >
        <div className="flex flex-col text-left border-b border-white/5 pb-8">
          <span className="mb-6 inline-block text-lg font-medium text-white">
            {tier}
          </span>
          <span className="mb-3 inline-block text-5xl font-bold text-white">
            {price}
          </span>
          <span className="text-sm text-zinc-400">
            {bestFor}
          </span>
          {popular && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full">
              Popular
            </span>
          )}
        </div>
        <div className="space-y-4 py-8 flex-grow">
          {benefits.map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>
        <Button
          onClick={scrollToCalculator}
          className={cn(
            "w-full transition-all duration-300",
            "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
            "text-white font-medium mt-auto"
          )}
          variant="default"
        >
          {CTA}
        </Button>
      </Card>
    </motion.div>
  )
}