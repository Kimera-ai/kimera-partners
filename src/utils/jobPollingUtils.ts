import { supabase } from "@/integrations/supabase/client";
import { JobPollingConfig, JobStatusResponse } from "@/types/generationJobs";
import { GenerationJobType } from "@/components/prompt-maker/GenerationJob";

const API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";

export const pollJobStatus = async (
  config: JobPollingConfig,
  setGenerationJobs: React.Dispatch<React.SetStateAction<GenerationJobType[]>>,
  onJobComplete: (completedImages: string[], jobConfig: Omit<JobPollingConfig, 'apiJobId' | 'imageIndex'>) => Promise<void>
) => {
  const { jobId, apiJobId, imageIndex, jobPrompt, jobStyle, jobRatio, jobLoraScale } = config;
  
  const pollInterval = setInterval(async () => {
    try {
      setGenerationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: `Checking status for image ${imageIndex + 1}...` } 
            : job
        )
      );
      
      const statusResponse = await fetch(`https://api.kimera.ai/v1/pipeline/run/${apiJobId}`, {
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      if (!statusResponse.ok) {
        clearInterval(pollInterval);
        
        setGenerationJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { ...job, status: `Error: Failed to check status for image ${imageIndex + 1}`, isCompleted: true } 
              : job
          )
        );
        
        throw new Error(`Failed to check status for image ${imageIndex + 1}`);
      }
      
      const status: JobStatusResponse = await statusResponse.json();
      console.log(`Current status for job ${jobId}, image ${imageIndex + 1}:`, status);
      
      let statusMessage = getStatusMessage(status, imageIndex);
      
      if (status.status === 'completed') {
        clearInterval(pollInterval);
        
        setGenerationJobs(prev => {
          const updatedJobs = prev.map(job => {
            if (job.id === jobId) {
              const newGeneratedImages = [...job.generatedImages];
              newGeneratedImages[imageIndex] = status.result || null;
              
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
                displayImages: true,
                status: jobStatus
              };
            }
            return job;
          });
          
          const currentJob = updatedJobs.find(j => j.id === jobId);
          if (currentJob && currentJob.completedImages === currentJob.totalImages) {
            const completedImages = currentJob.generatedImages
              .filter(img => img !== null)
              .slice(0, currentJob.totalImages) as string[];
            
            onJobComplete(completedImages, { jobId, jobPrompt, jobStyle, jobRatio, jobLoraScale });
          }
          
          return updatedJobs;
        });
      } else if (status.status === 'failed' || status.status === 'Error') {
        clearInterval(pollInterval);
        
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
        if (statusMessage) {
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId ? { ...job, status: statusMessage } : job
            )
          );
        }
      }
      
    } catch (error) {
      clearInterval(pollInterval);
      console.error(`Error polling status for job ${jobId}, image ${imageIndex + 1}:`, error);
    }
  }, 5000);
};

export const getStatusMessage = (status: JobStatusResponse, imageIndex: number): string => {
  if (status.status === 'pending') {
    return `Image ${imageIndex + 1}: Waiting in queue...`;
  } else if (status.status === 'processing') {
    return `Image ${imageIndex + 1}: Processing...`;
  } else if (status.status === 'AI Dream') {
    if (status.progress && status.progress.step && status.progress.total) {
      return `Image ${imageIndex + 1}: Creating (${status.progress.step}/${status.progress.total})...`;
    }
    return `Image ${imageIndex + 1}: Creating image...`;
  } else if (status.status === 'Face Swap') {
    if (status.progress && status.progress.step && status.progress.total) {
      return `Image ${imageIndex + 1}: Applying reference (${status.progress.step}/${status.progress.total})...`;
    }
    return `Image ${imageIndex + 1}: Applying reference...`;
  } else {
    return `Image ${imageIndex + 1}: ${status.status || "Processing"}: ${status.progress?.step || ""}/${status.progress?.total || ""}`;
  }
};
