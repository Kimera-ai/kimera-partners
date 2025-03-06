
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
      <Button 
        className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#8B5CF6] hover:to-[#6E59A5] text-white disabled:bg-[#C8C8C9] disabled:text-gray-600 disabled:opacity-80 disabled:bg-none" 
        disabled={isButtonDisabled}
        onClick={handleGenerate}
        type="button"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {getButtonText()}
      </Button>

      {credits !== null && credits < CREDITS_PER_GENERATION && (
        <div className="text-sm text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-md">
          You don't have enough credits to generate images. Please contact support@kimera.ai to purchase more credits.
        </div>
      )}
    </>
  );
};
