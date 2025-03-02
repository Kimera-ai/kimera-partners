
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
        // Use a single smooth scroll with better behavior and no additional scrolling
        setTimeout(() => {
          jobElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Ensure the page scrolling behavior is normal
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          
          // Remove the additional scroll that was causing the continuous scrolling issue
        }, 100);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
};
