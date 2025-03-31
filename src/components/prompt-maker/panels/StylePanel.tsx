
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type StylePanelProps = Pick<GenerationSettings, "style" | "setStyle" | "workflow">;

export const StylePanel = ({ style, setStyle, workflow }: StylePanelProps) => {
  const isVideoWorkflow = workflow === "video";
  const isIdeogramWorkflow = workflow === "ideogram";
  const isDisabled = isVideoWorkflow || isIdeogramWorkflow;
  
  return (
    <div className={`p-3 ${isDisabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 12C2 10.6868 2 10.0302 2.15224 9.45815C2.35523 8.70032 2.83742 8.05964 3.5 7.6C4.01546 7.25596 4.64725 7.09675 5.5 7.04196C5.5 5.76724 5.5 4.63052 5.5 4.25185C5.5 3.55865 5.5 3.21204 5.59513 2.91191C5.86388 2.07289 6.59243 1.5 7.5 1.5C7.81674 1.5 8.17348 1.58841 8.875 1.75661L9.09974 1.82142C9.65612 1.95685 9.93431 2.02457 10.1746 2.11795C10.5425 2.26461 10.8752 2.48224 11.1507 2.75764C11.3389 2.9458 11.5007 3.15876 11.8964 3.67633L12.103 3.954C12.6918 4.72936 12.9862 5.11704 13.171 5.53064C13.4464 6.15305 13.5616 6.83426 13.5 7.5C14.3499 7.5 15.0499 7.5 15.75 7.5C17.1312 7.5 18 8.36883 18 9.75V10.5H19.5C20.8807 10.5 22 11.6193 22 13V16.5C22 17.8807 20.8807 19 19.5 19H17.25M17.25 19V10.5M17.25 19H15.75M15.75 19H5.25C3.73122 19 2.5 17.7688 2.5 16.25V13.75C2.5 12.2312 3.73122 11 5.25 11H15.75M15.75 19V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5">
                <span className="text-sm text-white/80 font-medium">Style</span>
                <HelpCircle size={14} className="text-white/60" />
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#242038] border-purple-500/30 max-w-xs text-white">
                <p>{isIdeogramWorkflow 
                  ? "Style settings are not applicable for Ideogram generation" 
                  : isVideoWorkflow 
                  ? "Style settings are not applicable for video generation" 
                  : "Select visual style for your images: Cinematic, Animated, Digital Art, etc. Each style influences the final look of your generation."}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </div>
      <div className="mt-2">
        <Select 
          value={style} 
          onValueChange={setStyle} 
          disabled={isDisabled}
        >
          <SelectTrigger id="style" className="w-full bg-[#141220] border-white/10 text-white">
            <SelectValue placeholder={isIdeogramWorkflow ? "Not applicable for Ideogram" : isVideoWorkflow ? "Not applicable for videos" : "Select style"} />
          </SelectTrigger>
          <SelectContent className="bg-[#1D1A27] border-white/10 text-white">
            <SelectItem value="Cinematic">Cinematic</SelectItem>
            <SelectItem value="Animated">Animated</SelectItem>
            <SelectItem value="Digital Art">Digital Art</SelectItem>
            <SelectItem value="Photographic">Photographic</SelectItem>
            <SelectItem value="Fantasy art">Fantasy art</SelectItem>
            <SelectItem value="Neonpunk">Neonpunk</SelectItem>
            <SelectItem value="Enhance">Enhance</SelectItem>
            <SelectItem value="Comic book">Comic book</SelectItem>
            <SelectItem value="Lowpoly">Lowpoly</SelectItem>
            <SelectItem value="Line art">Line art</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
