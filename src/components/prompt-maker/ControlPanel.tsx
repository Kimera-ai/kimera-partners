
import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ImagePreview } from "./ImagePreview";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  imagePreview: string | null;
  isUploading: boolean;
  isProcessing: boolean;
  isImprovingPrompt: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeImage: (e: React.MouseEvent) => void;
  handleImprovePrompt: () => Promise<void>;
  handleGenerate: () => Promise<void>;
  workflow: string;
  setWorkflow: (workflow: string) => void;
  ratio: string;
  setRatio: (ratio: string) => void;
  style: string;
  setStyle: (style: string) => void;
  loraScale: string;
  setLoraScale: (loraScale: string) => void;
  seed: string;
  setSeed: (seed: string) => void;
  numberOfImages: string;
  setNumberOfImages: (numberOfImages: string) => void;
  credits: number | null;
  isLoadingCredits: boolean;
  uploadedImageUrl: string | null;
}

export const ControlPanel = ({
  prompt,
  setPrompt,
  imagePreview,
  isUploading,
  isProcessing,
  isImprovingPrompt,
  handleImageUpload,
  removeImage,
  handleImprovePrompt,
  handleGenerate,
  workflow,
  setWorkflow,
  ratio,
  setRatio,
  style,
  setStyle,
  loraScale,
  setLoraScale,
  seed,
  setSeed,
  numberOfImages,
  setNumberOfImages,
  credits,
  isLoadingCredits,
  uploadedImageUrl
}: ControlPanelProps) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const CREDITS_PER_GENERATION = 14;
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <Card className="p-6 bg-card/60 backdrop-blur border border-white/5 shadow-lg">
      <div className="space-y-4">
        {/* First row of dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workflow" className="text-sm font-medium block text-white/80">Workflow</Label>
            <Select value={workflow} onValueChange={setWorkflow}>
              <SelectTrigger id="workflow" className="w-full bg-background/50 border-white/10 text-white">
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10 text-white">
                <SelectItem value="no-reference">Basic image generation</SelectItem>
                <SelectItem value="with-reference">Basic with image reference</SelectItem>
                <SelectItem value="cartoon">Cartoon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ratio" className="text-sm font-medium block text-white/80">Aspect Ratio</Label>
            <Select value={ratio} onValueChange={setRatio}>
              <SelectTrigger id="ratio" className="w-full bg-background/50 border-white/10 text-white">
                <SelectValue placeholder="Select ratio" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10 text-white">
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                <SelectItem value="2:3">Portrait (2:3)</SelectItem>
                <SelectItem value="3:2">Landscape (3:2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second row of dropdowns */}
        <div className="grid grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label htmlFor="numberOfImages" className="text-sm font-medium block text-white/80">
              Number of Images
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1 text-xs text-muted-foreground underline cursor-help">
                      (costs {CREDITS_PER_GENERATION} credits per image)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Each image costs {CREDITS_PER_GENERATION} credits to generate.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select value={numberOfImages} onValueChange={setNumberOfImages}>
              <SelectTrigger id="numberOfImages" className="w-full bg-background/50 border-white/10 text-white">
                <SelectValue placeholder="Select number of images" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/10 text-white">
                <SelectItem value="1">1 image</SelectItem>
                <SelectItem value="2">2 images</SelectItem>
                <SelectItem value="3">3 images</SelectItem>
                <SelectItem value="4">4 images</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Third row of dropdowns */}
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

        {/* Prompt textarea after all dropdown rows */}
        <div>
          <Label htmlFor="prompt" className="text-sm font-medium block text-white/80">Prompt</Label>
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
                  className="h-32 resize-none bg-background/50 border-white/10 text-white pl-14" 
                />
                <div className="absolute bottom-3 left-3 flex space-x-2">
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
                  
                  {(workflow === 'with-reference' || workflow === 'cartoon') && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-primary/70 hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] backdrop-blur-sm" 
                      onClick={triggerFileInput} 
                      disabled={isUploading}
                      type="button"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white" 
          disabled={isUploading || ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) || (credits !== null && credits < CREDITS_PER_GENERATION) || isLoadingCredits}
          onClick={handleGenerate}
          type="button"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading..." : 
            ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) ? "Upload an image" : 
            (credits !== null && credits < CREDITS_PER_GENERATION) ? "Insufficient Credits" : 
            isLoadingCredits ? "Loading Credits..." : 
            "Generate"}
        </Button>

        {credits !== null && credits < CREDITS_PER_GENERATION && (
          <div className="text-sm text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-md">
            You don't have enough credits to generate images. Please contact support@kimera.ai to purchase more credits.
          </div>
        )}
      </div>
    </Card>
  );
};
