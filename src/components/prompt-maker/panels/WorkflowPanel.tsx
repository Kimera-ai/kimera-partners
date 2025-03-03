
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenerationSettings } from "../types";

type WorkflowPanelProps = Pick<GenerationSettings, "workflow" | "setWorkflow">;

export const WorkflowPanel = ({ workflow, setWorkflow }: WorkflowPanelProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="workflow" className="text-sm font-medium block text-white/80 text-left">Workflow</Label>
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
