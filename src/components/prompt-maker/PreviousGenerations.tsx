
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Play, Video } from "lucide-react";

interface PreviousGenerationsProps {
  previousGenerations: any[];
  handleImageClick: (generation: any) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const PreviousGenerations = ({ 
  previousGenerations, 
  handleImageClick,
  isHistoryOpen,
  setIsHistoryOpen
}: PreviousGenerationsProps) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  
  if (previousGenerations.length === 0) return null;
  
  const getGridClass = (imageCount: number) => {
    if (imageCount <= 2) return "grid-cols-1";
    if (imageCount <= 4) return "grid-cols-2";
    return "grid-cols-2 md:grid-cols-3";
  };

  const resetPointerEvents = () => {
    document.body.style.pointerEvents = '';
    setTimeout(() => {
      document.body.style.pointerEvents = '';
    }, 300);
  };
  
  // Check if an URL is a video (ends with common video extensions)
  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov)($|\?)/.test(url.toLowerCase());
  };

  // Get a valid thumbnail for videos or return the original URL for images
  const getThumbnailUrl = (url: string) => {
    if (!isVideoUrl(url)) return url;
    
    // Try to create a thumbnail URL by replacing video extension with jpg
    const baseUrl = url.replace(/\.[^/.]+$/, '');
    return `${baseUrl}.jpg`;
  };
  
  return (
    <Drawer 
      open={isHistoryOpen} 
      onOpenChange={(open) => {
        setIsHistoryOpen(open);
        if (!open) {
          resetPointerEvents();
          setPlayingVideo(null); // Stop any playing videos when drawer closes
        }
      }}
      direction="right"
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
            <path d="M26.331 8.70901C26.249 8.60501 26.129 8.53801 25.997 8.52201L20.106 7.82401L19.447 2.09301C19.431 1.96101 19.365 1.84101 19.26 1.75901C19.156 1.67701 19.025 1.63801 18.893 1.65401L2.00503 3.59501C1.73103 3.62601 1.53403 3.87401 1.56603 4.14901L3.62203 22.031C3.63703 22.163 3.70403 22.283 3.80803 22.365C3.89703 22.435 4.00703 22.473 4.11903 22.473C4.13803 22.473 4.15703 22.473 4.17603 22.47L7.77203 22.057L7.55303 23.906C7.53703 24.038 7.57503 24.17 7.65703 24.275C7.73903 24.379 7.85903 24.446 7.99003 24.462L23.886 26.346C23.906 26.348 23.926 26.349 23.946 26.349C24.195 26.349 24.412 26.162 24.441 25.908L26.436 9.07701C26.452 8.94501 26.415 8.81201 26.332 8.70801L26.331 8.70901ZM20.444 10.768L23.291 11.105L22.079 21.333L18.138 20.866L21.062 20.53C21.336 20.499 21.534 20.251 21.502 19.976L20.444 10.769V10.768ZM2.61603 4.53101L18.511 2.70401L20.452 19.593L13.828 20.354L13.789 20.349C13.705 20.339 13.627 20.356 13.553 20.385L4.55703 21.419L2.61603 4.53101ZM23.506 25.294L8.60403 23.528L8.79303 21.94L13.826 21.361L22.459 22.384C22.479 22.386 22.499 22.387 22.519 22.387C22.768 22.387 22.985 22.2 23.014 21.946L24.344 10.726C24.36 10.594 24.323 10.461 24.24 10.357C24.157 10.253 24.038 10.186 23.906 10.17L20.328 9.74601L20.224 8.84401L25.383 9.45501L23.506 25.293V25.294Z" fill="currentColor"/>
            <path d="M18.619 16.784C18.893 16.753 19.091 16.505 19.059 16.23L17.689 4.309C17.673 4.177 17.607 4.057 17.502 3.975C17.398 3.893 17.265 3.853 17.135 3.87L4.21902 5.355C3.94502 5.386 3.74802 5.634 3.78002 5.909L4.69302 13.856L5.15002 17.83C5.16502 17.962 5.23202 18.082 5.33602 18.164C5.42502 18.234 5.53502 18.272 5.64702 18.272C5.66602 18.272 5.68502 18.272 5.70402 18.269L18.619 16.784ZM5.71102 13.947L8.76702 10.097L15.424 16.145L6.08702 17.218L5.71102 13.947ZM16.743 15.993L13.586 13.124L14.956 11.398L17.793 13.976L18.008 15.847L16.743 15.992V15.993ZM16.753 4.919L17.62 12.468L15.233 10.299C15.129 10.206 14.995 10.158 14.856 10.171C14.718 10.182 14.591 10.25 14.505 10.359L12.844 12.452L9.04402 8.999C8.94102 8.906 8.80402 8.864 8.66702 8.871C8.52902 8.882 8.40202 8.95 8.31602 9.059L5.54902 12.544L4.83102 6.292L16.753 4.921V4.919Z" fill="currentColor"/>
            <path d="M12.628 8.978C12.896 9.191 13.221 9.304 13.558 9.304C13.616 9.304 13.674 9.301 13.732 9.294C14.13 9.249 14.486 9.05 14.735 8.736C14.984 8.422 15.096 8.03 15.05 7.632C15.004 7.234 14.806 6.878 14.493 6.629C14.18 6.379 13.785 6.268 13.389 6.314C12.991 6.359 12.635 6.558 12.386 6.872C12.136 7.185 12.025 7.578 12.071 7.976C12.116 8.374 12.315 8.73 12.629 8.979L12.628 8.978ZM13.169 7.493C13.252 7.389 13.371 7.323 13.503 7.307C13.523 7.305 13.542 7.304 13.561 7.304C13.673 7.304 13.782 7.341 13.871 7.412C13.975 7.495 14.041 7.614 14.057 7.747C14.072 7.879 14.035 8.01 13.952 8.114C13.869 8.218 13.75 8.285 13.618 8.3C13.488 8.315 13.355 8.278 13.25 8.195C13.146 8.112 13.079 7.993 13.064 7.861C13.049 7.729 13.086 7.598 13.169 7.493Z" fill="currentColor"/>
          </svg>
          <span>Creations</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] w-[90vw] md:w-[450px] right-0 left-auto rounded-l-lg">
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary">
                <path d="M26.331 8.70901C26.249 8.60501 26.129 8.53801 25.997 8.52201L20.106 7.82401L19.447 2.09301C19.431 1.96101 19.365 1.84101 19.26 1.75901C19.156 1.67701 19.025 1.63801 18.893 1.65401L2.00503 3.59501C1.73103 3.62601 1.53403 3.87401 1.56603 4.14901L3.62203 22.031C3.63703 22.163 3.70403 22.283 3.80803 22.365C3.89703 22.435 4.00703 22.473 4.11903 22.473C4.13803 22.473 4.15703 22.473 4.17603 22.47L7.77203 22.057L7.55303 23.906C7.53703 24.038 7.57503 24.17 7.65703 24.275C7.73903 24.379 7.85903 24.446 7.99003 24.462L23.886 26.346C23.906 26.348 23.926 26.349 23.946 26.349C24.195 26.349 24.412 26.162 24.441 25.908L26.436 9.07701C26.452 8.94501 26.415 8.81201 26.332 8.70801L26.331 8.70901ZM20.444 10.768L23.291 11.105L22.079 21.333L18.138 20.866L21.062 20.53C21.336 20.499 21.534 20.251 21.502 19.976L20.444 10.769V10.768ZM2.61603 4.53101L18.511 2.70401L20.452 19.593L13.828 20.354L13.789 20.349C13.705 20.339 13.627 20.356 13.553 20.385L4.55703 21.419L2.61603 4.53101ZM23.506 25.294L8.60403 23.528L8.79303 21.94L13.826 21.361L22.459 22.384C22.479 22.386 22.499 22.387 22.519 22.387C22.768 22.387 22.985 22.2 23.014 21.946L24.344 10.726C24.36 10.594 24.323 10.461 24.24 10.357C24.157 10.253 24.038 10.186 23.906 10.17L20.328 9.74601L20.224 8.84401L25.383 9.45501L23.506 25.293V25.294Z" fill="currentColor"/>
                <path d="M18.619 16.784C18.893 16.753 19.091 16.505 19.059 16.23L17.689 4.309C17.673 4.177 17.607 4.057 17.502 3.975C17.398 3.893 17.265 3.853 17.135 3.87L4.21902 5.355C3.94502 5.386 3.74802 5.634 3.78002 5.909L4.69302 13.856L5.15002 17.83C5.16502 17.962 5.23202 18.082 5.33602 18.164C5.42502 18.234 5.53502 18.272 5.64702 18.272C5.66602 18.272 5.68502 18.272 5.70402 18.269L18.619 16.784ZM5.71102 13.947L8.76702 10.097L15.424 16.145L6.08702 17.218L5.71102 13.947ZM16.743 15.993L13.586 13.124L14.956 11.398L17.793 13.976L18.008 15.847L16.743 15.992V15.993ZM16.753 4.919L17.62 12.468L15.233 10.299C15.129 10.206 14.995 10.158 14.856 10.171C14.718 10.182 14.591 10.25 14.505 10.359L12.844 12.452L9.04402 8.999C8.94102 8.906 8.80402 8.864 8.66702 8.871C8.52902 8.882 8.40202 8.95 8.31602 9.059L5.54902 12.544L4.83102 6.292L16.753 4.921V4.919Z" fill="currentColor"/>
                <path d="M12.628 8.978C12.896 9.191 13.221 9.304 13.558 9.304C13.616 9.304 13.674 9.301 13.732 9.294C14.13 9.249 14.486 9.05 14.735 8.736C14.984 8.422 15.096 8.03 15.05 7.632C15.004 7.234 14.806 6.878 14.493 6.629C14.18 6.379 13.785 6.268 13.389 6.314C12.991 6.359 12.635 6.558 12.386 6.872C12.136 7.185 12.025 7.578 12.071 7.976C12.116 8.374 12.315 8.73 12.629 8.979L12.628 8.978ZM13.169 7.493C13.252 7.389 13.371 7.323 13.503 7.307C13.523 7.305 13.542 7.304 13.561 7.304C13.673 7.304 13.782 7.341 13.871 7.412C13.975 7.495 14.041 7.614 14.057 7.747C14.072 7.879 14.035 8.01 13.952 8.114C13.869 8.218 13.75 8.285 13.618 8.3C13.488 8.315 13.355 8.278 13.25 8.195C13.146 8.112 13.079 7.993 13.064 7.861C13.049 7.729 13.086 7.598 13.169 7.493Z" fill="currentColor"/>
              </svg>
              <h3 className="text-lg font-medium">Previous Creations</h3>
            </div>
            <DrawerClose asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-8 w-8 p-0"
                onClick={resetPointerEvents}
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </DrawerClose>
          </div>
          
          <div className={`grid ${getGridClass(previousGenerations.length)} gap-4`}>
            {previousGenerations.map((generation, index) => {
              const isVideo = isVideoUrl(generation.image_url);
              const thumbnailUrl = getThumbnailUrl(generation.image_url);
              
              return (
                <div 
                  key={index} 
                  className="relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all bg-black/20"
                  onClick={() => {
                    handleImageClick(generation);
                    setIsHistoryOpen(false);
                    resetPointerEvents();
                  }}
                >
                  <img 
                    src={thumbnailUrl} 
                    alt={`Generated ${index}`} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Media';
                    }}
                  />
                  
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 text-white p-3 rounded-full">
                        <Play className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                  
                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
