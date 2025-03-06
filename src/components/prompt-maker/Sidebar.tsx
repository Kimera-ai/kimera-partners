
import React from "react";
import { WorkflowPanel } from "./panels/WorkflowPanel";
import { RatioAndImagesPanel } from "./panels/RatioAndImagesPanel";
import { StylePanel } from "./panels/StylePanel";
import { AdvancedSettingsPanel } from "./panels/AdvancedSettingsPanel";
import { GenerationSettings, ImageSettings } from "./types";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const { toast } = useToast();

  const handleResetDefaults = () => {
    // Reset all settings to their default values
    setWorkflow("no-reference");
    setRatio("2:3");
    setStyle("Photographic");
    setLoraScale("0.5");
    setSeed("random");
    setNumberOfImages("1");
    
    // If there's an image preview, remove it
    if (imagePreview) {
      // Create a synthetic React MouseEvent instead of using the native MouseEvent
      // We're creating an empty object and casting it to the type React expects
      const syntheticEvent = {} as React.MouseEvent<Element, MouseEvent>;
      removeImage(syntheticEvent);
    }
    
    // Show confirmation toast
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
      duration: 3000
    });
  };

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
      
      {/* Hiding Prompt Enhance section */}
      
      {/* Style Panel */}
      <div className="bg-[#1D1A27] rounded-lg border border-purple-500/20">
        <StylePanel 
          style={style} 
          setStyle={setStyle} 
        />
      </div>
      
      {/* Hiding Image Dimensions Panel but keeping Number of Images functionality */}
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-white/80 font-medium">Advanced Settings</span>
                    <HelpCircle size={14} className="text-white/60" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 text-white">
                  <p>Fine-tune your generation with advanced parameters like LoRA Scale and Seed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md 
                  bg-[#1D1A27] border border-white/10 text-white/70 hover:bg-[#252031] transition-colors"
                onClick={handleResetDefaults}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span className="text-sm">Reset to Defaults</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#242038] border-purple-500/30 text-white">
              <p>Restore all settings to their default values</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
