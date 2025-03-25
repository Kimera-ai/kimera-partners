import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  
  const refreshCountRef = React.useRef<number>(0);
  const isInitialMount = React.useRef(true);
  const autoRefreshTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const processedUrls = useRef(new Set<string>());

  useEffect(() => {
    if (!isHistoryOpen) {
      setPlayingVideo(null);
      
      if (autoRefreshTimerRef.current) {
        clearTimeout(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    } else if (isInitialMount.current) {
      console.log(`History panel opened, found ${previousGenerations.length} items`);
      isInitialMount.current = false;
      refreshCountRef.current++;
    }
  }, [isHistoryOpen, previousGenerations.length]);

  useEffect(() => {
    setPlayingVideo(null);
  }, [refreshTrigger]);

  useEffect(() => {
    if (isHistoryOpen) {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshTime;
      
      if (timeSinceLastRefresh > 10000 || lastRefreshTime === 0) {
        console.log(`Auto-refreshing history (time since last: ${timeSinceLastRefresh}ms, count: ${refreshCountRef.current})`);
        
        if (autoRefreshTimerRef.current) {
          clearTimeout(autoRefreshTimerRef.current);
        }
        
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

  useEffect(() => {
    if (previousGenerations.length > 0) {
      console.log(`PreviousGenerations received ${previousGenerations.length} items`);
      console.log(`First item timestamp: ${previousGenerations[0]?.created_at}`);
    }
  }, [previousGenerations]);

  const handleManualRefresh = useCallback(async () => {
    if (!isHistoryOpen || internalRefreshing || isRefreshingHistory) return;
    
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    setInternalRefreshing(true);
    
    try {
      await manualRefreshHistory();
      setLastRefreshTime(Date.now());
      refreshCountRef.current++;
    } catch (error) {
      console.error("Manual refresh error:", error);
      toast.error("Failed to refresh history");
    } finally {
      const timer = setTimeout(() => {
        setInternalRefreshing(false);
      }, 2000);
      
      setDebounceTimer(timer);
    }
  }, [isHistoryOpen, internalRefreshing, isRefreshingHistory, manualRefreshHistory, debounceTimer]);

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

  const getWorkflowLabel = useCallback((workflow: string | undefined, isVideo: boolean = false) => {
    if (isVideo) return "Video Generator";
    
    if (!workflow) return "Image Generator";
    
    switch(workflow) {
      case "with-reference": return "Face Gen";
      case "cartoon": return "Reference Mode";
      case "video": return "Video Generator";
      case "no-reference": return "Image Generator";
      default: return workflow.charAt(0).toUpperCase() + workflow.slice(1).replace(/-/g, ' ');
    }
  }, []);

  const uniqueGenerations = useMemo(() => {
    console.log(`Deduplicating ${previousGenerations.length} history items`);
    
    processedUrls.current.clear();
    
    const idMap = new Map<string, any>();
    
    previousGenerations.forEach(generation => {
      if (!generation.image_url) return;
      
      if (generation.id) {
        if (generation.is_video === true) {
          generation.workflow = 'video';
        } else if (!generation.workflow) {
          generation.workflow = 'no-reference';
        }
        
        idMap.set(generation.id, generation);
      }
    });
    
    previousGenerations.forEach(generation => {
      if (!generation.image_url) return;
      
      if (generation.id && idMap.has(generation.id)) return;
      
      const normalizedUrl = generation.image_url.split('?')[0];
      
      if (!processedUrls.current.has(normalizedUrl)) {
        if (generation.is_video === true) {
          generation.workflow = 'video';
        } else if (!generation.workflow) {
          generation.workflow = 'no-reference';
        }
        
        const compositeKey = `url-${normalizedUrl}`;
        idMap.set(compositeKey, generation);
        processedUrls.current.add(normalizedUrl);
      }
    });
    
    const uniqueItems = Array.from(idMap.values());
    console.log(`After strong deduplication: ${uniqueItems.length} unique items`);
    console.log("Sample workflows:", uniqueItems.slice(0, 3).map(item => item.workflow));
    
    return uniqueItems;
  }, [previousGenerations]);

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="fixed right-0 top-1/2 -translate-y-1/2 bg-card/30 backdrop-blur-md border-l border-t border-b border-white/10 hover:bg-card/50 rounded-r-none z-10 px-0 py-[54px] mx-0 my-[236px]">
          <div className="flex flex-col items-center">
            <span className="whitespace-nowrap rotate-90 text-sm text-primary hover:text-white transition-colors">History</span>
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
              {uniqueGenerations.length > 0 && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
            </Button>
          </div>
          
          {uniqueGenerations.length === 0 ? (
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
                {uniqueGenerations.map((generation, index) => {
                  const isVideoFlag = generation.is_video === true || generation.is_video === 'true' || generation.is_video === 1;
                  const urlSuggestsVideo = isVideoUrl(generation.image_url);
                  const isVideo = isVideoFlag || urlSuggestsVideo;
                  
                  if (isVideo && generation.workflow !== 'video') {
                    generation.workflow = 'video';
                  }
                  
                  const workflowLabel = getWorkflowLabel(generation.workflow, isVideo);
                  
                  const imageUrl = generation.image_url;
                  if (!imageUrl) return null;
                  
                  const itemKey = generation.id || 
                    `${imageUrl.split('?')[0]}-${index}`;
                  
                  return (
                    <div 
                      key={itemKey}
                      className="relative group rounded-md overflow-hidden bg-black cursor-pointer aspect-[3/4]" 
                      onClick={() => handleImageClick(generation)}
                    >
                      {isVideo ? (
                        <>
                          <video 
                            src={imageUrl} 
                            className="w-full h-full object-cover" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            onClick={e => e.stopPropagation()} 
                            onError={(e) => {
                              console.error(`Failed to load video at ${imageUrl}`);
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
                            console.error(`Failed to load image at ${imageUrl}`);
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
