
import { useEffect } from "react";

export const useScrollToLatestJob = (
  latestJobRef: React.MutableRefObject<string | null>,
  jobRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>,
  generationJobs: any[]
) => {
  // This hook now does nothing - we've removed the auto-scrolling behavior
  // as requested by the user
  useEffect(() => {
    // Auto-scrolling functionality has been removed
    // The page will stay at the user's current scroll position after generating images
  }, [generationJobs, latestJobRef, jobRefs]);
};
