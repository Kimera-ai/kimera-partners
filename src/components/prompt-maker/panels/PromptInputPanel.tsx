
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Info } from "lucide-react";
import { ImagePreview } from "../ImagePreview";
import { PromptSettings, ImageSettings } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type PromptInputPanelProps = PromptSettings & 
  ImageSettings & {
    isProcessing: boolean;
    workflow: string;
  };

// Custom Magic Wand SVG component
const MagicWandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1270_1546)">
      <path d="M7.90323 24.4028H6.80566V26.0262H7.90323V24.4028Z" fill="currentColor"/>
      <path d="M24.7761 9.44951L26.107 7.04129L28.5405 5.72433L26.107 4.40738L24.7761 1.99916L23.4453 4.40738L21.0118 5.72433L23.4453 7.04129L24.7761 9.44951ZM24.2539 5.20884L24.7761 4.26504L25.2984 5.20884L26.2521 5.72562L25.2984 6.2424L24.7761 7.18619L24.2539 6.2424L23.3002 5.72562L24.2539 5.20884Z" fill="currentColor"/>
      <path d="M5.02909 12.9362L5.08222 10.2189L6.6087 7.95944L3.86285 7.90558L1.57961 6.39499L1.52648 9.11226L0 11.3717L2.74585 11.4243L5.02909 12.9349V12.9362ZM2.61886 9.45208L2.63959 8.40313L3.52075 8.98659L4.58074 9.00711L3.99114 9.87909L3.97041 10.928L3.08924 10.3446L2.02926 10.3241L2.61886 9.45208Z" fill="currentColor"/>
      <path d="M11.8257 6.70275C13.7798 8.63651 15.4307 13.3093 15.4307 16.9076H16.5282C16.5282 12.999 14.7672 8.07742 12.6019 5.93464L11.8257 6.70275Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_1270_1546">
        <rect width="30.8335" height="35" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export const PromptInputPanel = ({
  prompt,
  setPrompt,
  isImprovingPrompt,
  handleImprovePrompt,
  imagePreview,
  isUploading,
  isProcessing,
  handleImageUpload,
  removeImage,
  workflow,
  uploadedImageUrl
}: PromptInputPanelProps) => {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Label htmlFor="prompt" className="text-sm font-medium block text-white/80 text-left">Prompt</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-white/60 hover:text-white/80 cursor-help transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="bg-background/90 border-white/10 text-white">
              <p>Describe the image you want to generate in detail</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="relative">
        <Input 
          id="reference-image" 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
          disabled={isUploading || workflow === 'no-reference'} 
          ref={fileInputRef}
        />
        <div className="relative">
          <div ref={previewRef} className="absolute left-3 top-3 z-[9999] pointer-events-auto" style={{
            position: 'absolute',
            isolation: 'isolate'
          }}>
            <ImagePreview 
              imagePreview={imagePreview} 
              isUploading={isUploading} 
              isProcessing={isProcessing} 
              onRemove={removeImage} 
              disabled={workflow === 'no-reference'} 
            />
          </div>
          <div className="relative">
            <Textarea 
              id="prompt" 
              placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..." 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              className="h-32 resize-none bg-background/50 border-white/10 text-white pl-28" 
            />
            {/* Vertical divider */}
            <Separator 
              orientation="vertical" 
              className="absolute left-24 top-0 bottom-0 h-full bg-white/10" 
            />
            <div className="absolute bottom-2 left-3">
              <div className="flex flex-col items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-primary/70 hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] backdrop-blur-sm" 
                  onClick={handleImprovePrompt} 
                  disabled={isImprovingPrompt || !prompt.trim()}
                  type="button"
                >
                  {isImprovingPrompt ? <Loader2 className="h-4 w-4 animate-spin" /> : <MagicWandIcon />}
                </Button>
                <span className="text-[10px] text-primary/70 font-medium mt-1 w-full text-center">Magic Prompt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
