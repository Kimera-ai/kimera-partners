import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface AuthContainerProps {
  children: ReactNode
}

export const AuthContainer = ({ children }: AuthContainerProps) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="w-full max-w-[1400px] relative z-50 bg-background/80 backdrop-blur-xl border-white/10 p-12 sm:p-16">
      <div className="w-full max-w-6xl mx-auto">
        {children}
      </div>
    </Card>
  </div>
)