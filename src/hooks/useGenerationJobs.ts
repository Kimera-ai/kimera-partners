
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
  const latestJobRef = useRef<string | null>(null);
  const jobCompletedRef = useRef<{images: string[], config: any} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchPreviousGens();
    }
  }, [session?.user]);

  // Add timer effect to update elapsed time for all jobs
  useEffect(() => {
    // Timer for updating elapsed time for all active jobs
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

  // Effect to handle job completion toasts outside of render
  useEffect(() => {
    if (jobCompletedRef.current) {
      const { images, config } = jobCompletedRef.current;
      
      // Show toast outside of render phase
      toast({
        title: "Success",
        description: `Job completed! All ${config.isVideo ? 'videos' : 'images'} have been generated successfully!`,
        duration: 3000
      });
      
      // Process storage after render is complete
      const processStorage = async () => {
        const stored = await storeGeneratedImages(session, images, config);
        if (stored) {
          fetchPreviousGens();
        }
      };
      
      processStorage();
      
      // Reset the ref
      jobCompletedRef.current = null;
    }
  }, [toast, session]);

  const fetchPreviousGens = useCallback(async () => {
    const generations = await fetchPreviousGenerations();
    setPreviousGenerations(generations);
  }, []);

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
    // Add all images to the generatedImages collection at once
    setGeneratedImages(prev => [...prev, ...completedImages]);
    
    // Set displayImages flag to true for the completed job
    setGenerationJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobConfig.jobId 
          ? { ...job, displayImages: true } 
          : job
      )
    );
    
    // Store completion info in ref for the effect to handle
    jobCompletedRef.current = {
      images: completedImages,
      config: jobConfig
    };
    
  }, []);

  const startNewJob = useCallback((numImagesToGenerate: number, isVideo: boolean = false) => {
    const { job: newJob, newJobId } = createNewJob(numImagesToGenerate, jobIdCounter, isVideo);
    
    // Add the new job to the beginning of the list
    setGenerationJobs(prev => [newJob, ...prev]);
    setJobIdCounter(prev => prev + 1);
    
    // Set this as the latest job
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

  // Update this function to match the expected interface
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
    latestJobRef
  };
};
