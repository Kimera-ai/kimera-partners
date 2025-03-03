
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type AdvancedSettingsPanelProps = Pick<GenerationSettings, "loraScale" | "setLoraScale" | "seed" | "setSeed">;

export const AdvancedSettingsPanel = ({ 
  loraScale, 
  setLoraScale, 
  seed, 
  setSeed 
}: AdvancedSettingsPanelProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="loraScale" className="text-sm font-medium block text-white/80 text-left">Lora Scale</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-background/90 border-white/10 text-white">
                <p>Controls the strength of the LoRA model adaptation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={loraScale} onValueChange={setLoraScale}>
          <SelectTrigger id="loraScale" className="w-full bg-background/50 border-white/10 text-white">
            <SelectValue placeholder="Select lora scale" />
          </SelectTrigger>
          <SelectContent className="bg-background border-white/10 text-white">
            <SelectItem value="0.1">0.1</SelectItem>
            <SelectItem value="0.2">0.2</SelectItem>
            <SelectItem value="0.3">0.3</SelectItem>
            <SelectItem value="0.4">0.4</SelectItem>
            <SelectItem value="0.5">0.5</SelectItem>
            <SelectItem value="0.6">0.6</SelectItem>
            <SelectItem value="0.7">0.7</SelectItem>
            <SelectItem value="0.8">0.8</SelectItem>
            <SelectItem value="0.9">0.9</SelectItem>
            <SelectItem value="1.0">1.0</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="seed" className="text-sm font-medium block text-white/80 text-left">Seed</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-background/90 border-white/10 text-white">
                <p>Random seed for consistent results across generations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select value={seed} onValueChange={setSeed}>
          <SelectTrigger id="seed" className="w-full bg-background/50 border-white/10 text-white">
            <SelectValue placeholder="Select seed" />
          </SelectTrigger>
          <SelectContent className="bg-background border-white/10 text-white">
            <SelectItem value="random">Random</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
