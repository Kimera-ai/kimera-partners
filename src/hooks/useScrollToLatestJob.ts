
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
          // Instead of directly scrolling the element, use window.scrollTo
          // for better control and less side effects
          const rect = jobElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          window.scrollTo({
            top: rect.top + scrollTop - window.innerHeight / 2 + rect.height / 2,
            behavior: 'smooth'
          });
          
          // Immediately ensure scrolling is fully enabled
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
          document.body.style.position = 'static';
          document.documentElement.style.position = 'static';
          document.body.style.height = 'auto';
          document.documentElement.style.height = 'auto';
          document.body.style.overflowY = 'auto';
          document.documentElement.style.overflowY = 'auto';
          
          // Additional cleanup after scrolling completes
          setTimeout(() => {
            // Remove any remaining scroll locks
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.position = '';
            document.documentElement.style.position = '';
            document.body.style.height = '';
            document.documentElement.style.height = '';
            document.body.style.overflowY = '';
            document.documentElement.style.overflowY = '';
          }, 1000);
        }, 100);
      }
    }
  }, [generationJobs, latestJobRef, jobRefs]);
};
