
import { DotPattern } from "@/components/ui/dot-pattern";
import React, { forwardRef, useEffect } from "react";

interface MainContainerProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const MainContainer = forwardRef<HTMLDivElement, MainContainerProps>(
  ({ children, containerRef }, ref) => {
    // Enhanced effect to guarantee scrollability
    useEffect(() => {
      // Function to remove all scroll locks
      const removeScrollLocks = () => {
        // Reset all possible scroll lock methods
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.position = 'static';
        document.documentElement.style.position = 'static';
        
        // Remove any classes that might lock scrolling
        document.body.classList.remove('overflow-hidden', 'fixed');
        document.documentElement.classList.remove('overflow-hidden', 'fixed');
        
        // Reset all position properties
        document.body.style.removeProperty('height');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('left');
        document.body.style.removeProperty('right');
        document.body.style.removeProperty('bottom');
        document.body.style.removeProperty('position');
        
        document.documentElement.style.removeProperty('height');
        document.documentElement.style.removeProperty('top');
        document.documentElement.style.removeProperty('left');
        document.documentElement.style.removeProperty('right');
        document.documentElement.style.removeProperty('bottom');
        document.documentElement.style.removeProperty('position');
      };
      
      // Run immediately on mount
      removeScrollLocks();
      
      // Run on scroll events to prevent locks during scrolling
      window.addEventListener('scroll', removeScrollLocks, { passive: true });
      
      // Also run on touch events to prevent mobile issues
      window.addEventListener('touchstart', removeScrollLocks, { passive: true });
      window.addEventListener('touchmove', removeScrollLocks, { passive: true });
      
      // Create a MutationObserver to detect style changes
      const observer = new MutationObserver(() => {
        removeScrollLocks();
      });
      
      // Observe both body and html elements
      observer.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
      });
      observer.observe(document.documentElement, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
      });
      
      // Set interval to periodically check and remove scroll locks
      const intervalId = setInterval(removeScrollLocks, 500);
      
      return () => {
        window.removeEventListener('scroll', removeScrollLocks);
        window.removeEventListener('touchstart', removeScrollLocks);
        window.removeEventListener('touchmove', removeScrollLocks);
        observer.disconnect();
        clearInterval(intervalId);
      };
    }, []);
    
    return (
      <div className="relative min-h-screen overflow-visible overflow-x-hidden" ref={containerRef}>
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
