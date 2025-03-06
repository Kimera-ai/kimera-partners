
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings, ImageSettings } from "../types";
import { ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type WorkflowPanelProps = Pick<GenerationSettings, "workflow" | "setWorkflow"> & 
  Pick<ImageSettings, "imagePreview" | "isUploading" | "handleImageUpload" | "removeImage">;

export const WorkflowPanel = ({ workflow, setWorkflow, imagePreview, isUploading, handleImageUpload, removeImage }: WorkflowPanelProps) => {
  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15V17M6 7V19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7M6 7H18M6 7H4M18 7H20M14 7V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V7M10 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-sm text-white/80 font-medium">Mode / Preset</TooltipTrigger>
              <TooltipContent side="right" className="bg-[#242038] border-purple-500/30">
                <p>Select generation mode: <br />
                • Image Generator: Create images from scratch <br />
                • Reference Mode: Generate based on a reference image <br />
                • Cartoonify: Convert your image to cartoon style</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ChevronDown className="w-4 h-4 text-white/60" />
      </div>
      <div className="mt-2">
        <Select value={workflow} onValueChange={setWorkflow}>
          <SelectTrigger id="workflow" className="w-full bg-[#141220] border-white/10 text-white">
            <SelectValue placeholder="Select workflow" />
          </SelectTrigger>
          <SelectContent className="bg-[#1D1A27] border-white/10 text-white">
            <SelectItem value="no-reference">Image Generator</SelectItem>
            <SelectItem value="with-reference">Reference Mode</SelectItem>
            <SelectItem value="cartoon">Cartoonify</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
