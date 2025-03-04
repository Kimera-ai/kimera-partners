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
type PromptInputPanelProps = PromptSettings & ImageSettings & {
  isProcessing: boolean;
  workflow: string;
};

// Custom Magic Wand SVG component
const MagicWandIcon = () => <svg width="16" height="16" viewBox="0 0 31 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1270_1546)">
      <path d="M7.90323 24.4028H6.80566V26.0262H7.90323V24.4028Z" fill="currentColor" />
      <path d="M24.7761 9.44951L26.107 7.04129L28.5405 5.72433L26.107 4.40738L24.7761 1.99916L23.4453 4.40738L21.0118 5.72433L23.4453 7.04129L24.7761 9.44951ZM24.2539 5.20884L24.7761 4.26504L25.2984 5.20884L26.2521 5.72562L25.2984 6.2424L24.7761 7.18619L24.2539 6.2424L23.3002 5.72562L24.2539 5.20884Z" fill="currentColor" />
      <path d="M5.02909 12.9362L5.08222 10.2189L6.6087 7.95944L3.86285 7.90558L1.57961 6.39499L1.52648 9.11226L0 11.3717L2.74585 11.4243L5.02909 12.9349V12.9362ZM2.61886 9.45208L2.63959 8.40313L3.52075 8.98659L4.58074 9.00711L3.99114 9.87909L3.97041 10.928L3.08924 10.3446L2.02926 10.3241L2.61886 9.45208Z" fill="currentColor" />
      <path d="M11.8257 6.70275C13.7798 8.63651 15.4307 13.3093 15.4307 16.9076H16.5282C16.5282 12.999 14.7672 8.07742 12.6019 5.93464L11.8257 6.70275Z" fill="currentColor" />
      <path d="M10.2512 8.20309L11.7168 5.55122L14.3966 4.1009L11.7168 2.65058L10.2512 0L8.78566 2.65186L6.1059 4.10218L8.78566 5.5525L10.2512 8.20437V8.20309ZM9.59555 3.45204L10.2512 2.2646L10.9069 3.45204L12.1069 4.1009L10.9069 4.74976L10.2512 5.9372L9.59555 4.74976L8.39562 4.1009L9.59555 3.45204Z" fill="currentColor" />
      <path d="M27.8706 14.1429C26.1199 13.1708 23.7926 12.4566 21.1103 12.0629C21.683 10.3959 22.4838 8.90709 23.3546 8.04536L22.5784 7.27724C20.6762 9.15971 19.129 13.4799 19.129 16.9076H20.2265C20.2265 15.7176 20.4351 14.3916 20.785 13.1131C23.3767 13.4799 25.6871 14.1762 27.3328 15.0892C28.9889 16.0086 29.9011 17.1089 29.9011 18.1886C29.9011 19.5184 28.5224 20.8623 26.1173 21.874C23.5283 22.964 20.0749 23.5642 16.3922 23.5642C12.7094 23.5642 9.25607 22.964 6.66701 21.874C4.26196 20.8623 2.88321 19.5184 2.88321 18.1886C2.88321 16.3664 5.45801 14.5788 9.46729 13.5966C10.6543 14.725 11.7376 16.0779 12.4295 17.3923L13.4027 16.8896C11.8218 13.8915 8.47599 10.8101 5.94394 10.0227L5.61481 11.0601C6.48949 11.332 7.49375 11.936 8.47987 12.731C4.26585 13.9031 1.78564 15.9073 1.78564 18.1899C1.78564 20.0031 3.36655 21.6663 6.2368 22.8755C8.95803 24.0219 12.5656 24.6529 16.3922 24.6529C19.4827 24.6529 22.4281 24.2412 24.8811 23.4795V28.0164C24.8811 30.1438 24.101 31.6518 22.4955 32.6251C21.0882 33.4792 19.0344 33.9126 16.3922 33.9126C13.75 33.9126 11.6974 33.4792 10.2888 32.6251C8.68461 31.6505 7.90323 30.1438 7.90323 28.0164V27.3855H6.80567V28.0164C6.80567 30.5182 7.78402 32.3802 9.71479 33.5522C11.2983 34.5127 13.544 35 16.3922 35C19.2404 35 21.4861 34.5127 23.0696 33.5522C25.0003 32.3802 25.9787 30.5182 25.9787 28.0164V23.1025C26.1718 23.0294 26.3622 22.9538 26.5475 22.8755C29.4178 21.6663 30.9987 20.0031 30.9987 18.1899C30.9987 16.6793 29.9167 15.2803 27.8706 14.1441V14.1429Z" fill="currentColor" />
      <path d="M6.16556 17.8052L5.38806 18.5733C5.66148 18.8439 6.49988 19.544 8.39178 20.1967C10.6102 20.9623 13.4507 21.3842 16.3909 21.3842C19.3311 21.3842 22.1729 20.9623 24.3913 20.1967C24.5235 20.1506 24.6557 20.1031 24.784 20.0557L24.3939 19.0401C24.276 19.085 24.1529 19.1286 24.0311 19.1709C21.9267 19.8967 19.2132 20.298 16.3922 20.298C13.5712 20.298 10.859 19.898 8.75461 19.1709C7.03117 18.5759 6.3379 17.9757 6.16556 17.8052Z" fill="currentColor" />
      <path d="M27.3963 18.5733L26.6188 17.8052C26.4983 17.9245 26.2106 18.1719 25.6456 18.4771L26.1717 19.4299C26.8235 19.0773 27.1967 18.7682 27.395 18.572L27.3963 18.5733Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_1270_1546">
        <rect width="31" height="35" fill="white" />
      </clipPath>
    </defs>
  </svg>;
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
  return <div>
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
        <Input id="reference-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading || workflow === 'no-reference'} ref={fileInputRef} />
        <div className="relative flex">
          <div className="absolute top-0 bottom-0 left-0 w-24 flex flex-col justify-center items-center gap-4 border-r border-white/10 z-10 px-0 py-0 my-0 mx-0">
            <ImagePreview imagePreview={imagePreview} isUploading={isUploading} isProcessing={isProcessing} onRemove={removeImage} disabled={workflow === 'no-reference'} />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="h-12 w-12 rounded-md bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 transition-all flex items-center justify-center" onClick={handleImprovePrompt} disabled={isImprovingPrompt || !prompt.trim()}>
                    {isImprovingPrompt ? <Loader2 className="h-5 w-5 animate-spin text-white/70" /> : <MagicWandIcon />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Enhance your prompt with AI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Textarea id="prompt" placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..." value={prompt} onChange={e => setPrompt(e.target.value)} className="min-h-32 resize-none border-white/10 text-white pl-28 bg-zinc-800" />
        </div>
      </div>
    </div>;
};