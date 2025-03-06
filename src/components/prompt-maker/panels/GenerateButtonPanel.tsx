
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { CreditInfo, GenerationState } from "../types";

interface GenerateButtonPanelProps extends CreditInfo, GenerationState {
  isUploading: boolean;
  workflow: string;
  uploadedImageUrl: string | null;
  numberOfImages: string;
}

export const GenerateButtonPanel = ({
  isUploading,
  workflow,
  uploadedImageUrl,
  credits,
  CREDITS_PER_GENERATION,
  isLoadingCredits,
  isProcessing,
  handleGenerate,
  numberOfImages
}: GenerateButtonPanelProps) => {
  const isButtonDisabled = isUploading || 
    ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) || 
    (credits !== null && credits < CREDITS_PER_GENERATION) || 
    isLoadingCredits;

  const numImages = parseInt(numberOfImages) || 1;
  const totalCost = CREDITS_PER_GENERATION * numImages;

  const getButtonText = () => {
    if (isUploading) return "Uploading...";
    if ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) return "Upload an image";
    if (credits !== null && credits < CREDITS_PER_GENERATION) return "Insufficient Credits";
    if (isLoadingCredits) return "Loading Credits...";
    return `Generate (${totalCost} credits)`;
  };

  return (
    <>
      <button 
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium 
        bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 
        disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isButtonDisabled}
        onClick={handleGenerate}
        type="button"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span className="text-white">
          {getButtonText()}
        </span>
      </button>

      {credits !== null && credits < CREDITS_PER_GENERATION && (
        <div className="text-sm text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-md">
          You don't have enough credits to generate images. Please contact support@kimera.ai to purchase more credits.
        </div>
      )}
    </>
  );
};
