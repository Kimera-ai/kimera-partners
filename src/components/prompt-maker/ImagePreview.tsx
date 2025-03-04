import { X } from "lucide-react";
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
                <svg width="24" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/70">
                  <path d="M26.0001 17.25H24.7501C24.7501 17.25 24.7501 16.006 24.7501 16C24.7501 15.0419 23.2501 15.0225 23.2501 16V17.25C23.2501 17.25 22.0043 17.25 22.0001 17.25C21.0597 17.25 21.0079 18.75 22.0001 18.75H23.2501C23.2501 18.75 23.2501 19.9952 23.2501 20C23.2501 20.9452 24.7501 20.9763 24.7501 20V18.75C24.7501 18.75 25.9917 18.75 26 18.75C26.9548 18.75 26.9721 17.25 26.0001 17.25Z" fill="currentColor"/>
                  <path d="M12.25 6.5C12.25 7.74072 13.2593 8.75 14.5 8.75C15.7407 8.75 16.75 7.74072 16.75 6.5C16.75 5.25928 15.7407 4.25 14.5 4.25C13.2593 4.25 12.25 5.25928 12.25 6.5ZM15.25 6.5C15.25 6.91357 14.9136 7.25 14.5 7.25C14.0864 7.25 13.75 6.91357 13.75 6.5C13.75 6.08643 14.0864 5.75 14.5 5.75C14.9136 5.75 15.25 6.08643 15.25 6.5Z" fill="currentColor"/>
                  <path d="M19.8149 11.1328L19.3848 10.5728C18.7168 9.70459 17.2832 9.70459 16.6152 10.5728L13.7707 14.2713L9.38476 8.57275C8.71679 7.70459 7.28271 7.70507 6.61572 8.57226L1.75 14.8876V3C1.75 2.31055 2.31055 1.75 3 1.75H23C23.6895 1.75 24.25 2.31055 24.25 3C24.25 3 24.25 10.0283 24.25 10.0599C24.25 10.9981 25.75 11.046 25.75 10.0601V3C25.75 1.4834 24.5166 0.25 23 0.25H3C1.4834 0.25 0.25 1.4834 0.25 3V17C0.25 18.5166 1.4834 19.75 3 19.75C3 19.75 16.0335 19.75 16.06 19.75C17.0247 19.75 17.0307 18.25 16.0601 18.25H12.6031L17.8047 11.4868C17.9346 11.3179 18.0654 11.3179 18.1953 11.4868C18.1953 11.4868 18.6227 12.0432 18.6255 12.0469C19.1857 12.7756 20.4041 11.8997 19.8149 11.1328ZM10.7107 18.25H3C2.40747 18.25 1.93347 17.8275 1.80536 17.2734L7.80469 9.48682C7.93457 9.31787 8.06494 9.31739 8.1958 9.48731L12.8246 15.5014L10.7107 18.25Z" fill="currentColor"/>
                  <path d="M24 12.25C20.8296 12.25 18.25 14.8296 18.25 18C18.25 21.1704 20.8296 23.75 24 23.75C27.1704 23.75 29.75 21.1704 29.75 18C29.75 14.8296 27.1704 12.25 24 12.25ZM24 22.25C21.6567 22.25 19.75 20.3433 19.75 18C19.75 15.6567 21.6567 13.75 24 13.75C26.3433 13.75 28.25 15.6567 28.25 18C28.25 20.3433 26.3433 22.25 24 22.25Z" fill="currentColor"/>
                </svg>
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
