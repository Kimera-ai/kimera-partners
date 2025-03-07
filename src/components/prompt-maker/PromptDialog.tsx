
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptDialogProps {
  showPromptDialog: boolean;
  setShowPromptDialog: (open: boolean) => void;
  selectedGeneration: any | null;
  handleDownload: (imageUrl: string) => Promise<void>;
}

export const PromptDialog = ({ 
  showPromptDialog, 
  setShowPromptDialog, 
  selectedGeneration,
  handleDownload
}: PromptDialogProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  // Reset pointer events when dialog opens/closes
  useEffect(() => {
    if (!showPromptDialog) {
      // Ensure pointer events are restored when dialog is closed
      document.body.style.pointerEvents = '';
      setIsCopied(false); // Reset copy state when dialog closes
    }
    
    return () => {
      // Clean up on unmount
      document.body.style.pointerEvents = '';
    };
  }, [showPromptDialog]);
  
  const handleShare = async () => {
    try {
      if (!selectedGeneration?.image_url) {
        throw new Error('No valid image URL to share');
      }
      
      // Copy the URL to clipboard
      await navigator.clipboard.writeText(selectedGeneration.image_url);
      
      // Set copied state to true
      setIsCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      toast({
        title: "Link copied!",
        description: "Image link has been copied to clipboard",
        duration: 3000
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard",
        duration: 3000
      });
    }
  };
  
  return (
    <Dialog 
      open={showPromptDialog} 
      onOpenChange={(open) => {
        setShowPromptDialog(open);
        if (!open) {
          // Reset pointer events when dialog closes
          document.body.style.pointerEvents = '';
        }
      }}
    >
      <DialogContent className="sm:max-w-3xl bg-card/95 backdrop-blur border-white/10 h-auto max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
        </DialogHeader>
        
        {selectedGeneration && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
            <div className="aspect-[3/4] rounded-md overflow-hidden h-auto flex-shrink-0">
              <img 
                src={selectedGeneration.image_url} 
                alt="Selected generation" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Prompt</h4>
                  <p className="text-sm">{selectedGeneration.prompt}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Style</h4>
                  <p className="text-sm">{selectedGeneration.style || "Not specified"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Ratio</h4>
                    <p className="text-sm">{selectedGeneration.ratio || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Lora Scale</h4>
                    <p className="text-sm">{selectedGeneration.lora_scale || "Not specified"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Seed</h4>
                    <p className="text-sm">{selectedGeneration.seed || (selectedGeneration.seed === 0 ? "0" : "Random (-1)")}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Pipeline ID</h4>
                    <p className="text-sm truncate" title={selectedGeneration.pipeline_id || "Not specified"}>
                      {selectedGeneration.pipeline_id || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Mode</h4>
                    <p className="text-sm">
                      {selectedGeneration.pipeline_id === "FYpcEIUj" 
                        ? "With Reference" 
                        : selectedGeneration.pipeline_id === "803a4MBY" 
                          ? "No Reference" 
                          : "Unknown"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
                    <p className="text-sm">
                      {selectedGeneration.created_at 
                        ? new Date(selectedGeneration.created_at).toLocaleString() 
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                  onClick={() => handleDownload(selectedGeneration.image_url)}
                >
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
                <Button 
                  variant="outline" 
                  className={`flex-1 border-white/10 hover:bg-white/10 transition-all duration-300 ${isCopied ? 'bg-green-500/20 border-green-500/50 text-green-500' : ''}`}
                  onClick={handleShare}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" /> Share Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

