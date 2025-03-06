
import React from "react";
import { Coins, Loader2 } from "lucide-react";

interface CreditDisplayProps {
  credits: number | null;
  isLoadingCredits: boolean;
  CREDITS_PER_GENERATION: number;
}

export const CreditDisplay = ({ credits, isLoadingCredits }: CreditDisplayProps) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800">
      <span className="bg-[#D946EF] w-5 h-5 rounded-full flex items-center justify-center">
        <Coins className="w-3 h-3 text-white" />
      </span>
      <span className="text-sm text-white font-medium">
        {isLoadingCredits ? <Loader2 className="w-4 h-4 animate-spin" /> : credits?.toLocaleString() ?? '0'}
      </span>
    </div>
  );
};
