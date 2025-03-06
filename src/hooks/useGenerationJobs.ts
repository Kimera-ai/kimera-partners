
import { useState, useEffect, useRef } from 'react';
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

  const fetchPreviousGens = async () => {
    const generations = await fetchPreviousGenerations();
    setPreviousGenerations(generations);
  };

  const handleJobComplete = async (
    completedImages: string[], 
    jobConfig: {
      jobId: string;
      jobPrompt: string;
      jobStyle: string;
      jobRatio: string;
      jobLoraScale: string;
      pipeline_id?: string;
      seed?: number | string;
    }
  ) => {
    // Add all images to the generatedImages collection at once
    setGeneratedImages(prev => [...prev, ...completedImages]);
    
    toast({
      title: "Success",
      description: `Job completed! All images have been generated successfully!`,
      duration: 3000
    });
    
    // Store all generated images in the database
    const stored = await storeGeneratedImages(session, completedImages, jobConfig);
    if (stored) {
      fetchPreviousGens();
    }
  };

  const startNewJob = (numImagesToGenerate: number) => {
    const { job: newJob, newJobId } = createNewJob(numImagesToGenerate, jobIdCounter);
    
    // Add the new job to the beginning of the list
    setGenerationJobs(prev => [newJob, ...prev]);
    setJobIdCounter(prev => prev + 1);
    
    // Set this as the latest job
    latestJobRef.current = newJobId;
    
    return newJobId;
  };

  const updateJobStatus = (jobId: string, status: string) => {
    setGenerationJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      )
    );
  };

  // Update this function to match the expected interface
  const startJobPolling = (config: {
    apiJobId: string;
    imageIndex: number;
    jobId: string;
    jobPrompt: string;
    jobStyle: string;
    jobRatio: string;
    jobLoraScale: string;
    pipeline_id?: string;
    seed?: number | string;
  }) => {
    pollJobStatus(
      config,
      setGenerationJobs,
      handleJobComplete
    );
  };

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
