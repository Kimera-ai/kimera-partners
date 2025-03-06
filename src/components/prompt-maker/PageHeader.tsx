
import React from "react";
import { CreditDisplay } from "./CreditDisplay";

interface PageHeaderProps {
  title: string;
  credits: number | null;
  isLoadingCredits: boolean;
  CREDITS_PER_GENERATION: number;
  showCredits: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  credits, 
  isLoadingCredits, 
  CREDITS_PER_GENERATION,
  showCredits
}) => {
  return (
    <div className="flex items-center justify-between w-full mb-6 px-4">
      <div className="flex items-center gap-2">
        <span className="bg-gradient-to-r from-[#D946EF] to-[#9b87f5] bg-clip-text text-transparent text-lg font-semibold">
          Image
        </span>
        <span className="text-lg text-white font-semibold">
          Creation
        </span>
      </div>
      {showCredits && (
        <CreditDisplay 
          credits={credits} 
          isLoadingCredits={isLoadingCredits} 
          CREDITS_PER_GENERATION={CREDITS_PER_GENERATION} 
        />
      )}
    </div>
  );
};
