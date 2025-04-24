
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";
import { ChevronDown, HelpCircle, LayoutIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RatioAndImagesPanelProps = Pick<GenerationSettings, "ratio" | "setRatio" | "numberOfImages" | "setNumberOfImages" | "workflow"> & {
  CREDITS_PER_GENERATION: number;
};

export const RatioAndImagesPanel = ({ 
  ratio, 
  setRatio, 
  numberOfImages, 
  setNumberOfImages,
  workflow,
  CREDITS_PER_GENERATION
}: RatioAndImagesPanelProps) => {
  const isVideo = workflow === "video";

  return (
    <div className="p-3">
      {isVideo && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="ratio" className="text-sm font-medium text-white/80">Aspect Ratio</Label>
                    <LayoutIcon size={14} className="text-white/60" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 text-white">
                  <p>Choose the aspect ratio for your video</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={ratio} onValueChange={setRatio}>
            <SelectTrigger className="w-full bg-[#141220] border-white/10">
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent className="bg-[#1D1A27] border-purple-500/30">
              <SelectItem value="2:3">Portrait (2:3)</SelectItem>
              <SelectItem value="16:9">Landscape (16:9)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="numberOfImages" className="text-sm font-medium text-white/80">Number of {isVideo ? 'Videos' : 'Images'}</Label>
                  <HelpCircle size={14} className="text-white/60" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 text-white">
                <p>Generate multiple variations in a single generation. Each {isVideo ? 'video' : 'image'} costs {CREDITS_PER_GENERATION} credits.</p>
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
