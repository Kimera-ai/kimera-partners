import React, { useEffect, useState, useRef } from 'react';
import { Download, X, Video, Share, ZoomIn, ZoomOut, Maximize2, MousePointer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';

interface PromptDialogProps {
  showPromptDialog: boolean;
  setShowPromptDialog: (show: boolean) => void;
  selectedGeneration: any | null;
  handleDownload: (imageUrl: string) => Promise<void>;
}

export const PromptDialog: React.FC<PromptDialogProps> = ({
  showPromptDialog,
  setShowPromptDialog,
  selectedGeneration,
  handleDownload
}) => {
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [magnifyEnabled, setMagnifyEnabled] = useState(false);
  const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 });
  const [magnifyZoom, setMagnifyZoom] = useState(2);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Determine if the media is a video based on either the explicit flag or the URL extension
  const isVideo = selectedGeneration?.is_video === true || 
    (selectedGeneration?.image_url && /\.(mp4|webm|mov)($|\?)/.test(selectedGeneration?.image_url.toLowerCase()));

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  // Consistent display of workflow labels
  const getWorkflowLabel = (workflowValue: string | undefined, isVideoMedia: boolean = false) => {
    // If it's a video, always return "Video Generator" regardless of other settings
    if (isVideoMedia) return "Video Generator";
    
    // Default to "Image Generator" if no workflow specified
    if (!workflowValue) return "Image Generator";
    
    // Normalize the workflow string for consistent comparison
    const normalizedWorkflow = String(workflowValue).toLowerCase().trim();
    
    // Explicit matching for known workflow types
    if (normalizedWorkflow === "with-reference") return "Face Gen";
    if (normalizedWorkflow === "cartoon") return "Reference Mode";
    if (normalizedWorkflow === "video") return "Video Generator";
    if (normalizedWorkflow === "no-reference") return "Image Generator";
    
    // Default case: capitalize and clean up the workflow name
    return workflowValue.charAt(0).toUpperCase() + workflowValue.slice(1).replace(/-/g, ' ');
  };

  const handleShareImage = async () => {
    if (!selectedGeneration?.image_url) {
      toast.error("No image URL available to share");
      return;
    }

    try {
      // First try using the Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this image generated with Kimera',
          text: selectedGeneration.prompt ? `${selectedGeneration.prompt.substring(0, 50)}...` : 'Generated with Kimera',
          url: selectedGeneration.image_url
        });
        toast.success("Shared successfully!");
        return;
      }

      // Fallback to clipboard if Web Share API is not available
      await navigator.clipboard.writeText(selectedGeneration.image_url);
      toast.success("Image URL copied to clipboard!");
    } catch (error) {
      console.error("Error sharing image:", error);
      toast.error("Failed to share image");
      
      // Try clipboard as a last resort if sharing failed
      try {
        await navigator.clipboard.writeText(selectedGeneration.image_url);
        toast.success("Image URL copied to clipboard instead!");
      } catch (clipboardError) {
        toast.error("Unable to share or copy image URL");
      }
    }
  };

  // Toggle fullscreen preview
  const toggleFullscreenPreview = () => {
    setFullscreenPreview(!fullscreenPreview);
    setMagnifyEnabled(false); // Disable magnify when toggling fullscreen
  };

  // Toggle magnify glass
  const toggleMagnify = () => {
    setMagnifyEnabled(!magnifyEnabled);
  };

  // Handle zoom level change
  const increaseZoom = () => {
    setMagnifyZoom(prev => Math.min(prev + 0.5, 5));
  };

  const decreaseZoom = () => {
    setMagnifyZoom(prev => Math.max(prev - 0.5, 1.5));
  };

  // Handle mouse movement for magnifying glass
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnifyEnabled || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    
    // Calculate position relative to image
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMagnifyPosition({ x, y });
  };

  // Close fullscreen on escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenPreview) {
        setFullscreenPreview(false);
        setMagnifyEnabled(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [fullscreenPreview]);

  // Fixed: Close dialog when dialog is closed
  useEffect(() => {
    if (!showPromptDialog) {
      setFullscreenPreview(false);
      setMagnifyEnabled(false);
    }
  }, [showPromptDialog]);

  // Ensure workflow is properly set when component mounts or selectedGeneration changes
  useEffect(() => {
    if (selectedGeneration) {
      console.log("Selected generation workflow:", selectedGeneration.workflow);
      
      // Only override workflow if it's a video and doesn't already have video workflow
      if (isVideo && selectedGeneration.workflow !== 'video') {
        selectedGeneration.workflow = 'video';
      }
      
      // Ensure workflow has a valid value
      if (!selectedGeneration.workflow || selectedGeneration.workflow === 'undefined') {
        selectedGeneration.workflow = isVideo ? 'video' : 'no-reference';
      }
    }
  }, [selectedGeneration, isVideo]);

  // Handle clicking outside the image in fullscreen mode to close it
  const handleFullscreenBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not on the image
    if (e.target === e.currentTarget) {
      setFullscreenPreview(false);
      setMagnifyEnabled(false);
    }
  };

  return (
    <>
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="sm:max-w-4xl bg-background/95 backdrop-blur-md border-white/10">
          <DialogHeader>
            <DialogTitle>Generation Details</DialogTitle>
            <DialogDescription>
              Generated at {selectedGeneration?.created_at ? formatDate(selectedGeneration.created_at) : 'Unknown date'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-black/20 rounded-md overflow-hidden flex items-center justify-center relative">
              {isVideo ? (
                <>
                  <video 
                    src={selectedGeneration?.image_url} 
                    className="w-full h-full object-contain" 
                    controls 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    <span>Video</span>
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={selectedGeneration?.image_url} 
                    alt="Generated" 
                    className="w-full h-full object-contain cursor-zoom-in" 
                    onClick={toggleFullscreenPreview}
                    onError={(e) => {
                      console.error(`Error loading image: ${selectedGeneration?.image_url}`);
                      e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Image+Failed+to+Load';
                    }}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 right-2 p-1 h-auto bg-black/40 hover:bg-black/60"
                    onClick={toggleFullscreenPreview}
                  >
                    <Maximize2 className="h-4 w-4 text-white" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Generation Settings</h3>
                <Separator className="bg-white/10" />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Mode:</span>
                    <div className="font-medium text-purple-400">
                      {getWorkflowLabel(selectedGeneration?.workflow, isVideo)}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Style:</span>
                    <div className="font-medium">{selectedGeneration?.style || 'Default'}</div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ratio:</span>
                    <div className="font-medium">{selectedGeneration?.ratio || 'Default'}</div>
                  </div>
                  
                  {selectedGeneration?.lora_scale && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">LoRA Scale:</span>
                      <div className="font-medium">{selectedGeneration?.lora_scale}</div>
                    </div>
                  )}
                  
                  {selectedGeneration?.seed && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Seed:</span>
                      <div className="font-medium">{selectedGeneration?.seed === '-1' ? 'Random' : selectedGeneration?.seed}</div>
                    </div>
                  )}
                  
                  {selectedGeneration?.user_id && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">User ID:</span>
                      <div className="font-medium truncate" title={selectedGeneration?.user_id}>
                        {selectedGeneration?.user_id.substring(0, 8)}...
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Prompt</h3>
                <Separator className="bg-white/10" />
                <div className="text-sm bg-black/20 p-3 rounded-md whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                  {selectedGeneration?.prompt || 'No prompt data available'}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-wrap gap-2 justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowPromptDialog(false)}
            >
              <X className="h-4 w-4 mr-2" /> Close
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={handleShareImage}
              >
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => selectedGeneration?.image_url && handleDownload(selectedGeneration.image_url)}
              >
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Preview Dialog with Magnifying Glass */}
      {fullscreenPreview && selectedGeneration?.image_url && !isVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center cursor-zoom-out"
          onClick={handleFullscreenBackdropClick}
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white bg-black/40 hover:bg-black/60"
                  aria-label="Magnify options"
                >
                  <ZoomIn className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-52 p-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Magnifying Glass</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enable</span>
                    <Button 
                      variant={magnifyEnabled ? "default" : "outline"} 
                      size="sm"
                      onClick={toggleMagnify}
                      className="h-8"
                    >
                      {magnifyEnabled ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Zoom Level</span>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={decreaseZoom}
                        disabled={magnifyZoom <= 1.5}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 text-sm">{magnifyZoom}x</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7" 
                        onClick={increaseZoom}
                        disabled={magnifyZoom >= 5}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white bg-black/40 hover:bg-black/60"
              onClick={() => setFullscreenPreview(false)}
              aria-label="Close fullscreen preview"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div 
            className="relative max-w-[95vw] max-h-[95vh] overflow-auto"
            onMouseMove={handleMouseMove}
          >
            <img 
              ref={imageRef}
              src={selectedGeneration.image_url} 
              alt="Full size preview" 
              className="max-w-none max-h-none object-contain" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent clicks on the image from closing the preview
                if (magnifyEnabled) {
                  // If magnify is enabled, clicking should not toggle fullscreen
                  return;
                }
              }}
              onError={(e) => {
                console.error(`Error loading fullscreen image: ${selectedGeneration.image_url}`);
                e.currentTarget.src = 'https://placehold.co/1200x1600/191223/404040?text=Image+Failed+to+Load';
              }}
            />
            
            {/* Magnifying Glass */}
            {magnifyEnabled && (
              <div 
                className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg overflow-hidden"
                style={{
                  width: '150px',
                  height: '150px',
                  top: `${magnifyPosition.y * 100}%`,
                  left: `${magnifyPosition.x * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${selectedGeneration.image_url})`,
                  backgroundPosition: `${magnifyPosition.x * 100}% ${magnifyPosition.y * 100}%`,
                  backgroundSize: `${magnifyZoom * 100}%`,
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-white/20"></div>
                  <div className="h-0.5 w-full bg-white/20 absolute"></div>
                </div>
              </div>
            )}
            
            {/* Magnify instructions indicator */}
            {magnifyEnabled && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-2 rounded-full flex items-center">
                <MousePointer className="h-3 w-3 mr-1" />
                <span>Move cursor to magnify</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
