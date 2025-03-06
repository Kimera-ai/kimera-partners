
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
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-[#1D1A27] text-white/80 text-sm rounded border border-white/10 hover:bg-[#252031] transition-colors">
              Classic Mode
            </button>
            <button className="px-3 py-1.5 bg-[#1D1A27] text-white/80 text-sm rounded border border-white/10 hover:bg-[#252031] transition-colors flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/70">
                <path d="M12 4.5L14.3 9.5L19.5 10L16 14L17 19.5L12 17L7 19.5L8 14L4.5 10L9.7 9.5L12 4.5Z" fill="currentColor"/>
              </svg>
              Flow State
            </button>
          </div>
          
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
