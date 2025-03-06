
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RatioAndImagesPanelProps = Pick<GenerationSettings, "ratio" | "setRatio" | "numberOfImages" | "setNumberOfImages"> & {
  CREDITS_PER_GENERATION: number;
};

export const RatioAndImagesPanel = ({ 
  ratio, 
  setRatio, 
  numberOfImages, 
  setNumberOfImages,
  CREDITS_PER_GENERATION
}: RatioAndImagesPanelProps) => {
  return (
    <div className="p-3">
      {/* Hiding Image Dimensions section */}
      
      <div className="mt-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="numberOfImages" className="text-sm font-medium text-white/80">Number of Images</Label>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 text-white">
                <p>Generate multiple variations in a single generation. Each image costs {CREDITS_PER_GENERATION} credits.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button 
            className={`flex justify-center py-1.5 rounded border ${numberOfImages === '1' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}
            onClick={() => setNumberOfImages('1')}
          >
            <span className="text-xs text-white">1</span>
          </button>
          <button 
            className={`flex justify-center py-1.5 rounded border ${numberOfImages === '2' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}
            onClick={() => setNumberOfImages('2')}
          >
            <span className="text-xs text-white">2</span>
          </button>
          <button 
            className={`flex justify-center py-1.5 rounded border ${numberOfImages === '3' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}
            onClick={() => setNumberOfImages('3')}
          >
            <span className="text-xs text-white">3</span>
          </button>
          <button 
            className={`flex justify-center py-1.5 rounded border ${numberOfImages === '4' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}
            onClick={() => setNumberOfImages('4')}
          >
            <span className="text-xs text-white">4</span>
          </button>
        </div>
      </div>
    </div>
  );
};
