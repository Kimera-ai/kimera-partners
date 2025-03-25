
import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, Video, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface PreviousGenerationsProps {
  previousGenerations: any[];
  handleImageClick: (generation: any) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  refreshTrigger?: number;
}

export const PreviousGenerations: React.FC<PreviousGenerationsProps> = ({
  previousGenerations,
  handleImageClick,
  isHistoryOpen,
  setIsHistoryOpen,
  refreshTrigger
}) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Helper function to check if URL is a video or if is_video flag is set
  const isVideoUrl = (url: string | undefined, isVideo?: boolean) => {
    if (isVideo === true) return true;
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

  // Reset playing video when the sheet is closed
  useEffect(() => {
    if (!isHistoryOpen) {
      setPlayingVideo(null);
    }
  }, [isHistoryOpen]);

  useEffect(() => {
    // Reset playing videos when refresh trigger changes
    setPlayingVideo(null);
  }, [refreshTrigger]);

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    if (!isHistoryOpen || isRefreshing) return;
    
    setIsRefreshing(true);
    console.log("Manual history refresh triggered");
    
    try {
      // Direct database query to bypass any cached data
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (error) {
        console.error("Manual refresh error:", error);
      } else {
        console.log(`Manual refresh loaded ${data?.length || 0} items`);
        if (data && data.length > 0) {
          console.log("Latest generation:", JSON.stringify(data[0]));
        }
      }
    } catch (err) {
      console.error("Error during manual refresh:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [isHistoryOpen, isRefreshing]);

  // Log generations for debugging
  useEffect(() => {
    console.log("Previous generations loaded in component:", previousGenerations.length);
    if (previousGenerations.length > 0) {
      console.log("First generation:", JSON.stringify(previousGenerations[0]));
      
      // Check for is_video flag on all items
      const hasIsVideo = previousGenerations.some(gen => gen.is_video !== undefined);
      console.log("is_video flag exists on generations:", hasIsVideo);
    }
  }, [previousGenerations]);

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="fixed right-0 top-1/2 -translate-y-1/2 bg-card/30 backdrop-blur-md border-l border-t border-b border-white/10 hover:bg-card/50 rounded-r-none z-10 px-0 py-[54px] mx-0 my-[236px]">
          <div className="flex flex-col items-center">
            <span className="whitespace-nowrap rotate-90 text-sm">History</span>
          </div>
          <ChevronRight className="h-4 w-4 absolute -right-1 opacity-60" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 bg-card/95 backdrop-blur border-white/10 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">Previous Generations</h2>
              <p className="text-sm text-muted-foreground">Your previous image and video generations</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refresh history"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {previousGenerations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground">No previous generations found</p>
                {isHistoryOpen && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh History
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-none">
              <div className="p-3 grid grid-cols-2 gap-3">
                {previousGenerations.map((generation, index) => {
                  // Determine if it's a video using both flag and URL
                  const isVideoFlag = generation.is_video === true || generation.is_video === 'true' || generation.is_video === 1;
                  const urlSuggestsVideo = isVideoUrl(generation.image_url);
                  const isVideo = isVideoFlag || urlSuggestsVideo;
                  
                  return (
                    <div 
                      key={`${generation.id || index}-${generation.image_url.substring(0, 20)}`}
                      className="relative group rounded-md overflow-hidden bg-black cursor-pointer aspect-[3/4]" 
                      onClick={() => handleImageClick(generation)}
                    >
                      {isVideo ? (
                        <>
                          <video 
                            src={generation.image_url} 
                            className="w-full h-full object-cover" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            onClick={e => e.stopPropagation()} 
                            onError={(e) => {
                              console.error(`Failed to load video at ${generation.image_url}`, e);
                            }} 
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <span>Video</span>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={generation.image_url} 
                          alt={`Generated ${index}`} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            console.error(`Failed to load image at ${generation.image_url}`);
                            e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Image+Failed+to+Load';
                          }}
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-xs text-white">
                        <div className="line-clamp-2 mb-1">
                          {generation.prompt || "No prompt"}
                        </div>
                        <div className="text-white/60">
                          {formatDate(generation.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="p-3 border-t border-white/10">
            <Button variant="outline" className="w-full border-white/10" onClick={() => setIsHistoryOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
