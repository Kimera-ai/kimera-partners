import React, { useState } from "react";
import { ChevronRight, Clock, Play, Video } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
interface PreviousGenerationsProps {
  previousGenerations: any[];
  handleImageClick: (generation: any) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}
export const PreviousGenerations: React.FC<PreviousGenerationsProps> = ({
  previousGenerations,
  handleImageClick,
  isHistoryOpen,
  setIsHistoryOpen
}) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  // Helper function to check if URL is a video
  const isVideoUrl = (url: string | undefined) => {
    if (!url) return false;
    return /\.(mp4|webm|mov)($|\?)/.test(url.toLowerCase());
  };
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  // Create a fallback image URL for video thumbnails
  const getVideoThumbnail = (videoUrl: string) => {
    // Try to create a thumbnail URL by replacing .mp4 with .jpg or .png
    if (videoUrl.endsWith('.mp4')) {
      // First try jpg extension
      return videoUrl.replace('.mp4', '.jpg');
    }
    // If not a .mp4 file or thumbnail fetch fails, onError will use the placeholder
    return videoUrl;
  };
  const toggleVideoPlayback = (videoUrl: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setPlayingVideo(playingVideo === videoUrl ? null : videoUrl);
  };
  return <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="fixed right-0 top-1/2 -translate-y-1/2 bg-card/30 backdrop-blur-md border-l border-t border-b border-white/10 hover:bg-card/50 rounded-r-none py-8 px-2 z-10">
          <div className="flex flex-col items-center">
            <Clock className="h-4 w-4 mb-1" />
            <span className="text-xs whitespace-nowrap rotate-90">1</span>
          </div>
          <ChevronRight className="h-4 w-4 absolute -right-1 opacity-60" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 bg-card/95 backdrop-blur border-white/10 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Previous Generations</h2>
            <p className="text-sm text-muted-foreground">Your previous image and video generations</p>
          </div>
          
          {previousGenerations.length === 0 ? <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground">No previous generations found</p>
              </div>
            </div> : <div className="flex-1 overflow-y-auto scrollbar-none">
              <div className="p-3 grid grid-cols-2 gap-3">
                {previousGenerations.map((generation, index) => {
              const isVideo = isVideoUrl(generation.image_url);
              return <div key={index} className="relative group rounded-md overflow-hidden bg-black cursor-pointer aspect-[3/4]" onClick={() => handleImageClick(generation)}>
                      {isVideo ? <>
                          {playingVideo === generation.image_url ? <video src={generation.image_url} className="w-full h-auto max-h-[600px] object-contain" autoPlay loop controls onClick={e => e.stopPropagation()} /> : <>
                              <img src={getVideoThumbnail(generation.image_url)} alt={`Generated video ${index}`} className="w-full h-full object-cover" onError={e => {
                      console.error(`Failed to load video thumbnail for ${generation.image_url}`);
                      e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Video';
                    }} />
                              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <Video className="h-3 w-3" />
                                <span>Video</span>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <button className="bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors" onClick={e => toggleVideoPlayback(generation.image_url, e)}>
                                  <Play className="h-5 w-5" />
                                </button>
                              </div>
                            </>}
                        </> : <img src={generation.image_url} alt={`Generated ${index}`} className="w-full h-full object-cover" />}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-xs text-white">
                        <div className="line-clamp-2 mb-1">
                          {generation.prompt || "No prompt"}
                        </div>
                        <div className="text-white/60">
                          {formatDate(generation.created_at)}
                        </div>
                      </div>
                    </div>;
            })}
              </div>
            </div>}
          
          <div className="p-3 border-t border-white/10">
            <Button variant="outline" className="w-full border-white/10" onClick={() => setIsHistoryOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};