
import { toast } from "sonner";
import { GenerationJobType } from "@/components/prompt-maker/GenerationJob";

interface JobPollingConfig {
  apiJobId: string;
  imageIndex: number;
  jobId: string;
  jobPrompt: string;
  jobStyle: string;
  jobRatio: string;
  jobLoraScale: string;
  pipeline_id?: string;
  seed?: number | string;
}

// Poll the status of a job until it's completed
export const pollJobStatus = (
  config: JobPollingConfig,
  setGenerationJobs: React.Dispatch<React.SetStateAction<GenerationJobType[]>>,
  handleJobComplete: (
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
  ) => void
) => {
  const { apiJobId, imageIndex, jobId, jobPrompt, jobStyle, jobRatio, jobLoraScale, pipeline_id, seed } = config;
  let pollingIntervalId: number;
  let pollingAttempts = 0;
  const MAX_POLLING_ATTEMPTS = 60; // 5 minutes at 5-second intervals
  
  const pollJob = async () => {
    try {
      console.log(`Polling job status for ID: ${apiJobId}`);
      
      const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${apiJobId}`, {
        method: 'GET',
        headers: {
          'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee",
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error checking job status: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Job status response for ${apiJobId}:`, data);
      
      if (data.status === 'completed' || data.status === 'done') {
        // Job is complete
        clearInterval(pollingIntervalId);
        
        if (!data.images?.[0] && !data.result?.images?.[0]) {
          throw new Error('No images found in result');
        }
        
        // Extract the image URL from the result
        const imageUrl = data.images?.[0] || data.result?.images?.[0];
        console.log(`Image generated successfully: ${imageUrl}`);
        
        // Get the response's pipeline_id and seed
        const responsePipelineId = data.pipeline_id;
        // Ensure seed is treated as a string
        const responseSeed = data.data?.seed !== undefined ? String(data.data.seed) : (seed !== undefined ? String(seed) : null);
        
        // Mark the job as completed
        setGenerationJobs(prevJobs => {
          // Find the job
          const updatedJobs = prevJobs.map(job => {
            if (job.id === jobId) {
              // Create a copy of the generatedImages array
              const updatedImages = [...job.generatedImages];
              // Update the image at the correct index
              updatedImages[imageIndex] = imageUrl;
              
              // Calculate if all images are completed
              const completedImagesCount = updatedImages.filter(img => img !== null).length;
              const allImagesCompleted = completedImagesCount === job.totalImages;
              
              // Update the job
              return {
                ...job,
                generatedImages: updatedImages,
                completedImages: completedImagesCount,
                status: allImagesCompleted ? "All images generated successfully!" : `Generated ${completedImagesCount} of ${job.totalImages} images...`,
                isCompleted: allImagesCompleted,
                // Always show images immediately
                displayImages: true,
              };
            }
            return job;
          });
          
          // Check if all images for this job are now complete
          const currentJob = updatedJobs.find(j => j.id === jobId);
          if (currentJob && currentJob.isCompleted) {
            // Filter out null values and get valid image URLs
            const completedImages = currentJob.generatedImages.filter(img => img !== null) as string[];
            
            // Notify the parent component that all images are complete
            handleJobComplete(completedImages, {
              jobId,
              jobPrompt,
              jobStyle,
              jobRatio,
              jobLoraScale,
              pipeline_id: responsePipelineId || pipeline_id,
              seed: responseSeed
            });
          }
          
          return updatedJobs;
        });
        
      } else if (data.status === 'processing' || data.status === 'AI Dream' || data.status === 'Image Resize') {
        // Job is still processing, update the status
        setGenerationJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId ? {
              ...job,
              status: `Processing image ${imageIndex + 1} of ${job.totalImages}...`
            } : job
          )
        );
        
        // Check if we've exceeded the max number of polling attempts
        pollingAttempts++;
        if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
          clearInterval(pollingIntervalId);
          throw new Error(`Generation timeout after ${MAX_POLLING_ATTEMPTS * 5} seconds`);
        }
      } else if (data.status === 'failed') {
        // Job failed
        clearInterval(pollingIntervalId);
        throw new Error(data.message || 'Generation failed');
      }
    } catch (error) {
      clearInterval(pollingIntervalId);
      console.error('Error polling job status:', error);
      
      // Update job status to show error
      setGenerationJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? {
            ...job,
            status: `Error: ${error instanceof Error ? error.message : 'Failed to process image'}`
          } : job
        )
      );
      
      // Show toast notification for error
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to process image'}`);
    }
  };
  
  // Poll immediately then every 5 seconds
  pollJob();
  pollingIntervalId = setInterval(pollJob, 5000) as unknown as number;
};
