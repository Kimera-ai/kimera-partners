
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { GenerationJobType } from '@/components/prompt-maker/GenerationJob';
import { pollJobStatus } from '@/utils/jobPollingUtils';
import { createNewJob, fetchPreviousGenerations, formatTime, storeGeneratedImages } from '@/utils/jobManagementUtils';
import { toast } from "sonner";

export const useGenerationJobs = (session: any) => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previousGenerations, setPreviousGenerations] = useState<any[]>([]);
  const [generationJobs, setGenerationJobs] = useState<GenerationJobType[]>([]);
  const [jobIdCounter, setJobIdCounter] = useState(0);
  const [isRefreshingHistory, setIsRefreshingHistory] = useState(false);
  const latestJobRef = useRef<string | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshCountRef = useRef<number>(0);
  const lastStorageSuccessRef = useRef<boolean>(false);
  const forceRefreshCounterRef = useRef<number>(0);
  const isFirstRenderRef = useRef<boolean>(true);
  const lastRefreshTimeRef = useRef<number>(0);
  const { toast } = useToast();

  // Improved fetch function with debouncing and cooldown
  const fetchPreviousGens = useCallback(async (force = false) => {
    // Prevent too frequent refreshes
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
    
    // Don't refresh if it's been less than 2 seconds since last refresh unless forced
    if (timeSinceLastRefresh < 2000 && !force) {
      console.log(`Skipping refresh, only ${timeSinceLastRefresh}ms since last refresh`);
      return previousGenerations;
    }
    
    // Don't fetch if already fetching and not forced
    if (isRefreshingHistory && !force) {
      console.log("Already refreshing history, skipping fetch");
      return Promise.resolve(previousGenerations);
    }
    
    setIsRefreshingHistory(true);
    const timestamp = new Date().toISOString();
    console.log(`Fetching previous generations at ${timestamp} (forced: ${force})`);
    
    try {
      // Increment the force refresh counter when forced
      if (force) {
        forceRefreshCounterRef.current += 1;
        console.log(`Force refresh #${forceRefreshCounterRef.current}`);
      }
      
      const generations = await fetchPreviousGenerations();
      console.log(`Fetched ${generations.length} generations at ${new Date().toISOString()}`);
      
      // Only update state if we got data and component is still mounted
      if (generations.length > 0) {
        setPreviousGenerations(generations);
      } else {
        console.log("No generations returned from database");
      }
      
      // Update last refresh time
      lastRefreshTimeRef.current = Date.now();
      
      return generations;
    } catch (error) {
      console.error("HISTORY FETCH ERROR:", error);
      return previousGenerations;
    } finally {
      // Add a short delay before setting refreshing to false to prevent rapid consecutive refreshes
      setTimeout(() => {
        setIsRefreshingHistory(false);
      }, 500);
    }
  }, [isRefreshingHistory, previousGenerations]);

  // Initial fetch when session is available
  useEffect(() => {
    if (session?.user && isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      console.log("Initial history fetch on session load");
      fetchPreviousGens(true).catch(err => console.error("Initial fetch error:", err));
    }
  }, [session?.user, fetchPreviousGens]);

  // Fixed type signature to match usage in jobPollingUtils.ts
  const handleJobComplete = useCallback(async (
    completedImages: string[], 
    jobConfig: {
      jobId: string;
      jobPrompt: string;
      jobStyle: string;
      jobRatio: string;
      jobLoraScale: string;
      jobWorkflow?: string;
      pipeline_id?: string;
      seed?: number | string;
      isVideo?: boolean;
    }
  ): Promise<boolean> => {
    console.log(`Job ${jobConfig.jobId} completed with ${completedImages.length} ${jobConfig.isVideo ? 'videos' : 'images'}`);
    
    setGeneratedImages(prev => [...prev, ...completedImages]);
    
    setGenerationJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobConfig.jobId 
          ? { ...job, displayImages: true } 
          : job
      )
    );
    
    // Store results in database
    console.log("Storing generated images to database...");
    const storageResult = await storeGeneratedImages(session, completedImages, jobConfig);
    lastStorageSuccessRef.current = storageResult;
    
    console.log(`Storage result: ${storageResult ? 'success' : 'failed'}`);
    
    if (storageResult) {
      toast({
        title: "Images Saved",
        description: `Successfully saved ${completedImages.length} ${jobConfig.isVideo ? 'videos' : 'images'} to your history`,
        duration: 3000
      });
      
      // Clear any existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      
      // Schedule a single delayed refresh to avoid overwhelming the system
      refreshTimeoutRef.current = setTimeout(async () => {
        console.log("Running post-completion history refresh");
        try {
          await fetchPreviousGens(true);
        } catch (error) {
          console.error("Post-completion refresh failed:", error);
        }
        refreshTimeoutRef.current = null;
      }, 1500);
    } else {
      console.error("Failed to store generated images");
    }
    
    return storageResult;
  }, [fetchPreviousGens, session, toast]);

  // Timer for job elapsed time - using RAF for better performance
  useEffect(() => {
    let rafId: number;
    const updateJobTimes = () => {
      setGenerationJobs(prevJobs => {
        // Check if any jobs need updating to avoid unnecessary renders
        const needsUpdate = prevJobs.some(job => !job.isCompleted);
        if (!needsUpdate) return prevJobs;
        
        return prevJobs.map(job => {
          if (!job.isCompleted) {
            return { ...job, elapsedTime: Date.now() - job.startTime };
          }
          return job;
        });
      });
      
      rafId = requestAnimationFrame(updateJobTimes);
    };
    
    rafId = requestAnimationFrame(updateJobTimes);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Simplified job starting function
  const startNewJob = useCallback((numImagesToGenerate: number, ratio: string = "2:3", isVideo: boolean = false) => {
    const { job: newJob, newJobId } = createNewJob(numImagesToGenerate, jobIdCounter, ratio, isVideo);
    
    setGenerationJobs(prev => [newJob, ...prev]);
    setJobIdCounter(prev => prev + 1);
    
    latestJobRef.current = newJobId;
    
    return newJobId;
  }, [jobIdCounter]);

  // Status update function
  const updateJobStatus = useCallback((jobId: string, status: string) => {
    setGenerationJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      )
    );
  }, []);

  // Start job polling function
  const startJobPolling = useCallback((config: {
    apiJobId: string;
    imageIndex: number;
    jobId: string;
    jobPrompt: string;
    jobStyle: string;
    jobRatio: string;
    jobLoraScale: string;
    jobWorkflow?: string;
    pipeline_id?: string;
    seed?: number | string;
    isVideo?: boolean;
  }) => {
    pollJobStatus(
      config,
      setGenerationJobs,
      handleJobComplete
    );
  }, [handleJobComplete]);

  // Manual refresh function with cooldown
  const manualRefreshHistory = useCallback(async () => {
    if (isRefreshingHistory) {
      toast({
        title: "Already Refreshing",
        description: "Please wait for the current refresh to complete",
        duration: 2000
      });
      return Promise.resolve();
    }
    
    toast({
      title: "Refreshing History",
      description: "Fetching your latest generations...",
      duration: 2000
    });
    
    try {
      const generations = await fetchPreviousGens(true);
      
      if (generations.length === 0) {
        toast({
          title: "No generations found",
          description: "You haven't created any images or videos yet",
          duration: 3000
        });
      } else {
        toast({
          title: "History Updated",
          description: `Found ${generations.length} generations`,
          duration: 2000
        });
      }
    } catch (error) {
      console.error("Manual refresh error:", error);
      toast({
        title: "Refresh Failed",
        description: "There was a problem refreshing your history",
        duration: 3000
      });
    }
    
    return Promise.resolve();
  }, [isRefreshingHistory, fetchPreviousGens, toast]);

  return {
    generatedImages,
    setGeneratedImages,
    isProcessing,
    setIsProcessing,
    previousGenerations,
    setPreviousGenerations,
    generationJobs,
    setGenerationJobs,
    jobIdCounter,
    fetchPreviousGenerations: fetchPreviousGens,
    formatTime,
    pollJobStatus: startJobPolling,
    startNewJob,
    updateJobStatus,
    latestJobRef,
    isRefreshingHistory,
    manualRefreshHistory
  };
};
