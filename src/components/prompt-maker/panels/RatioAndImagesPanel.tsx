
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { GenerationSettings, CreditInfo } from "../types";

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
        <Label htmlFor="ratio" className="text-sm font-medium block text-white/80">Aspect Ratio</Label>
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
        <Label htmlFor="numberOfImages" className="text-sm font-medium block text-white/80">
          Number of Images
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-1 text-xs text-muted-foreground underline cursor-help">
                  (costs {CREDITS_PER_GENERATION} credits per image)
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Each image costs {CREDITS_PER_GENERATION} credits to generate.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
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
