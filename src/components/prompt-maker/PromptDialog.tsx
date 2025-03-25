
import React, { useEffect } from 'react';
import { Download, X, Video, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  const isVideo = selectedGeneration?.is_video === true || 
    (selectedGeneration?.image_url && /\.(mp4|webm|mov)($|\?)/.test(selectedGeneration?.image_url.toLowerCase()));

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  const getWorkflowLabel = (workflow: string | undefined, isVideo: boolean = false) => {
    // If it's a video, always return "Video Generator"
    if (isVideo) return "Video Generator";
    
    if (!workflow) return "Image Generator";
    
    // Explicit mapping with precise string matching
    if (workflow === "with-reference") return "Face Gen";
    if (workflow === "cartoon") return "Reference Mode";
    if (workflow === "video") return "Video Generator";
    if (workflow === "no-reference") return "Image Generator";
    
    // Default case: capitalize and clean up the workflow name
    return workflow.charAt(0).toUpperCase() + workflow.slice(1).replace(/-/g, ' ');
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

  useEffect(() => {
    if (selectedGeneration) {
      console.log("Selected generation workflow:", selectedGeneration.workflow);
      
      // Only override workflow if it's a video and doesn't already have video workflow
      if (isVideo && selectedGeneration.workflow !== 'video') {
        selectedGeneration.workflow = 'video';
      }
    }
  }, [selectedGeneration, isVideo]);

  return (
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
              <img 
                src={selectedGeneration?.image_url} 
                alt="Generated" 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  console.error(`Error loading image: ${selectedGeneration?.image_url}`);
                  e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Image+Failed+to+Load';
                }}
              />
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
  );
};
