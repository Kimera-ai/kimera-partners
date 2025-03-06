
import { Clock, Loader2 } from "lucide-react";
import React, { forwardRef } from "react";
import { Card } from "@/components/ui/card";

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
  displayImages: boolean; // Flag to control when to display images
  startTime: number;
  elapsedTime: number;
}

interface GenerationJobProps {
  job: GenerationJobType;
  formatTime: (milliseconds: number) => string;
  handleDownload: (imageUrl: string) => Promise<void>;
}

export const GenerationJobComponent = forwardRef<HTMLDivElement, GenerationJobProps>(({ job, formatTime, handleDownload }, ref) => {
  // Get non-null images
  const validImages = job.generatedImages.filter(img => img !== null) as GeneratedImageData[];
  
  console.log(`Job ${job.id}: completed=${job.isCompleted}, validImages=${validImages.length}`);
  
  // Determine grid columns based on number of images
  const getGridClass = (imageCount: number) => {
    switch (imageCount) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 sm:grid-cols-2";
      case 3: return "grid-cols-1 sm:grid-cols-3";
      default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Only show the images grid when there are valid images and 
  // either all images are completed OR the displayImages flag is true
  const shouldShowImages = validImages.length > 0 && job.displayImages;

  return (
    <Card ref={ref} className="p-4 bg-card/40 backdrop-blur border border-white/5 shadow-md mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {!job.isCompleted ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <div className="h-4 w-4 rounded-full bg-green-500"></div>
          )}
          <div className="font-medium">
            {job.status} 
            {job.totalImages > 0 && (
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
      
      {/* Display all images when shouldShowImages is true */}
      {shouldShowImages && (
        <div className={`grid ${getGridClass(validImages.length)} gap-3 mt-3`}>
          {validImages.map((imageData, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden bg-black aspect-[3/4]">
              <img 
                src={imageData.url} 
                alt={`Generated ${index}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors"
                  onClick={() => handleDownload(imageData.url)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

GenerationJobComponent.displayName = "GenerationJobComponent";
