
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";
import { ChevronDown } from "lucide-react";

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
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15.5V13.25M10.5 15.5V10.5M13.5 15.5V12.25M16.5 15.5V9.5M5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V5.25C21 4.00736 19.9926 3 18.75 3H5.25C4.00736 3 3 4.00736 3 5.25V18.75C3 19.9926 4.00736 21 5.25 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-sm text-white/80 font-medium">Image Dimensions</span>
        </div>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </div>
      
      <div className="mt-3 grid grid-cols-4 gap-2">
        <button className={`flex items-center justify-center aspect-[2/3] rounded-md ${ratio === '2:3' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'} border transition-colors`}>
          <span className="text-xs text-white">2:3</span>
        </button>
        <button className={`flex items-center justify-center aspect-square rounded-md ${ratio === '1:1' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'} border transition-colors`}>
          <span className="text-xs text-white">1:1</span>
        </button>
        <button className={`flex items-center justify-center aspect-[16/9] rounded-md ${ratio === '16:9' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'} border transition-colors`}>
          <span className="text-xs text-white">16:9</span>
        </button>
        <button className={`flex items-center justify-center aspect-square rounded-md bg-[#141220] border-white/10 border transition-colors`}>
          <span className="text-xs text-white">More</span>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button className={`py-1 px-2 rounded-md border ${numberOfImages === '1' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}>
          <span className="text-xs text-white">Small</span>
          <div className="text-[10px] text-white/60">1184×672</div>
        </button>
        <button className={`py-1 px-2 rounded-md border ${numberOfImages === '2' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}>
          <span className="text-xs text-white">Medium</span>
          <div className="text-[10px] text-white/60">1376×784</div>
        </button>
        <button className={`py-1 px-2 rounded-md border ${numberOfImages === '4' ? 'bg-purple-500/30 border-purple-500' : 'bg-[#141220] border-white/10'}`}>
          <span className="text-xs text-white">Large</span>
          <div className="text-[10px] text-white/60">1472×832</div>
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Label htmlFor="numberOfImages" className="text-sm font-medium text-white/80">Number of Images</Label>
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
