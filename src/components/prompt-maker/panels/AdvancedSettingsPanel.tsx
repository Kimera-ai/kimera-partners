
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { GenerationSettings } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type AdvancedSettingsPanelProps = Pick<GenerationSettings, "loraScale" | "setLoraScale" | "seed" | "setSeed">;

export const AdvancedSettingsPanel = ({ 
  loraScale, 
  setLoraScale, 
  seed, 
  setSeed 
}: AdvancedSettingsPanelProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Label htmlFor="loraScale" className="text-sm font-medium text-white/80">LoRA Scale</Label>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 max-w-xs text-white">
                <p>Controls the strength of style adaptation. Higher values make the style more prominent, while lower values produce more subtle effects.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs text-white/70">{loraScale}</span>
        </div>
        <Slider
          id="loraScale"
          min={0}
          max={1}
          step={0.1}
          value={[parseFloat(loraScale)]}
          onValueChange={(values) => setLoraScale(values[0].toString())}
          className="bg-[#141220]"
        />
      </div>
      
      <div className="space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor="seed" className="text-sm font-medium text-white/80">Seed</Label>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 max-w-xs text-white">
              <p>Seed determines the initial randomness of the generation. Use -1 for random results, or set a specific number to recreate the same image later.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input 
          id="seed" 
          type="number" 
          value={seed} 
          onChange={(e) => setSeed(e.target.value)}
          min={-1}
          placeholder="-1 for random"
          className="bg-[#141220] border-white/10 text-white"
        />
      </div>
      
      {/* Hiding Private Mode toggle */}
    </div>
  );
};
