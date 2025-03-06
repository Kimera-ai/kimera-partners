
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
  if (!selectedGeneration) return null;
  
  // Reset pointer events when dialog opens/closes
  useEffect(() => {
    if (!showPromptDialog) {
      // Ensure pointer events are restored when dialog is closed
      document.body.style.pointerEvents = '';
    }
    
    return () => {
      // Clean up on unmount
      document.body.style.pointerEvents = '';
    };
  }, [showPromptDialog]);
  
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
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur border-white/10">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-[3/4] rounded-md overflow-hidden">
            <img 
              src={selectedGeneration?.image_url} 
              alt="Selected generation" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Prompt</h4>
              <p className="text-sm">{selectedGeneration?.prompt}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Style</h4>
              <p className="text-sm">{selectedGeneration?.style || "Not specified"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ratio</h4>
              <p className="text-sm">{selectedGeneration?.ratio || "Not specified"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Lora Scale</h4>
              <p className="text-sm">{selectedGeneration?.lora_scale || "Not specified"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Seed</h4>
              <p className="text-sm">{selectedGeneration?.seed || (selectedGeneration?.seed === 0 ? "0" : "Random (-1)")}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Pipeline ID</h4>
              <p className="text-sm">{selectedGeneration?.pipeline_id || "Not specified"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Mode</h4>
              <p className="text-sm">
                {selectedGeneration?.pipeline_id === "FYpcEIUj" 
                  ? "With Reference" 
                  : selectedGeneration?.pipeline_id === "803a4MBY" 
                    ? "No Reference" 
                    : "Unknown"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Created At</h4>
              <p className="text-sm">
                {selectedGeneration?.created_at 
                  ? new Date(selectedGeneration.created_at).toLocaleString() 
                  : "Not available"}
              </p>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 mt-2" 
              onClick={() => handleDownload(selectedGeneration?.image_url)}
            >
              <Download className="h-4 w-4 mr-2" /> Download Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
