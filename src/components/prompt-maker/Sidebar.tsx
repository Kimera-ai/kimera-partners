
import React from "react";
import { WorkflowPanel } from "./panels/WorkflowPanel";
import { RatioAndImagesPanel } from "./panels/RatioAndImagesPanel";
import { StylePanel } from "./panels/StylePanel";
import { AdvancedSettingsPanel } from "./panels/AdvancedSettingsPanel";
import { GenerationSettings, ImageSettings } from "./types";
import { ChevronDown } from "lucide-react";

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
    <div className="w-full h-full bg-[#1A1625] p-4 space-y-3 overflow-y-auto">
      {/* Workflow Panel (Mode/Preset in the image) */}
      <div className="bg-[#1D1A27] rounded-lg border border-purple-500/20">
        <WorkflowPanel 
          workflow={workflow} 
          setWorkflow={setWorkflow}
          imagePreview={imagePreview}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
        />
      </div>
      
      {/* Prompt Enhance (similar to the image) */}
      <div className="bg-[#1D1A27] rounded-lg border border-purple-500/20">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19L19 12L22 15L15 22L12 19Z" fill="currentColor"/>
                  <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" fill="currentColor"/>
                  <circle cx="7.5" cy="7.5" r="2.5" fill="currentColor"/>
                </svg>
              </span>
              <span className="text-sm text-white/80 font-medium">Prompt Enhance</span>
            </div>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          <div className="mt-2">
            <select className="w-full bg-[#141220] border border-white/10 rounded text-white/90 text-sm py-1.5 px-2">
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Style Panel */}
      <div className="bg-[#1D1A27] rounded-lg border border-purple-500/20">
        <StylePanel 
          style={style} 
          setStyle={setStyle} 
        />
      </div>
      
      {/* Image Dimensions Panel */}
      <div className="bg-[#1D1A27] rounded-lg border border-purple-500/20">
        <RatioAndImagesPanel 
          ratio={ratio} 
          setRatio={setRatio} 
          numberOfImages={numberOfImages} 
          setNumberOfImages={setNumberOfImages}
          CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
        />
      </div>
      
      {/* Advanced Settings Panel */}
      <div className="bg-[#1D1A27] rounded-lg border border-purple-500/20 mb-8">
        <div className="p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/80 font-medium">Advanced Settings</span>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </div>
          <div className="mt-2 space-y-3">
            <AdvancedSettingsPanel 
              loraScale={loraScale} 
              setLoraScale={setLoraScale} 
              seed={seed} 
              setSeed={setSeed} 
            />
          </div>
        </div>
      </div>
      
      {/* Reset to Defaults Button at the bottom */}
      <div className="fixed bottom-4 left-0 w-[260px] px-4">
        <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md 
          bg-[#1D1A27] border border-white/10 text-white/70 hover:bg-[#252031] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          <span className="text-sm">Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
};
