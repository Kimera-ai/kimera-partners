
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Info } from "lucide-react";
import { ImagePreview } from "../ImagePreview";
import { PromptSettings, ImageSettings } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

type PromptInputPanelProps = PromptSettings & 
  ImageSettings & {
    isProcessing: boolean;
    workflow: string;
  };

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
                  {isImprovingPrompt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
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
