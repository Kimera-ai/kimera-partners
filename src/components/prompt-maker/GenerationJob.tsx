
import { Clock, Loader2, Share2, Check, AlertTriangle } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedImageData {
  url: string;
  seed: string | null;
  pipeline_id: string | null;
}

export interface GenerationJobType {
  id: string;
  status: string;
  completedImages: number;
  totalImages: number;
  generatedImages: (GeneratedImageData | null)[];
  isCompleted: boolean;
  displayImages: boolean;
  startTime: number;
  elapsedTime: number;
  error?: string | null;
}

interface GenerationJobProps {
  job: GenerationJobType;
  formatTime: (milliseconds: number) => string;
  handleDownload: (imageUrl: string) => Promise<void>;
  onImageClick?: (imageData: GeneratedImageData) => void;
}

export const GenerationJobComponent = forwardRef<HTMLDivElement, GenerationJobProps>(
  ({ job, formatTime, handleDownload, onImageClick }, ref) => {
    const validImages = job.generatedImages.filter(img => img !== null) as GeneratedImageData[];
    const { toast } = useToast();
    const [copiedImageUrl, setCopiedImageUrl] = useState<string | null>(null);
    
    console.log(`Job ${job.id}: completed=${job.isCompleted}, validImages=${validImages.length}`);
    
    const getGridClass = (imageCount: number) => {
      switch (imageCount) {
        case 1: return "grid-cols-1";
        case 2: return "grid-cols-1 sm:grid-cols-2";
        case 3: return "grid-cols-1 sm:grid-cols-3";
        default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      }
    };

    const handleShare = async (imageUrl: string) => {
      try {
        // Create a shareable link from the image URL
        await navigator.clipboard.writeText(imageUrl);
        
        // Set copied state to show feedback
        setCopiedImageUrl(imageUrl);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setCopiedImageUrl(null);
        }, 2000);
        
        toast({
          title: "Link copied!",
          description: "Image link has been copied to clipboard",
          duration: 3000
        });
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link to clipboard",
          duration: 3000
        });
      }
    };

    // Always show images if we have valid images, regardless of job completion status
    // This is key to fixing the issue where some images don't display
    const shouldShowImages = validImages.length > 0;

    return (
      <Card ref={ref} className={`p-4 bg-card/40 backdrop-blur border ${job.error ? 'border-red-500/20' : 'border-white/5'} shadow-md mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {!job.isCompleted && job.completedImages < job.totalImages ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            ) : job.error ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            )}
            <div className={`font-medium ${job.error ? 'text-red-500' : ''}`}>
              {job.status}
              {job.totalImages > 0 && !job.error && (
                <span className="text-muted-foreground ml-1 text-sm">
                  ({job.completedImages}/{job.totalImages} images)
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(job.elapsedTime)}</span>
          </div>
        </div>
        
        {job.error && job.completedImages === 0 && (
          <div className="mt-2 text-sm text-red-400 bg-red-950/20 p-3 rounded-lg">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {job.error}
            </p>
            <p className="mt-1 text-xs text-red-300/70">
              Try again with a different prompt or settings.
            </p>
          </div>
        )}
        
        {shouldShowImages && (
          <div className={`grid ${getGridClass(validImages.length)} gap-3 mt-3`}>
            {validImages.map((imageData, index) => (
              <div 
                key={index} 
                className="relative group rounded-md overflow-hidden bg-black aspect-[3/4] cursor-pointer"
                onClick={() => onImageClick && onImageClick(imageData)}
              >
                <img 
                  src={imageData.url} 
                  alt={`Generated ${index}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Handle image loading error
                    console.error(`Failed to load image at ${imageData.url}`);
                    e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Image+Failed+to+Load';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(imageData.url);
                    }}
                    title="Download image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button 
                    className={`bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors ${copiedImageUrl === imageData.url ? 'bg-green-500/50 text-white' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(imageData.url);
                    }}
                    title="Copy image link"
                  >
                    {copiedImageUrl === imageData.url ? (
                      <Check size={20} />
                    ) : (
                      <Share2 size={20} />
                    )}
                  </button>
                </div>
                {job.error && job.isCompleted && (
                  <div className="absolute bottom-0 left-0 right-0 bg-amber-500/20 text-amber-200 text-xs py-1 px-2">
                    Image {index + 1} generated successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {job.error && job.completedImages > 0 && (
          <div className="mt-3 text-sm text-amber-400 bg-amber-950/20 p-2.5 rounded-lg">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {job.error}
            </p>
            <p className="mt-1 text-xs text-amber-300/70">
              {job.completedImages} of {job.totalImages} images were successfully generated.
            </p>
          </div>
        )}
      </Card>
    );
  }
);

GenerationJobComponent.displayName = "GenerationJobComponent";
