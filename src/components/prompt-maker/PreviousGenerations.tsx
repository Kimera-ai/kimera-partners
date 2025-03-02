
import React from "react";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface PreviousGenerationsProps {
  previousGenerations: any[];
  handleImageClick: (generation: any) => void;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const PreviousGenerations = ({ 
  previousGenerations, 
  handleImageClick,
  isHistoryOpen,
  setIsHistoryOpen
}: PreviousGenerationsProps) => {
  if (previousGenerations.length === 0) return null;
  
  // Determine grid columns based on number of images
  const getGridClass = (imageCount: number) => {
    if (imageCount <= 2) return "grid-cols-1";
    if (imageCount <= 4) return "grid-cols-2";
    return "grid-cols-2 md:grid-cols-3";
  };
  
  return (
    <Drawer 
      open={isHistoryOpen} 
      onOpenChange={(open) => {
        setIsHistoryOpen(open);
        // Add a small delay to ensure DOM is updated
        if (!open) {
          setTimeout(() => {
            document.body.style.pointerEvents = '';
          }, 300);
        }
      }}
      direction="right"
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed right-4 bottom-4 z-50 flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          <span>History</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] w-[90vw] md:w-[450px] right-0 left-auto rounded-l-lg">
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-medium">Previous Generations</h3>
            </div>
            <DrawerClose asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-8 w-8 p-0"
                onClick={() => {
                  // Ensure pointer events are restored when drawer is closed
                  document.body.style.pointerEvents = '';
                }}
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </DrawerClose>
          </div>
          
          <div className={`grid ${getGridClass(previousGenerations.length)} gap-4`}>
            {previousGenerations.map((generation, index) => (
              <div 
                key={index} 
                className="relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                onClick={() => {
                  handleImageClick(generation);
                  setIsHistoryOpen(false); // Close drawer after selection
                }}
              >
                <img 
                  src={generation.image_url} 
                  alt={`Generated ${index}`} 
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
