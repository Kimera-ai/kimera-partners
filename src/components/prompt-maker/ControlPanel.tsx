
import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { WorkflowPanel } from "./panels/WorkflowPanel";
import { StylePanel } from "./panels/StylePanel";
import { RatioAndImagesPanel } from "./panels/RatioAndImagesPanel";
import { AdvancedSettingsPanel } from "./panels/AdvancedSettingsPanel";
import { PromptInputPanel } from "./panels/PromptInputPanel";
import { GenerateButtonPanel } from "./panels/GenerateButtonPanel";

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  imagePreview: string | null;
  isUploading: boolean;
  isProcessing: boolean;
  isImprovingPrompt: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: (e: React.MouseEvent) => void;
  handleImprovePrompt: () => Promise<void>;
  handleGenerate: () => Promise<void>;
  workflow: string;
  setWorkflow: (workflow: string) => void;
  ratio: string;
  setRatio: (ratio: string) => void;
  style: string;
  setStyle: (style: string) => void;
  loraScale: string;
  setLoraScale: (loraScale: string) => void;
  seed: string;
  setSeed: (seed: string) => void;
  numberOfImages: string;
  setNumberOfImages: (numberOfImages: string) => void;
  credits: number | null;
  isLoadingCredits: boolean;
  uploadedImageUrl: string | null;
}

export const ControlPanel = ({
  prompt,
  setPrompt,
  imagePreview,
  isUploading,
  isProcessing,
  isImprovingPrompt,
  handleImageUpload,
  removeImage,
  handleImprovePrompt,
  handleGenerate,
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
  credits,
  isLoadingCredits,
  uploadedImageUrl
}: ControlPanelProps) => {
  const CREDITS_PER_GENERATION = 14;
  
  return (
    <Card className="p-6 bg-card/60 backdrop-blur border border-white/5 shadow-lg max-w-2xl mx-auto">
      <div className="space-y-4">
        <PromptInputPanel 
          prompt={prompt}
          setPrompt={setPrompt}
          isImprovingPrompt={isImprovingPrompt}
          handleImprovePrompt={handleImprovePrompt}
          imagePreview={imagePreview}
          isUploading={isUploading}
          isProcessing={isProcessing}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          workflow={workflow}
          uploadedImageUrl={uploadedImageUrl}
        />

        <WorkflowPanel 
          workflow={workflow} 
          setWorkflow={setWorkflow} 
        />

        <StylePanel 
          style={style} 
          setStyle={setStyle} 
        />

        <RatioAndImagesPanel 
          ratio={ratio}
          setRatio={setRatio}
          numberOfImages={numberOfImages}
          setNumberOfImages={setNumberOfImages}
          CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
        />

        <AdvancedSettingsPanel 
          loraScale={loraScale}
          setLoraScale={setLoraScale}
          seed={seed}
          setSeed={setSeed}
        />

        <GenerateButtonPanel 
          isUploading={isUploading}
          workflow={workflow}
          uploadedImageUrl={uploadedImageUrl}
          credits={credits}
          CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
          isLoadingCredits={isLoadingCredits}
          isProcessing={isProcessing}
          handleGenerate={handleGenerate}
        />
      </div>
    </Card>
  );
};
