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
  const jobsCompletedRef = useRef<boolean>(false);
  const { toast } = useToast();

  // Optimized fetch function with debouncing
  const fetchPreviousGens = useCallback(async (forceRefresh = false) => {
    if (isRefreshingHistory && !forceRefresh) return Promise.resolve([]);
    
    setIsRefreshingHistory(true);
    console.log('Fetching previous generations...');
    
    try {
      const generations = await fetchPreviousGenerations();
      console.log(`Fetched ${generations.length} generations`);
      setPreviousGenerations(generations);
      return generations;
    } catch (error) {
      console.error("HISTORY FETCH ERROR:", error);
      return [];
    } finally {
      setIsRefreshingHistory(false);
    }
  }, [isRefreshingHistory]);

  // Initial load only once when session is available
  useEffect(() => {
    if (session?.user) {
      fetchPreviousGens();
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

  // Handle job completion and storage
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
    console.log(`Job ${jobConfig.jobId} completed with ${completedImages.length} images`);
    
    setGeneratedImages(prev => [...prev, ...completedImages]);
    
    setGenerationJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobConfig.jobId 
          ? { ...job, displayImages: true } 
          : job
      )
    );
    
    // Store results
    const storageResult = await storeGeneratedImages(session, completedImages, jobConfig);
    console.log(`Storage result: ${storageResult ? 'success' : 'failed'}`);
    
    // Flag for refresh and trigger an immediate refresh
    jobsCompletedRef.current = true;
    
    // Force an immediate refresh
    await fetchPreviousGens(true);
    
    // Schedule additional refreshes to ensure database propagation
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    refreshTimeoutRef.current = setTimeout(async () => {
      console.log('Running delayed history refresh after generation...');
      await fetchPreviousGens(true);
      
      // One more refresh after another delay
      refreshTimeoutRef.current = setTimeout(async () => {
        console.log('Running final history refresh after generation...');
        await fetchPreviousGens(true);
        refreshTimeoutRef.current = null;
      }, 2000);
    }, 2000);
    
    toast({
      title: "Generation Complete",
      description: `Successfully generated ${completedImages.length} ${jobConfig.isVideo ? 'videos' : 'images'}`,
      duration: 3000
    });
  }, [fetchPreviousGens, session, toast]);

  // Check for job completion and refresh only when needed
  useEffect(() => {
    if (jobsCompletedRef.current) {
      toast({
        title: "Success",
        description: "Generation completed successfully!",
        duration: 3000
      });
      
      // Clear any existing refresh timeouts
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      
      // Schedule a single delayed refresh after 2 seconds
      refreshTimeoutRef.current = setTimeout(async () => {
        await fetchPreviousGens();
        refreshTimeoutRef.current = null;
        jobsCompletedRef.current = false;
      }, 2000);
    }
    
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [fetchPreviousGens, toast]);

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

  // Optimized manual refresh with debouncing
  const manualRefreshHistory = useCallback(async () => {
    if (isRefreshingHistory) {
      return Promise.resolve();
    }
    
    toast({
      title: "Refreshing History",
      description: "Fetching your latest generations...",
      duration: 2000
    });
    
    await fetchPreviousGens(true);
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
