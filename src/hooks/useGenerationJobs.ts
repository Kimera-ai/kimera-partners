
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
  const jobCompletedRef = useRef<{images: string[], config: any} | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Enhanced fetch function with better error handling
  const fetchPreviousGens = useCallback(async () => {
    if (isRefreshingHistory) return Promise.resolve([]);
    
    setIsRefreshingHistory(true);
    console.log("HISTORY FETCH: Starting fetch of previous generations");
    
    try {
      const generations = await fetchPreviousGenerations();
      console.log("HISTORY FETCH: Completed with", generations.length, "items");
      setPreviousGenerations(generations);
      return generations;
    } catch (error) {
      console.error("HISTORY FETCH ERROR:", error);
      throw error;
    } finally {
      setIsRefreshingHistory(false);
    }
  }, [isRefreshingHistory]);

  useEffect(() => {
    if (session?.user) {
      fetchPreviousGens();
    }
  }, [session?.user, fetchPreviousGens]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGenerationJobs(prevJobs => {
        return prevJobs.map(job => {
          if (!job.isCompleted) {
            return { ...job, elapsedTime: Date.now() - job.startTime };
          }
          return job;
        });
      });
    }, 10);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Controlled refresh logic when a job completes
  useEffect(() => {
    if (jobCompletedRef.current) {
      const { images, config } = jobCompletedRef.current;
      
      toast({
        title: "Success",
        description: `Job completed! All ${config.isVideo ? 'videos' : 'images'} have been generated successfully!`,
        duration: 3000
      });
      
      const processStorage = async () => {
        console.log("JOB COMPLETE: Storage processing started");
        console.log("JOB COMPLETE: Storing", images.length, "items with config:", JSON.stringify(config));
        
        try {
          const stored = await storeGeneratedImages(session, images, config);
          console.log("JOB COMPLETE: Storage result:", stored);
          
          if (stored) {
            console.log("JOB COMPLETE: Images stored, refreshing history");
            
            // Clear any existing refresh timeouts
            if (refreshTimeoutRef.current) {
              clearTimeout(refreshTimeoutRef.current);
            }
            
            // Single immediate refresh
            await fetchPreviousGens();
            
            // Schedule just one delayed refresh after storage completes (3s)
            refreshTimeoutRef.current = setTimeout(async () => {
              console.log("JOB COMPLETE: Final delayed refresh");
              await fetchPreviousGens();
              refreshTimeoutRef.current = null;
            }, 3000);
          } else {
            console.error("JOB COMPLETE: Failed to store images");
            toast({
              title: "Warning",
              description: "Generated items may not have been saved to history. Please check and try again.",
              duration: 5000
            });
          }
        } catch (error) {
          console.error("JOB COMPLETE ERROR: Storage failed with exception:", error);
          toast({
            title: "Error",
            description: "Failed to save items to history. Please try again or check console for details.",
            duration: 5000
          });
        }
      };
      
      processStorage();
      jobCompletedRef.current = null;
    }
  }, [toast, session, fetchPreviousGens]);

  const handleJobComplete = useCallback(async (
    completedImages: string[], 
    jobConfig: {
      jobId: string;
      jobPrompt: string;
      jobStyle: string;
      jobRatio: string;
      jobLoraScale: string;
      pipeline_id?: string;
      seed?: number | string;
      isVideo?: boolean;
    }
  ) => {
    setGeneratedImages(prev => [...prev, ...completedImages]);
    
    setGenerationJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobConfig.jobId 
          ? { ...job, displayImages: true } 
          : job
      )
    );
    
    console.log(`JOB COMPLETE: Job ${jobConfig.jobId} with ${completedImages.length} valid images, isVideo=${jobConfig.isVideo || false}`);
    
    // Copy the data to avoid reference issues
    jobCompletedRef.current = {
      images: [...completedImages],
      config: {...jobConfig}
    };
    
    // Trigger a single immediate refresh
    await fetchPreviousGens();
  }, [fetchPreviousGens]);

  const startNewJob = useCallback((numImagesToGenerate: number, ratio: string = "2:3", isVideo: boolean = false) => {
    const { job: newJob, newJobId } = createNewJob(numImagesToGenerate, jobIdCounter, ratio, isVideo);
    
    setGenerationJobs(prev => [newJob, ...prev]);
    setJobIdCounter(prev => prev + 1);
    
    latestJobRef.current = newJobId;
    
    return newJobId;
  }, [jobIdCounter]);

  const updateJobStatus = useCallback((jobId: string, status: string) => {
    setGenerationJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      )
    );
  }, []);

  const startJobPolling = useCallback((config: {
    apiJobId: string;
    imageIndex: number;
    jobId: string;
    jobPrompt: string;
    jobStyle: string;
    jobRatio: string;
    jobLoraScale: string;
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

  // Simpler manual refresh function with debouncing
  const manualRefreshHistory = useCallback(async (): Promise<void> => {
    if (isRefreshingHistory) {
      console.log("Manual refresh already in progress, skipping");
      return Promise.resolve();
    }
    
    toast({
      title: "Refreshing History",
      description: "Fetching your latest generations...",
      duration: 2000
    });
    
    try {
      await fetchPreviousGens();
      
      // Clear any existing refresh timeouts
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      // Just do one delayed refresh for better UX
      return new Promise<void>((resolve) => {
        refreshTimeoutRef.current = setTimeout(async () => {
          console.log("MANUAL REFRESH: Final delayed refresh");
          await fetchPreviousGens();
          refreshTimeoutRef.current = null;
          resolve();
        }, 2000);
      });
    } catch (error) {
      console.error("MANUAL REFRESH ERROR:", error);
      return Promise.resolve();
    }
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
