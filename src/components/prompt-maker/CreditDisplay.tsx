
import React from "react";
import { Coins, Loader2 } from "lucide-react";

interface CreditDisplayProps {
  credits: number | null;
  isLoadingCredits: boolean;
  CREDITS_PER_GENERATION: number;
}

export const CreditDisplay = ({ credits, isLoadingCredits, CREDITS_PER_GENERATION }: CreditDisplayProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 backdrop-blur px-4 py-2 rounded-full bg-background/50 border border-white/5">
        <Coins className="w-4 h-4 text-yellow-500" />
        <span className={`text-sm font-bold ${credits !== null && credits < CREDITS_PER_GENERATION ? 'text-red-500' : 'text-[#F4F4F5]'}`}>
          {isLoadingCredits ? <Loader2 className="w-4 h-4 animate-spin" /> : `${credits ?? 0} credits`}
        </span>
      </div>
      <div className="text-sm text-muted-foreground backdrop-blur px-4 py-2 rounded-full bg-background/50 border border-white/5">
        Cost per generation: {CREDITS_PER_GENERATION} credits
      </div>
    </div>
  );
};
