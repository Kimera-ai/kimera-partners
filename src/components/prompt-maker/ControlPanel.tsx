
import React from "react";
import { PromptInputPanel } from "./panels/PromptInputPanel";
import { GenerateButtonPanel } from "./panels/GenerateButtonPanel";
import { CreditInfo, GenerationSettings, GenerationState, ImageSettings, PromptSettings } from "./types";

interface ControlPanelProps extends 
  PromptSettings, 
  ImageSettings, 
  GenerationSettings, 
  GenerationState,
  CreditInfo {
    isUploading: boolean;
    isProcessing: boolean;
    CREDITS_PER_GENERATION: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  setPrompt,
  isImprovingPrompt,
  handleImprovePrompt,
  imagePreview,
  isUploading,
  handleImageUpload,
  removeImage,
  workflow,
  setWorkflow,
  ratio,
  setRatio,
  style,
  setStyle,
  loraScale,
  setLoraScale,
  seed,
  setSeed,
  numberOfImages,
  setNumberOfImages,
  isProcessing,
  handleGenerate,
  credits,
  isLoadingCredits,
  CREDITS_PER_GENERATION,
  uploadedImageUrl
}) => {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#1A1625]/70 backdrop-blur-lg shadow-xl">
      <div className="space-y-3 p-4">
        {/* Prompt input area */}
        <PromptInputPanel 
          prompt={prompt} 
          setPrompt={setPrompt} 
          isImprovingPrompt={isImprovingPrompt} 
          handleImprovePrompt={handleImprovePrompt} 
          imagePreview={imagePreview}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          isProcessing={isProcessing}
          workflow={workflow}
          uploadedImageUrl={uploadedImageUrl}
        />
        
        <div className="flex justify-between items-center mt-3">
          {/* Hiding Classic Mode and Flow State buttons */}
          <div className="flex-1"></div>
          
          {/* Generate button */}
          <GenerateButtonPanel 
            isUploading={isUploading}
            workflow={workflow}
            uploadedImageUrl={uploadedImageUrl}
            credits={credits}
            isLoadingCredits={isLoadingCredits}
            CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
            isProcessing={isProcessing}
            handleGenerate={handleGenerate}
            numberOfImages={numberOfImages}
          />
        </div>
      </div>
    </div>
  );
};
