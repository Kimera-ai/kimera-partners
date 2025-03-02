
import { useEffect } from "react";

export const useScrollToLatestJob = (
  latestJobRef: React.MutableRefObject<string | null>,
  jobRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>,
  generationJobs: any[]
) => {
  // Completely rewritten scroll handling for new jobs
  useEffect(() => {
    if (latestJobRef.current && jobRefs.current[latestJobRef.current]) {
      const jobElement = jobRefs.current[latestJobRef.current];
      if (jobElement) {
        // Allow a moment for the UI to update
        setTimeout(() => {
          // Unlock scrolling immediately first
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          document.body.style.position = '';
          document.documentElement.style.position = '';
          document.body.style.height = '';
          document.documentElement.style.height = '';
          document.body.style.top = '';
          document.documentElement.style.top = '';
          
          // Then smoothly scroll to the element
          const yOffset = -100; // Add some offset to show context above the element
          const y = jobElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
          
          // Ensure all scroll locks are completely removed after scrolling
          const removeAllScrollLocks = () => {
            // Remove any lock on body and html
            document.body.classList.remove('overflow-hidden');
            document.documentElement.classList.remove('overflow-hidden');
            
            // Clear all these properties
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.documentElement.style.position = '';
            document.body.style.height = '';
            document.documentElement.style.height = '';
            document.body.style.top = '';
            document.documentElement.style.top = '';
            document.body.style.left = '';
            document.documentElement.style.left = '';
            document.body.style.right = '';
            document.documentElement.style.right = '';
            document.body.style.bottom = '';
            document.documentElement.style.bottom = '';
            
            // Force scrolling to be enabled with !important-like approach
            document.body.setAttribute('style', 'overflow: auto !important');
            document.documentElement.setAttribute('style', 'overflow: auto !important');
            
            // After a moment, clear the forced styles
            setTimeout(() => {
              document.body.removeAttribute('style');
              document.documentElement.removeAttribute('style');
            }, 500);
          };
          
          // Remove locks immediately
          removeAllScrollLocks();
          
          // And also after scrolling is complete
          setTimeout(removeAllScrollLocks, 1000);
        }, 100);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
};
