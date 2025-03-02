
import React from "react";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";

interface PreviousGenerationsProps {
  previousGenerations: any[];
  handleImageClick: (generation: any) => void;
}

export const PreviousGenerations = ({ previousGenerations, handleImageClick }: PreviousGenerationsProps) => {
  if (previousGenerations.length === 0) return null;
  
  // Determine grid columns based on number of images
  const getGridClass = (imageCount: number) => {
    if (imageCount <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (imageCount <= 3) return "grid-cols-1 sm:grid-cols-3";
    if (imageCount <= 4) return "grid-cols-2 sm:grid-cols-4";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
  };
  
  return (
    <Card className="p-6 bg-card/60 backdrop-blur border border-white/5 shadow-lg mt-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-lg font-medium">Previous Generations</h3>
      </div>
      
      <div className={`grid ${getGridClass(previousGenerations.length)} gap-3`}>
        {previousGenerations.map((generation, index) => (
          <div 
            key={index} 
            className="relative aspect-[3/4] rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            onClick={() => handleImageClick(generation)}
          >
            <img 
              src={generation.image_url} 
              alt={`Generated ${index}`} 
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
