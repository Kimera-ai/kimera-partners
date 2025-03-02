
import { useEffect } from "react";

export const useScrollToLatestJob = (
  latestJobRef: React.MutableRefObject<string | null>,
  jobRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>,
  generationJobs: any[]
) => {
  // Improved scroll handling for new jobs
  useEffect(() => {
    if (latestJobRef.current && jobRefs.current[latestJobRef.current]) {
      const jobElement = jobRefs.current[latestJobRef.current];
      if (jobElement) {
        // Use a single smooth scroll with better behavior
        setTimeout(() => {
          // Scroll to the job element smoothly
          jobElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // Changed from 'start' to 'center' for better UX
          });
          
          // Make sure scrolling is enabled in all directions
          document.body.style.overflowY = 'auto';
          document.documentElement.style.overflowY = 'auto';
          
          // Allow user to scroll freely after a short delay
          setTimeout(() => {
            // Remove any potential scroll locks that might be happening
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.documentElement.style.position = '';
          }, 500);
        }, 100);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
};
