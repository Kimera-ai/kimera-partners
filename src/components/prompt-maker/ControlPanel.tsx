
import React from "react";
import { PromptInputPanel } from "./panels/PromptInputPanel";
import { WorkflowPanel } from "./panels/WorkflowPanel";
import { RatioAndImagesPanel } from "./panels/RatioAndImagesPanel";
import { StylePanel } from "./panels/StylePanel";
import { AdvancedSettingsPanel } from "./panels/AdvancedSettingsPanel";
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
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-opacity-30 backdrop-blur-lg bg-black/20 shadow-xl">
      {/* Panel header */}
      <div className="p-3 bg-black/30 text-left border-b border-white/5">
        <h2 className="text-white/90 font-medium">Create your image</h2>
      </div>
      
      {/* Panel body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left side */}
        <div className="space-y-4">
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
          
          {/* Workflow selection (no-reference, with-reference, cartoon) */}
          <WorkflowPanel 
            workflow={workflow} 
            setWorkflow={setWorkflow}
            imagePreview={imagePreview}
            isUploading={isUploading}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />
        </div>
        
        {/* Right side */}
        <div className="space-y-4">
          {/* Aspect ratio and number of images */}
          <RatioAndImagesPanel 
            ratio={ratio} 
            setRatio={setRatio} 
            numberOfImages={numberOfImages} 
            setNumberOfImages={setNumberOfImages}
            CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
          />
          
          {/* Style selection */}
          <StylePanel 
            style={style} 
            setStyle={setStyle} 
          />
          
          {/* Advanced settings (LoRA scale, seed) */}
          <AdvancedSettingsPanel 
            loraScale={loraScale} 
            setLoraScale={setLoraScale} 
            seed={seed} 
            setSeed={setSeed} 
          />
          
          {/* Generate button + credit info */}
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
