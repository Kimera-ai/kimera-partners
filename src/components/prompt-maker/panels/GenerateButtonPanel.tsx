
import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { CreditInfo, GenerationState } from "../types";

interface GenerateButtonPanelProps extends CreditInfo, GenerationState {
  isUploading: boolean;
  workflow: string;
  uploadedImageUrl: string | null;
  numberOfImages: string;
  isGenerating?: boolean;
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
  numberOfImages,
  isGenerating
}: GenerateButtonPanelProps) => {
  const isButtonDisabled = isUploading || 
    isGenerating ||
    ((workflow === 'with-reference' || workflow === 'cartoon' || workflow === 'ideogram' || workflow === 'video') && !uploadedImageUrl) || 
    (credits !== null && credits < CREDITS_PER_GENERATION) || 
    isLoadingCredits;

  const numImages = parseInt(numberOfImages) || 1;
  const totalCost = CREDITS_PER_GENERATION * numImages;

  const getButtonText = () => {
    if (isGenerating) return "Generating...";
    if (isUploading) return "Uploading...";
    if ((workflow === 'with-reference' || workflow === 'cartoon' || workflow === 'ideogram' || workflow === 'video') && !uploadedImageUrl) return "Upload an image";
    if (credits !== null && credits < CREDITS_PER_GENERATION) return "Insufficient Credits";
    if (isLoadingCredits) return "Loading Credits...";
    return workflow === 'video' ? `Generate Video (${totalCost} credits)` : `Generate`;
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
      {isGenerating ? (
        <Loader2 className="w-4 h-4 text-white animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4 text-white" />
      )}
      <span className="text-white text-sm">
        {getButtonText()}
      </span>
      {!isButtonDisabled && workflow !== 'video' && !isGenerating && (
        <span className="ml-1 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">
          {totalCost}
        </span>
      )}
    </button>
  );
};
