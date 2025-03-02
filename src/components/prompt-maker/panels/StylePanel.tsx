
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";

type StylePanelProps = Pick<GenerationSettings, "style" | "setStyle">;

export const StylePanel = ({ style, setStyle }: StylePanelProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="style" className="text-sm font-medium block text-white/80">Style</Label>
      <Select value={style} onValueChange={setStyle}>
        <SelectTrigger id="style" className="w-full bg-background/50 border-white/10 text-white">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent className="bg-background border-white/10 text-white">
          <SelectItem value="Photographic">Photographic</SelectItem>
          <SelectItem value="Cinematic">Cinematic</SelectItem>
          <SelectItem value="Anime">Anime</SelectItem>
          <SelectItem value="Digital Art">Digital Art</SelectItem>
          <SelectItem value="Realistic">Realistic</SelectItem>
          <SelectItem value="Oil Painting">Oil Painting</SelectItem>
          <SelectItem value="Watercolor">Watercolor</SelectItem>
          <SelectItem value="Pixel Art">Pixel Art</SelectItem>
          <SelectItem value="Comic Book">Comic Book</SelectItem>
          <SelectItem value="Isometric">Isometric</SelectItem>
          <SelectItem value="Low Poly">Low Poly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
