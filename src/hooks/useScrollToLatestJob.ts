
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
        // Use a smoother scroll with better behavior
        setTimeout(() => {
          jobElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Ensure the page can be scrolled in both directions after automatic scrolling
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          
          // Allow manual scrolling again after the automated scroll is complete
          setTimeout(() => {
            window.scrollTo({
              top: window.scrollY,
              behavior: 'auto'
            });
          }, 500);
        }, 100);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
};
