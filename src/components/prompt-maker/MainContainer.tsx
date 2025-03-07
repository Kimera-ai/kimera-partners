
import { DotPattern } from "@/components/ui/dot-pattern";
import React, { forwardRef } from "react";

interface MainContainerProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  sidebar?: React.ReactNode;
}

export const MainContainer = forwardRef<HTMLDivElement, MainContainerProps>(
  ({ children, containerRef, sidebar }, ref) => {
    return (
      <div className="relative h-[calc(100vh-4rem)] overflow-visible flex" ref={containerRef}>
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
        
        {sidebar && (
          <div className="relative z-20 h-[calc(100vh-4rem)] sticky top-0 overflow-y-auto w-[260px] bg-[#1A1625] border-r border-white/10">
            {sidebar}
          </div>
        )}
        
        <div className="relative z-10 overflow-y-auto flex-1 bg-[#141220]">
          {children}
        </div>
      </div>
    );
  }
);

MainContainer.displayName = "MainContainer";
