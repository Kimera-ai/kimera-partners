
import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Image, AlertCircle } from "lucide-react";
import { PromptSettings, ImageSettings } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PromptInputPanelProps = PromptSettings & 
  Pick<ImageSettings, "imagePreview" | "isUploading" | "handleImageUpload" | "removeImage" | "uploadedImageUrl"> & {
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
  handleImageUpload,
  removeImage,
  isProcessing,
  workflow,
  uploadedImageUrl
}: PromptInputPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const needsImage = workflow === 'with-reference' || workflow === 'cartoon' || workflow === 'video';
  const isIdeogramWorkflow = workflow === 'ideogram';
  const missingRequiredImage = needsImage && !imagePreview;
  
  // Get appropriate enhance tooltip text based on workflow
  const getEnhanceTooltipText = () => {
    if (workflow === 'video') {
      return imagePreview 
        ? "Analyze image and enhance prompt with cinematic details" 
        : "Upload an image first to analyze for video generation";
    }
    if (workflow === 'ideogram') {
      return "Enhance prompt with AI (for Ideogram)";
    }
    return "Enhance prompt with AI";
  };

  // Get enhance button classes based on state
  const getEnhanceButtonClasses = () => {
    const baseClasses = "h-8 w-8 rounded-md flex items-center justify-center transition-colors";
    
    if (isImprovingPrompt || isProcessing) {
      return `${baseClasses} opacity-50 cursor-not-allowed bg-[#242038] border border-purple-500/30`;
    }
    
    if (workflow === 'video') {
      if (!imagePreview) {
        return `${baseClasses} opacity-50 cursor-not-allowed bg-[#242038] border border-purple-500/30`;
      }
      return `${baseClasses} cursor-pointer bg-gradient-to-r from-purple-600 to-amber-500 hover:opacity-90`;
    }
    
    return `${baseClasses} cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90`;
  };

  const getPromptPlaceholder = () => {
    if (missingRequiredImage) {
      return "⚠️ You must upload an image first for this mode";
    }
    
    if (workflow === 'video') {
      return "Describe the scene or action for your video. For example: 'A person walking through a colorful autumn forest with leaves falling around them, soft natural lighting filtering through the trees, camera slowly following from behind.'";
    }
    
    if (workflow === 'ideogram') {
      return "Describe the artistic illustration you want to create with Ideogram. Be detailed about style, elements, and composition.";
    }
    
    return "Generate a high-quality, creative, and engaging image about [specific topic]. The tone should be [tone: fun, professional, mysterious, etc.], and it should include [specific details or constraints]. Make it unique and compelling!";
  };
  
  return (
    <div className="relative flex items-start">
      <div className="absolute left-3 top-3 flex flex-col space-y-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {!imagePreview ? (
                <div 
                  onClick={triggerFileInput} 
                  className={`h-8 w-8 rounded-md flex items-center justify-center 
                    ${(workflow === 'no-reference' || workflow === 'ideogram')
                      ? 'opacity-50 cursor-not-allowed bg-[#242038] border border-purple-500/30' 
                      : 'cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'}
                    ${needsImage ? 'animate-pulse' : ''} 
                    transition-colors`}
                >
                  {needsImage ? (
                    <Image className="h-4 w-4 text-white" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M26.0001 17.25H24.7501C24.7501 17.25 24.7501 16.006 24.7501 16C24.7501 15.0419 23.2501 15.0225 23.2501 16V17.25C23.2501 17.25 22.0043 17.25 22.0001 17.25C21.0597 17.25 21.0079 18.75 22.0001 18.75H23.2501C23.2501 18.75 23.2501 19.9952 23.2501 20C23.2501 20.9452 24.7501 20.9763 24.7501 20V18.75C24.7501 18.75 25.9917 18.75 26 18.75C26.9548 18.75 26.9721 17.25 26.0001 17.25Z" fill="currentColor"/>
                      <path d="M12.25 6.5C12.25 7.74072 13.2593 8.75 14.5 8.75C15.7407 8.75 16.75 7.74072 16.75 6.5C16.75 5.25928 15.7407 4.25 14.5 4.25C13.2593 4.25 12.25 5.25928 12.25 6.5ZM15.25 6.5C15.25 6.91357 14.9136 7.25 14.5 7.25C14.0864 7.25 13.75 6.91357 13.75 6.5C13.75 6.08643 14.0864 5.75 14.5 5.75C14.9136 5.75 15.25 6.08643 15.25 6.5Z" fill="currentColor"/>
                      <path d="M19.8149 11.1328L19.3848 10.5728C18.7168 9.70459 17.2832 9.70459 16.6152 10.5728L13.7707 14.2713L9.38476 8.57275C8.71679 7.70459 7.28271 7.70507 6.61572 8.57226L1.75 14.8876V3C1.75 2.31055 2.31055 1.75 3 1.75H23C23.6895 1.75 24.25 2.31055 24.25 3C24.25 3 24.25 10.0283 24.25 10.0599C24.25 10.9981 25.75 11.046 25.75 10.0601V3C25.75 1.4834 24.5166 0.25 23 0.25H3C1.4834 0.25 0.25 1.4834 0.25 3V17C0.25 18.5166 1.4834 19.75 3 19.75C3 19.75 16.0335 19.75 16.06 19.75C17.0247 19.75 17.0307 18.25 16.0601 18.25H12.6031L17.8047 11.4868C17.9346 11.3179 18.0654 11.3179 18.1953 11.4868C18.1953 11.4868 18.6227 12.0432 18.6255 12.0469C19.1857 12.7756 20.4041 11.8997 19.8149 11.1328ZM10.7107 18.25H3C2.40747 18.25 1.93347 17.8275 1.80536 17.2734L7.80469 9.48682C7.93457 9.31787 8.06494 9.31739 8.1958 9.48731L12.8246 15.5014L10.7107 18.25Z" fill="currentColor"/>
                      <path d="M24 12.25C20.8296 12.25 18.25 14.8296 18.25 18C18.25 21.1704 20.8296 23.75 24 23.75C27.1704 23.75 29.75 21.1704 29.75 18C29.75 14.8296 27.1704 12.25 24 12.25ZM24 22.25C21.6567 22.25 19.75 20.3433 19.75 18C19.75 15.6567 21.6567 13.75 24 13.75C26.3433 13.75 28.25 15.6567 28.25 18C28.25 20.3433 26.3433 22.25 24 22.25Z" fill="currentColor"/>
                    </svg>
                  )}
                </div>
              ) : (
                <button 
                  type="button" 
                  className={`h-8 w-8 rounded-md p-1 group relative ${isUploading || isProcessing || workflow === 'no-reference' || workflow === 'ideogram' ? 'opacity-50 cursor-not-allowed bg-[#242038] border border-purple-500/30' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 cursor-pointer'}`} 
                  onClick={removeImage} 
                  disabled={isUploading || isProcessing || workflow === 'no-reference' || workflow === 'ideogram'}
                >
                  <img src={imagePreview} alt="Reference" className="w-full h-full object-cover rounded transition-opacity group-hover:opacity-50" />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#242038] border-purple-500/30">
              <p>
                {imagePreview 
                  ? "Remove image" 
                  : workflow === 'no-reference'
                    ? "Image not needed for Image Generator mode"
                    : workflow === 'ideogram'
                    ? "Image not needed for Ideogram mode" 
                    : `Upload image (required for ${
                        workflow === 'with-reference' 
                          ? 'Face Gen' 
                          : workflow === 'video' 
                            ? 'Video Generator' 
                            : 'Reference Mode'
                      })`
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Prompt Enhance button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={getEnhanceButtonClasses()}
                onClick={handleImprovePrompt}
                disabled={isImprovingPrompt || isProcessing || (workflow === 'video' && !imagePreview)}
              >
                {isImprovingPrompt ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <MagicWandIcon />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#242038] border-purple-500/30">
              <p>{getEnhanceTooltipText()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Input id="reference-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading || workflow === 'no-reference' || workflow === 'ideogram'} ref={fileInputRef} />
      
      <Textarea 
        id="prompt" 
        placeholder={getPromptPlaceholder()}
        value={prompt} 
        onChange={e => setPrompt(e.target.value)} 
        className={`min-h-32 resize-none bg-[#141220] border-purple-500/20 rounded-lg text-white pl-14 pr-4 ${missingRequiredImage ? 'border-amber-500/50' : ''}`}
      />
      
      {missingRequiredImage && (
        <div className="absolute right-3 top-3">
          <AlertCircle className="text-amber-500 h-5 w-5" />
        </div>
      )}
    </div>
  );
};
