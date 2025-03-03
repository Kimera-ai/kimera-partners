
import { Image, X } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImagePreviewProps {
  imagePreview: string | null;
  isUploading: boolean;
  isProcessing: boolean;
  onRemove: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const ImagePreview = ({
  imagePreview,
  isUploading,
  isProcessing,
  onRemove,
  disabled
}: ImagePreviewProps) => {
  if (!imagePreview) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <label htmlFor="reference-image" className={`cursor-pointer block ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="h-16 w-16 rounded-md bg-white/5 backdrop-blur border border-white/10 p-3 hover:bg-white/10 flex items-center justify-center">
                <Image className="h-full w-full text-white/70" />
              </div>
            </label>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add image</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <button 
      type="button" 
      className={`h-16 w-16 rounded-md bg-white/5 backdrop-blur border border-white/10 p-1 hover:bg-white/10 group relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
      onClick={onRemove} 
      disabled={isUploading || isProcessing || disabled}
    >
      <img src={imagePreview} alt="Reference" className="w-full h-full object-cover rounded transition-opacity group-hover:opacity-50" />
      <X className="absolute inset-0 m-auto h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
