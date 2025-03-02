
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";

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
        <Label htmlFor="loraScale" className="text-sm font-medium block text-white/80">Lora Scale</Label>
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
        <Label htmlFor="seed" className="text-sm font-medium block text-white/80">Seed</Label>
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
