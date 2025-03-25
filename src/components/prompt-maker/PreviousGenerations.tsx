
import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, Video, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HistoryRefreshProps } from "./types";

interface PreviousGenerationsProps extends HistoryRefreshProps {
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
  refreshTrigger,
  isRefreshingHistory = false,
  manualRefreshHistory
}) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  const [emptyHistoryShown, setEmptyHistoryShown] = useState<boolean>(false);
  
  // Fixed: Using a ref to prevent refresh loops
  const refreshCountRef = React.useRef<number>(0);
  const isInitialMount = React.useRef(true);
  const autoRefreshTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset video playback when panel closes
  useEffect(() => {
    if (!isHistoryOpen) {
      setPlayingVideo(null);
      
      // Clear any pending auto-refresh timers when panel closes
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    } else if (isInitialMount.current) {
      console.log(`History panel opened, found ${previousGenerations.length} items`);
      isInitialMount.current = false;
      
      // Only increment refresh count on first panel open
      refreshCountRef.current++;
    }
  }, [isHistoryOpen, previousGenerations.length]);

  // Reset video playback on refresh
  useEffect(() => {
    setPlayingVideo(null);
  }, [refreshTrigger]);

  // Auto-refresh only when panel opens initially or after a long delay
  useEffect(() => {
    if (isHistoryOpen) {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime;
      
      // Fixed: Only refresh if it's been more than 10 seconds since last refresh
      if (timeSinceLastRefresh > 10000 || lastRefreshTime === 0) {
        console.log(`Auto-refreshing history (time since last: ${timeSinceLastRefresh}ms, count: ${refreshCountRef.current})`);
        
        // Clear any existing timers
        if (autoRefreshTimerRef.current) {
          clearTimeout(autoRefreshTimerRef.current);
        }
        
        // Schedule a refresh after a short delay to prevent rapid refreshes
        autoRefreshTimerRef.current = setTimeout(() => {
          if (!isRefreshingHistory) {
            manualRefreshHistory().then(() => {
              setLastRefreshTime(Date.now());
            });
          }
          autoRefreshTimerRef.current = null;
        }, 500);
      }
    }
    
    return () => {
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [isHistoryOpen, isRefreshingHistory, manualRefreshHistory, lastRefreshTime]);

  // Show empty history message only after initial load and certain time
  useEffect(() => {
    if (isHistoryOpen && previousGenerations.length === 0 && !isRefreshingHistory) {
      const timer = setTimeout(() => {
        setEmptyHistoryShown(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else if (previousGenerations.length > 0) {
      setEmptyHistoryShown(false);
    }
  }, [isHistoryOpen, previousGenerations.length, isRefreshingHistory]);

  // Double-check on previous generations changes
  useEffect(() => {
    if (previousGenerations.length > 0) {
      console.log(`PreviousGenerations received ${previousGenerations.length} items`);
      console.log(`First item timestamp: ${previousGenerations[0]?.created_at}`);
    }
  }, [previousGenerations]);

  // Debounced refresh handler with cooldown to prevent rapid clicking
  const handleManualRefresh = useCallback(async () => {
    if (!isHistoryOpen || internalRefreshing || isRefreshingHistory) return;
    
    // Clear any existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set refreshing state immediately for better UX
    setInternalRefreshing(true);
    
    try {
      await manualRefreshHistory();
      setLastRefreshTime(Date.now());
      // Increment refresh count to trigger re-renders
      refreshCountRef.current++;
    } catch (error) {
      console.error("Manual refresh error:", error);
      toast.error("Failed to refresh history");
    } finally {
      // Use a cooldown period to prevent rapid re-clicks
      const timer = setTimeout(() => {
        setInternalRefreshing(false);
      }, 2000);
      
      setDebounceTimer(timer);
    }
  }, [isHistoryOpen, internalRefreshing, isRefreshingHistory, manualRefreshHistory, debounceTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current);
      }
    };
  }, [debounceTimer]);

  const isVideoUrl = useCallback((url: string | undefined, isVideo?: boolean) => {
    if (isVideo === true) return true;
    if (!url) return false;
    return /\.(mp4|webm|mov)($|\?)/.test(url.toLowerCase());
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown date";
    }
  }, []);

  const getWorkflowLabel = useCallback((workflow: string | undefined) => {
    if (!workflow) return "Image Generator";
    
    switch(workflow) {
      case "with-reference": return "Face Gen";
      case "cartoon": return "Reference Mode";
      case "video": return "Video Generator";
      case "no-reference": 
      default: return "Image Generator";
    }
  }, []);

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
              disabled={internalRefreshing || isRefreshingHistory}
              title="Refresh history"
              className="relative"
            >
              <RefreshCw className={`h-4 w-4 ${(internalRefreshing || isRefreshingHistory) ? 'animate-spin' : ''}`} />
              {previousGenerations.length > 0 && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </Button>
          </div>
          
          {previousGenerations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {isRefreshingHistory 
                    ? "Loading history..." 
                    : emptyHistoryShown
                      ? "No previous generations found"
                      : "Checking for generations..."}
                </p>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {emptyHistoryShown
                    ? "Try generating some images or videos first"
                    : "Loading your previous generations"}
                </p>
                
                {isHistoryOpen && emptyHistoryShown && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={handleManualRefresh}
                    disabled={internalRefreshing || isRefreshingHistory}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${(internalRefreshing || isRefreshingHistory) ? 'animate-spin' : ''}`} />
                    Refresh History
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-none">
              <div className="p-3 grid grid-cols-2 gap-3">
                {previousGenerations.map((generation, index) => {
                  const isVideoFlag = generation.is_video === true || generation.is_video === 'true' || generation.is_video === 1;
                  const urlSuggestsVideo = isVideoUrl(generation.image_url);
                  const isVideo = isVideoFlag || urlSuggestsVideo;
                  const workflowLabel = getWorkflowLabel(generation.workflow);
                  
                  // Add cache busting to image URLs
                  const imageUrl = generation.image_url.includes('?') 
                    ? `${generation.image_url}&t=${Date.now()}`
                    : `${generation.image_url}?t=${Date.now()}`;
                  
                  return (
                    <div 
                      key={`${generation.id || index}-${generation.created_at || Date.now()}`}
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
                              console.error(`Failed to load video at ${generation.image_url}`);
                              (e.target as HTMLVideoElement).style.display = 'none';
                              const fallbackImg = document.createElement('img');
                              fallbackImg.src = 'https://placehold.co/600x800/191223/404040?text=Video+Failed+to+Load';
                              fallbackImg.className = 'w-full h-full object-cover';
                              (e.target as HTMLVideoElement).parentNode?.appendChild(fallbackImg);
                            }} 
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <span>Video</span>
                          </div>
                        </>
                      ) : (
                        <img 
                          src={imageUrl} 
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
                        <div className="flex justify-between text-white/60">
                          <span>{formatDate(generation.created_at)}</span>
                          <span className="bg-purple-500/30 px-1 rounded text-white/90">{workflowLabel}</span>
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
