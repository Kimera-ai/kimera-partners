
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GenerationJobType } from '@/components/prompt-maker/GenerationJob';

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
      fetchPreviousGenerations();
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

  const fetchPreviousGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const uniqueGenerations = data?.filter((gen, index, self) => 
        index === self.findIndex(g => g.image_url === gen.image_url)
      ) || [];
      
      setPreviousGenerations(uniqueGenerations);
    } catch (error) {
      console.error('Error fetching previous generations:', error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const pollJobStatus = async (
    apiJobId: string, 
    imageIndex: number, 
    jobId: string, 
    jobPrompt: string, 
    jobStyle: string, 
    jobRatio: string, 
    jobLoraScale: string
  ) => {
    const pollInterval = setInterval(async () => {
      try {
        // Update job status
        setGenerationJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { ...job, status: `Checking status for image ${imageIndex + 1}...` } 
              : job
          )
        );
        
        const statusResponse = await fetch(`https://api.kimera.ai/v1/pipeline/run/${apiJobId}`, {
          headers: {
            'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee"
          }
        });
        
        if (!statusResponse.ok) {
          clearInterval(pollInterval);
          
          // Update job status to error
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId 
                ? { ...job, status: `Error: Failed to check status for image ${imageIndex + 1}`, isCompleted: true } 
                : job
            )
          );
          
          throw new Error(`Failed to check status for image ${imageIndex + 1}`);
        }
        
        const status = await statusResponse.json();
        console.log(`Current status for job ${jobId}, image ${imageIndex + 1}:`, status);
        
        let statusMessage = "";
        
        if (status.status === 'pending') {
          statusMessage = `Image ${imageIndex + 1}: Waiting in queue...`;
        } else if (status.status === 'processing') {
          statusMessage = `Image ${imageIndex + 1}: Processing...`;
        } else if (status.status === 'AI Dream') {
          statusMessage = `Image ${imageIndex + 1}: Creating image...`;
          if (status.progress && status.progress.step && status.progress.total) {
            statusMessage = `Image ${imageIndex + 1}: Creating (${status.progress.step}/${status.progress.total})...`;
          }
        } else if (status.status === 'Face Swap') {
          statusMessage = `Image ${imageIndex + 1}: Applying reference...`;
          if (status.progress && status.progress.step && status.progress.total) {
            statusMessage = `Image ${imageIndex + 1}: Applying reference (${status.progress.step}/${status.progress.total})...`;
          }
        } else if (status.status === 'completed') {
          clearInterval(pollInterval);
          
          // Update job images and completion status
          setGenerationJobs(prev => {
            const updatedJobs = prev.map(job => {
              if (job.id === jobId) {
                const newGeneratedImages = [...job.generatedImages];
                newGeneratedImages[imageIndex] = status.result;
                
                const newCompletedImages = job.completedImages + 1;
                const isAllCompleted = newCompletedImages === job.totalImages;
                
                const jobStatus = isAllCompleted 
                  ? "All images generated successfully!" 
                  : `Completed ${newCompletedImages} of ${job.totalImages} images...`;
                
                return {
                  ...job,
                  generatedImages: newGeneratedImages,
                  completedImages: newCompletedImages,
                  isCompleted: isAllCompleted,
                  status: jobStatus
                };
              }
              return job;
            });
            
            // Check if all images for this job are completed
            const currentJob = updatedJobs.find(j => j.id === jobId);
            if (currentJob && currentJob.completedImages === currentJob.totalImages) {
              // Only add the requested number of completed images to generatedImages state
              const completedImages = currentJob.generatedImages
                .filter(img => img !== null)
                .slice(0, currentJob.totalImages) as string[];
              
              setGeneratedImages(prev => [...prev, ...completedImages]);
              
              toast({
                title: "Success",
                description: `Job completed! All ${currentJob.totalImages} images have been generated successfully!`,
                duration: 3000
              });
            }
            
            return updatedJobs;
          });
          
          // Store the generated image in the database
          const { error: dbError } = await supabase.from('generated_images').insert({
            user_id: session?.user?.id,
            image_url: status.result,
            prompt: jobPrompt,
            style: jobStyle,
            ratio: jobRatio,
            lora_scale: jobLoraScale
          });
          
          if (dbError) {
            console.error('Error storing generation:', dbError);
          } else {
            await fetchPreviousGenerations();
          }
        } else if (status.status === 'failed' || status.status === 'Error') {
          clearInterval(pollInterval);
          
          // Update job status to error
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId 
                ? { 
                    ...job, 
                    status: `Error: Image ${imageIndex + 1} processing failed`, 
                    isCompleted: true 
                  } 
                : job
            )
          );
          
          throw new Error(`Image ${imageIndex + 1} processing failed`);
        } else {
          statusMessage = `Image ${imageIndex + 1}: ${status.status || "Processing"}: ${status.progress?.step || ""}/${status.progress?.total || ""}`;
        }
        
        // Update job status
        if (statusMessage) {
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId ? { ...job, status: statusMessage } : job
            )
          );
        }
        
      } catch (error) {
        clearInterval(pollInterval);
        console.error(`Error polling status for job ${jobId}, image ${imageIndex + 1}:`, error);
      }
    }, 2000);
  };

  const startNewJob = (numImagesToGenerate: number) => {
    const jobId = `job-${jobIdCounter}`;
    setJobIdCounter(prev => prev + 1);
    
    // Create a new generation job with the correct number of images
    const newJob: GenerationJobType = {
      id: jobId,
      status: "Starting pipeline...",
      completedImages: 0,
      totalImages: numImagesToGenerate,
      generatedImages: new Array(numImagesToGenerate).fill(null),
      isCompleted: false,
      startTime: Date.now(),
      elapsedTime: 0
    };
    
    // Add the new job to the beginning of the list
    setGenerationJobs(prev => [newJob, ...prev]);
    
    // Set this as the latest job
    latestJobRef.current = jobId;
    
    return jobId;
  };

  const updateJobStatus = (jobId: string, status: string) => {
    setGenerationJobs(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status } : job
      )
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
    fetchPreviousGenerations,
    formatTime,
    pollJobStatus,
    startNewJob,
    updateJobStatus,
    latestJobRef
  };
};
