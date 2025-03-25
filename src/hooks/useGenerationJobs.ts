
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { GenerationJobType } from '@/components/prompt-maker/GenerationJob';
import { pollJobStatus } from '@/utils/jobPollingUtils';
import { createNewJob, fetchPreviousGenerations, formatTime, storeGeneratedImages } from '@/utils/jobManagementUtils';

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
  const { toast } = useToast();

  // Improved fetch function with timestamps to avoid caching
  const fetchPreviousGens = useCallback(async (force = false) => {
    // Don't fetch if already fetching and not forced
    if (isRefreshingHistory && !force) {
      console.log("Already refreshing history, skipping fetch");
      return Promise.resolve([]);
    }
    
    setIsRefreshingHistory(true);
    console.log('Fetching previous generations at', new Date().toISOString());
    
    try {
      const generations = await fetchPreviousGenerations();
      console.log(`Fetched ${generations.length} generations at ${new Date().toISOString()}`);
      
      // Only update state if we got data and component is still mounted
      setPreviousGenerations(generations);
      return generations;
    } catch (error) {
      console.error("HISTORY FETCH ERROR:", error);
      return [];
    } finally {
      setIsRefreshingHistory(false);
    }
  }, [isRefreshingHistory]);

  // Initial fetch when session is available
  useEffect(() => {
    if (session?.user) {
      console.log("Initial history fetch on session load");
      fetchPreviousGens(true).catch(err => console.error("Initial fetch error:", err));
    }
  }, [session?.user, fetchPreviousGens]);

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

  // Enhanced job completion and storage handler
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
  ) => {
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
    const storageResult = await storeGeneratedImages(session, completedImages, jobConfig);
    lastStorageSuccessRef.current = storageResult;
    
    console.log(`Storage result: ${storageResult ? 'success' : 'failed'}`);
    
    // Schedule multiple refreshes to ensure we get the latest data
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Immediate refresh
    try {
      console.log("Running immediate post-generation history refresh");
      await fetchPreviousGens(true);
    } catch (error) {
      console.error("Immediate refresh failed:", error);
    }
    
    // Follow-up refreshes with increasing delays
    const scheduleRefreshes = () => {
      // First refresh after 2 seconds
      refreshTimeoutRef.current = setTimeout(async () => {
        console.log("Running first delayed history refresh (2s)");
        await fetchPreviousGens(true);
        
        // Second refresh after 5 seconds
        refreshTimeoutRef.current = setTimeout(async () => {
          console.log("Running second delayed history refresh (5s)");
          await fetchPreviousGens(true);
          
          // Third refresh after 10 seconds
          refreshTimeoutRef.current = setTimeout(async () => {
            console.log("Running final delayed history refresh (10s)");
            await fetchPreviousGens(true);
            refreshTimeoutRef.current = null;
          }, 5000);
        }, 3000);
      }, 2000);
    };
    
    scheduleRefreshes();
    
    // Show success notification
    let toastMessage = `Successfully generated ${completedImages.length} ${jobConfig.isVideo ? 'videos' : 'images'}`;
    
    if (!storageResult) {
      toastMessage += " (But failed to save to history)";
      console.error("Failed to save images to history");
    }
    
    toast({
      title: "Generation Complete",
      description: toastMessage,
      duration: 5000
    });
    
    return storageResult;
  }, [fetchPreviousGens, session, toast]);

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

  // Manual refresh function with better error handling
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
