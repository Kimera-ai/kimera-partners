
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings, ImageSettings } from "../types";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type WorkflowPanelProps = Pick<GenerationSettings, "workflow" | "setWorkflow"> & 
  Pick<ImageSettings, "imagePreview" | "isUploading" | "handleImageUpload" | "removeImage">;

export const WorkflowPanel = ({ workflow, setWorkflow, imagePreview, isUploading, handleImageUpload, removeImage }: WorkflowPanelProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label htmlFor="workflow" className="text-sm font-medium block text-white/80 text-left">Workflow</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="bg-background/90 border-white/10 text-white">
              <p>Select the workflow mode that best suits your generation needs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={workflow} onValueChange={setWorkflow}>
        <SelectTrigger id="workflow" className="w-full bg-background/50 border-white/10 text-white">
          <SelectValue placeholder="Select workflow" />
        </SelectTrigger>
        <SelectContent className="bg-background border-white/10 text-white">
          <SelectItem value="no-reference">Image Generator (Basic Image Generation – No Character Reference)</SelectItem>
          <SelectItem value="with-reference">Reference Mode (Basic with Image Reference)</SelectItem>
          <SelectItem value="cartoon">Cartoonify (Cartoon & Exaggerated Styles)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
