
import { DotPattern } from "@/components/ui/dot-pattern";
import React, { forwardRef } from "react";

interface MainContainerProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const MainContainer = forwardRef<HTMLDivElement, MainContainerProps>(
  ({ children, containerRef }, ref) => {
    return (
      <div className="relative min-h-screen overflow-visible" ref={containerRef}>
        <div className="absolute inset-0 pointer-events-none">
          <DotPattern 
            width={24} 
            height={24} 
            className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]" 
            cx={1} 
            cy={1} 
            cr={1} 
          />
        </div>
        
        <div className="relative z-10 overflow-visible">
          {children}
        </div>
      </div>
    );
  }
);

MainContainer.displayName = "MainContainer";
