
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type StylePanelProps = Pick<GenerationSettings, "style" | "setStyle">;

export const StylePanel = ({ style, setStyle }: StylePanelProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor="style" className="text-sm font-medium block text-white/80 text-left tracking-wide">Style</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="bg-background/90 border-white/10 text-white">
              <p>Choose the visual style for your generated image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={style} onValueChange={setStyle}>
        <SelectTrigger id="style" className="w-full bg-background/50 border-white/10 text-white">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent className="bg-background border-white/10 text-white">
          <SelectItem value="Cinematic">Cinematic</SelectItem>
          <SelectItem value="Animated">Animated</SelectItem>
          <SelectItem value="Digital Art">Digital Art</SelectItem>
          <SelectItem value="Photographic">Photographic</SelectItem>
          <SelectItem value="Fantasy art">Fantasy art</SelectItem>
          <SelectItem value="Neonpunk">Neonpunk</SelectItem>
          <SelectItem value="Enhance">Enhance</SelectItem>
          <SelectItem value="Comic Book">Comic Book</SelectItem>
          <SelectItem value="Lowpoly">Lowpoly</SelectItem>
          <SelectItem value="Line art">Line art</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
