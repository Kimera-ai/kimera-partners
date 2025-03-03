
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { GenerationSettings, CreditInfo } from "../types";
import { Info } from "lucide-react";

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
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="ratio" className="text-sm font-medium block text-white/80 text-left">Aspect Ratio</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-background/90 border-white/10 text-white">
                <p>Determines the shape and dimensions of your image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={ratio} onValueChange={setRatio}>
          <SelectTrigger id="ratio" className="w-full bg-background/50 border-white/10 text-white">
            <SelectValue placeholder="Select ratio" />
          </SelectTrigger>
          <SelectContent className="bg-background border-white/10 text-white">
            <SelectItem value="1:1">Square (1:1)</SelectItem>
            <SelectItem value="4:3">Landscape (4:3)</SelectItem>
            <SelectItem value="3:4">Portrait (3:4)</SelectItem>
            <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
            <SelectItem value="2:3">Portrait (2:3)</SelectItem>
            <SelectItem value="3:2">Landscape (3:2)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="numberOfImages" className="text-sm font-medium block text-white/80 text-left">
            Number of Images
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-background/90 border-white/10 text-white">
                <p>Choose how many variations to generate in one batch</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="ml-1 text-xs text-muted-foreground underline cursor-help">
            (costs {CREDITS_PER_GENERATION} credits per image)
          </span>
        </div>
        <Select value={numberOfImages} onValueChange={setNumberOfImages}>
          <SelectTrigger id="numberOfImages" className="w-full bg-background/50 border-white/10 text-white">
            <SelectValue placeholder="Select number of images" />
          </SelectTrigger>
          <SelectContent className="bg-background border-white/10 text-white">
            <SelectItem value="1">1 image</SelectItem>
            <SelectItem value="2">2 images</SelectItem>
            <SelectItem value="3">3 images</SelectItem>
            <SelectItem value="4">4 images</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
