
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
            block: 'start'
          });
          
          // Make sure scrolling is enabled in all directions
          document.body.style.overflowY = 'auto';
          document.documentElement.style.overflowY = 'auto';
        }, 100);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
};
