import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const PromptDialog = ({ 
  showPromptDialog, 
  setShowPromptDialog, 
  selectedGeneration, 
  handleDownload 
}: {
  showPromptDialog: boolean;
  setShowPromptDialog: (open: boolean) => void;
  selectedGeneration: any | null;
  handleDownload: (imageUrl: string) => Promise<void>;
}) => {
  const isVideo = selectedGeneration?.is_video === true || selectedGeneration?.is_video === 'true' || selectedGeneration?.is_video === 1;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown date";
    }
  };

  // Format workflow to display name
  const formatWorkflow = (workflow?: string) => {
    if (!workflow) return "Unknown Mode";
    
    switch (workflow) {
      case "no-reference":
        return "Image Generator";
      case "with-reference":
        return "Face Gen";
      case "cartoon":
        return "Reference Mode";
      case "video":
        return "Video Generator";
      default:
        return workflow.charAt(0).toUpperCase() + workflow.slice(1).replace(/-/g, ' ');
    }
  };

  return (
    <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
      <DialogContent className="sm:max-w-[500px] bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">Generation Details</DialogTitle>
          <DialogDescription>
            Details for this {isVideo ? "video" : "image"} generation
          </DialogDescription>
        </DialogHeader>
        
        {selectedGeneration && (
          <div className="py-4 space-y-4">
            <div className="relative overflow-hidden rounded-md aspect-[3/4] bg-black mx-auto max-w-[300px]">
              {isVideo ? (
                <video 
                  src={selectedGeneration.image_url} 
                  controls 
                  className="w-full h-full object-cover" 
                  autoPlay 
                  muted 
                  loop
                  playsInline
                  onError={() => {
                    console.error(`Failed to load video at ${selectedGeneration.image_url}`);
                  }}
                ></video>
              ) : (
                <img 
                  src={selectedGeneration.image_url} 
                  alt="Selected generation" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image at ${selectedGeneration.image_url}`);
                    e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Image+Failed+to+Load';
                  }}
                />
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Generation Mode</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {formatWorkflow(selectedGeneration.workflow)}
                </div>
              </div>
            
              <div>
                <Label className="text-sm text-muted-foreground">Prompt</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {selectedGeneration.prompt || "No prompt available"}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Style</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {selectedGeneration.style || "No style available"}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Ratio</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {selectedGeneration.ratio || "No ratio available"}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Lora Scale</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {selectedGeneration.lora_scale || "No Lora Scale available"}
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Seed</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {selectedGeneration.seed || "No seed available"}
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Generated On</Label>
                <div className="bg-white/5 rounded-md px-3 py-2 text-sm mt-1">
                  {formatDate(selectedGeneration.created_at)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowPromptDialog(false)} 
            className="flex-1 sm:flex-none"
          >
            Close
          </Button>
          <Button 
            size="sm"
            onClick={() => selectedGeneration && handleDownload(selectedGeneration.image_url)} 
            className="flex-1 sm:flex-none"
          >
            Download {isVideo ? "Video" : "Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
