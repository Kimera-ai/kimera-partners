import { Card } from "@/components/ui/card"
import { ReactNode } from "react"

interface AuthContainerProps {
  children: ReactNode
}

export const AuthContainer = ({ children }: AuthContainerProps) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="w-[600px] relative z-50 bg-background/80 backdrop-blur-xl border-white/10 p-6">
      <div className="w-full mx-auto">
        {children}
      </div>
    </Card>
  </div>
)