
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

  const fetchPreviousGens = useCallback(async () => {
    const generations = await fetchPreviousGenerations();
    console.log("Fetched previous generations:", generations.length);
    setPreviousGenerations(generations);
  }, []);

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

  useEffect(() => {
    if (jobCompletedRef.current) {
      const { images, config } = jobCompletedRef.current;
      
      toast({
        title: "Success",
        description: `Job completed! All ${config.isVideo ? 'videos' : 'images'} have been generated successfully!`,
        duration: 3000
      });
      
      const processStorage = async () => {
        console.log("Storing generated images:", images.length);
        console.log("Store config:", JSON.stringify(config));
        const stored = await storeGeneratedImages(session, images, config);
        console.log("Storage result:", stored);
        if (stored) {
          console.log("Images stored, refreshing history");
          await fetchPreviousGens();
        } else {
          console.error("Failed to store images");
        }
        // Force another refresh after a delay to ensure updates are captured
        setTimeout(() => {
          console.log("Delayed refresh after storage");
          fetchPreviousGens();
        }, 1000);
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
    
    console.log(`Job ${jobConfig.jobId}: completed=true, validImages=${completedImages.length}, isVideo=${jobConfig.isVideo || false}`);
    
    jobCompletedRef.current = {
      images: completedImages,
      config: jobConfig
    };
    
  }, []);

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
