
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { GenerationSettings } from "../types";
import { Info, Square, RectangleHorizontal, RectangleVertical } from "lucide-react";

type RatioAndImagesPanelProps = Pick<GenerationSettings, "ratio" | "setRatio" | "numberOfImages" | "setNumberOfImages"> & {
  CREDITS_PER_GENERATION: number;
};

// Helper component to render aspect ratio icon based on ratio value
const AspectRatioIcon = ({ ratio }: { ratio: string }) => {
  switch (ratio) {
    case "1:1":
      return <Square className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />;
    case "4:3":
    case "16:9":
    case "3:2":
      return <RectangleHorizontal className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />;
    case "3:4":
    case "2:3":
      return <RectangleVertical className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />;
    default:
      return <Square className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />;
  }
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
            <SelectValue placeholder="Select ratio">
              {ratio && (
                <div className="flex items-center">
                  <AspectRatioIcon ratio={ratio} />
                  <span>{getAspectRatioLabel(ratio)}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background border-white/10 text-white">
            <SelectItem value="1:1" className="flex items-center group">
              <Square className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />
              <span>Square (1:1)</span>
            </SelectItem>
            <SelectItem value="4:3" className="flex items-center group">
              <RectangleHorizontal className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />
              <span>Landscape (4:3)</span>
            </SelectItem>
            <SelectItem value="3:4" className="flex items-center group">
              <RectangleVertical className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />
              <span>Portrait (3:4)</span>
            </SelectItem>
            <SelectItem value="16:9" className="flex items-center group">
              <RectangleHorizontal className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />
              <span>Widescreen (16:9)</span>
            </SelectItem>
            <SelectItem value="2:3" className="flex items-center group">
              <RectangleVertical className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />
              <span>Portrait (2:3)</span>
            </SelectItem>
            <SelectItem value="3:2" className="flex items-center group">
              <RectangleHorizontal className="h-5 w-5 mr-2 text-white/80 group-hover:text-[#FF2B6E]" />
              <span>Landscape (3:2)</span>
            </SelectItem>
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

// Helper function to get the label text
const getAspectRatioLabel = (ratio: string): string => {
  switch (ratio) {
    case "1:1":
      return "Square (1:1)";
    case "4:3":
      return "Landscape (4:3)";
    case "3:4":
      return "Portrait (3:4)";
    case "16:9":
      return "Widescreen (16:9)";
    case "2:3":
      return "Portrait (2:3)";
    case "3:2":
      return "Landscape (3:2)";
    default:
      return ratio;
  }
};
