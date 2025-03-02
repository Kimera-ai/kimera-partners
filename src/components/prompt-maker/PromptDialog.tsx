
import React from "react";
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
  
  return (
    <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
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
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Prompt</h4>
              <p className="text-sm">{selectedGeneration?.prompt}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Style</h4>
              <p className="text-sm">{selectedGeneration?.style}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ratio</h4>
              <p className="text-sm">{selectedGeneration?.ratio}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Lora Scale</h4>
              <p className="text-sm">{selectedGeneration?.lora_scale}</p>
            </div>
            
            <Button 
              className="w-full" 
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
