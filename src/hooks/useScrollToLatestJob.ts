
import { useEffect } from "react";

export const useScrollToLatestJob = (
  latestJobRef: React.MutableRefObject<string | null>,
  jobRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>,
  generationJobs: any[]
) => {
  // Completely rewritten scroll handling to fix scroll lock issues
  useEffect(() => {
    if (latestJobRef.current && jobRefs.current[latestJobRef.current]) {
      const jobElement = jobRefs.current[latestJobRef.current];
      if (jobElement) {
        // First, make sure to reset any scroll locks that might be applied
        const resetScrolling = () => {
          // Reset all possible scroll lock methods
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
          document.body.style.position = 'static';
          document.documentElement.style.position = 'static';
          
          // Remove any classes that might lock scrolling
          document.body.classList.remove('overflow-hidden', 'fixed');
          document.documentElement.classList.remove('overflow-hidden', 'fixed');
          
          // Remove any inline styles that might affect scrolling
          const bodyStyle = document.body.style;
          bodyStyle.removeProperty('height');
          bodyStyle.removeProperty('top');
          bodyStyle.removeProperty('left');
          bodyStyle.removeProperty('right');
          bodyStyle.removeProperty('bottom');
          bodyStyle.removeProperty('position');
          
          const htmlStyle = document.documentElement.style;
          htmlStyle.removeProperty('height');
          htmlStyle.removeProperty('top');
          htmlStyle.removeProperty('left');
          htmlStyle.removeProperty('right');
          htmlStyle.removeProperty('bottom');
          htmlStyle.removeProperty('position');
        };
        
        // Reset scrolling immediately first
        resetScrolling();
        
        // Wait a tiny bit for the UI to update
        setTimeout(() => {
          // Calculate position for the element
          const rect = jobElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetY = rect.top + scrollTop - 120; // 120px offset from the top
          
          // Scroll to the element - using plain JS
          window.scrollTo(0, targetY);
          
          // Ensure scrolling is enabled again after scrolling
          resetScrolling();
          
          // Add a listener to detect any potential scroll locks that might be applied later
          const preventScrollLocks = () => {
            requestAnimationFrame(resetScrolling);
          };
          
          window.addEventListener('scroll', preventScrollLocks, { passive: true });
          
          // Continue to reset scroll locks for a few seconds to ensure they don't get re-applied
          const intervalId = setInterval(resetScrolling, 100);
          setTimeout(() => {
            clearInterval(intervalId);
            window.removeEventListener('scroll', preventScrollLocks);
          }, 5000);
        }, 50);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
  
  // Add an additional effect to always ensure scrolling is possible
  useEffect(() => {
    // Create a global MutationObserver to watch for any added styles that might lock scrolling
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          document.body.style.overflow === 'hidden' || 
          document.documentElement.style.overflow === 'hidden'
        ) {
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
        }
      }
    });
    
    // Start observing body and html for attribute changes
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    
    return () => {
      observer.disconnect();
    };
  }, []);
};
