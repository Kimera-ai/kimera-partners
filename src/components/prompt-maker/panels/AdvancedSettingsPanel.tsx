
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { GenerationSettings } from "../types";

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
          <Label htmlFor="loraScale" className="text-sm font-medium text-white/80">LoRA Scale</Label>
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
        <Label htmlFor="seed" className="text-sm font-medium text-white/80">Seed</Label>
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
