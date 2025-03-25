
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GenerationSettings } from "../types";

interface RatioAndImagesPanelProps extends Pick<GenerationSettings, "ratio" | "setRatio" | "numberOfImages" | "setNumberOfImages"> {
  CREDITS_PER_GENERATION: number;
}

export const RatioAndImagesPanel: React.FC<RatioAndImagesPanelProps> = ({ 
  ratio, 
  setRatio, 
  numberOfImages, 
  setNumberOfImages,
  CREDITS_PER_GENERATION
}) => {
  const [showImages, setShowImages] = useState(true);
  
  // Ensure ratio is never empty or "Default"
  const displayRatio = ratio && ratio !== "Default" ? ratio : "2:3";
  
  // If the ratio is empty or "Default", set it to a proper value
  if (!ratio || ratio === "Default") {
    setRatio("2:3");
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5ZM19 19H5V5H19V19Z" fill="currentColor"/>
              <path d="M18 16V10H16V16H18ZM12 16V10H10V16H12ZM6 16V10H8V16H6Z" fill="currentColor"/>
            </svg>
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <span className="text-sm text-white/80 font-medium">Image Settings</span>
                <HelpCircle size={14} className="text-white/60" />
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 text-white max-w-[300px]">
                <p className="text-sm">Configure how many images to generate per prompt and set the aspect ratio of the generated images</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </div>
      <div className="mt-2 space-y-3">
        <div>
          <Label htmlFor="ratio" className="text-xs text-white/60 mb-1.5 block">
            Aspect Ratio
          </Label>
          <Select value={displayRatio} onValueChange={setRatio}>
            <SelectTrigger id="ratio" className="w-full bg-[#141220] border-white/10 text-white">
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent className="bg-[#1D1A27] border-white/10 text-white">
              <SelectItem value="1:1">Square (1:1)</SelectItem>
              <SelectItem value="3:2">Landscape (3:2)</SelectItem>
              <SelectItem value="2:3">Portrait (2:3)</SelectItem>
              <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
              <SelectItem value="9:16">Vertical (9:16)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="numberOfImages" className="text-xs text-white/60 mb-1.5 block">
            Number of Images ({CREDITS_PER_GENERATION} credits each)
          </Label>
          <Select value={numberOfImages} onValueChange={setNumberOfImages}>
            <SelectTrigger id="numberOfImages" className="w-full bg-[#141220] border-white/10 text-white">
              <SelectValue placeholder="Number of images" />
            </SelectTrigger>
            <SelectContent className="bg-[#1D1A27] border-white/10 text-white">
              <SelectItem value="1">1 Image</SelectItem>
              <SelectItem value="2">2 Images</SelectItem>
              <SelectItem value="4">4 Images</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
