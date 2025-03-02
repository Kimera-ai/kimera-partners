
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
  title, 
  credits, 
  isLoadingCredits, 
  CREDITS_PER_GENERATION,
  showCredits
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {title}
      </h1>
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
