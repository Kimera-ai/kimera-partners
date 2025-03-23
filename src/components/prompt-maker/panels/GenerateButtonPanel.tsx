
import React from "react";
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
    ((workflow === 'with-reference' || workflow === 'cartoon' || workflow === 'video') && !uploadedImageUrl) || 
    (credits !== null && credits < CREDITS_PER_GENERATION) || 
    isLoadingCredits;

  const numImages = parseInt(numberOfImages) || 1;
  const totalCost = CREDITS_PER_GENERATION * numImages;

  const getButtonText = () => {
    if (isUploading) return "Uploading...";
    if ((workflow === 'with-reference' || workflow === 'cartoon' || workflow === 'video') && !uploadedImageUrl) return "Upload an image";
    if (credits !== null && credits < CREDITS_PER_GENERATION) return "Insufficient Credits";
    if (isLoadingCredits) return "Loading Credits...";
    return workflow === 'video' ? `Generate Video` : `Generate`;
  };

  return (
    <button 
      className="flex items-center justify-center gap-2 py-2 px-6 rounded-md font-medium 
        bg-gradient-to-r from-purple-500 to-pink-500
        disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isButtonDisabled}
      onClick={handleGenerate}
      type="button"
    >
      <Sparkles className="w-4 h-4 text-white" />
      <span className="text-white text-sm">
        {getButtonText()}
      </span>
      {!isButtonDisabled && (
        <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
          {totalCost}
        </span>
      )}
    </button>
  );
};
