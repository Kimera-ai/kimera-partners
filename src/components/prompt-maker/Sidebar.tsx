
import React from "react";
import { WorkflowPanel } from "./panels/WorkflowPanel";
import { RatioAndImagesPanel } from "./panels/RatioAndImagesPanel";
import { StylePanel } from "./panels/StylePanel";
import { AdvancedSettingsPanel } from "./panels/AdvancedSettingsPanel";
import { GenerationSettings, ImageSettings } from "./types";

interface SidebarProps extends 
  Pick<GenerationSettings, "workflow" | "setWorkflow" | "ratio" | "setRatio" | "style" | "setStyle" | "loraScale" | "setLoraScale" | "seed" | "setSeed" | "numberOfImages" | "setNumberOfImages">,
  Pick<ImageSettings, "imagePreview" | "isUploading" | "handleImageUpload" | "removeImage"> {
    CREDITS_PER_GENERATION: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
  imagePreview,
  isUploading,
  handleImageUpload,
  removeImage,
  CREDITS_PER_GENERATION
}) => {
  return (
    <div className="w-72 h-full border-l border-white/10 bg-black/20 backdrop-blur-lg p-4 space-y-6 overflow-y-auto">
      <div className="sticky top-0 pb-2 border-b border-white/10">
        <h3 className="text-lg font-medium text-white/90">Settings</h3>
      </div>
      
      <div className="space-y-6">
        {/* Workflow selection */}
        <WorkflowPanel 
          workflow={workflow} 
          setWorkflow={setWorkflow}
          imagePreview={imagePreview}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />
        
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
      </div>
    </div>
  );
};
