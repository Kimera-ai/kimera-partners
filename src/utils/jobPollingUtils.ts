
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
  const MAX_TIME_WITHOUT_PROGRESS = 24; // 2 minutes without progress
  let lastProgressTime = Date.now();
  let lastStatus = '';
  
  // Define extractedSeed at a higher scope so it's available throughout the function
  let extractedSeed: string | null = null;
  
  const pollJob = async () => {
    try {
      console.log(`Polling job status for ID: ${apiJobId}, attempt ${pollingAttempts + 1}`);
      
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

      // Check for explicit failure states
      if (data.status === 'failed' || data.status === 'error') {
        throw new Error(data.message || 'Generation failed');
      }
      
      // If status changed, update last progress time
      if (data.status !== lastStatus) {
        lastProgressTime = Date.now();
        lastStatus = data.status;
      }
      
      if (data.status === 'completed' || data.status === 'done') {
        clearInterval(pollingIntervalId);
        
        if (!data.images?.[0] && !data.result?.images?.[0]) {
          throw new Error('No images found in result');
        }
        
        // Extract the image URL from the result
        const imageUrl = data.images?.[0] || data.result?.images?.[0];
        console.log(`Image generated successfully: ${imageUrl}`);
        
        // Get the response's pipeline_id and seed
        const responsePipelineId = data.pipeline_id;
        extractedSeed = data.data?.seed !== undefined ? String(data.data.seed) : (seed !== undefined ? String(seed) : null);
        
        setGenerationJobs(prevJobs => {
          const updatedJobs = prevJobs.map(job => {
            if (job.id === jobId) {
              const updatedImages = [...job.generatedImages];
              updatedImages[imageIndex] = {
                url: imageUrl,
                seed: extractedSeed,
                pipeline_id: responsePipelineId || pipeline_id
              };
              
              const completedImagesCount = updatedImages.filter(img => img !== null).length;
              const allImagesCompleted = completedImagesCount === job.totalImages;
              
              return {
                ...job,
                generatedImages: updatedImages,
                completedImages: completedImagesCount,
                status: allImagesCompleted ? "All images generated successfully!" : `Generated ${completedImagesCount} of ${job.totalImages} images...`,
                isCompleted: allImagesCompleted,
                displayImages: true, // Always show images as they complete
                error: null // Clear any error state
              };
            }
            return job;
          });
          
          const currentJob = updatedJobs.find(j => j.id === jobId);
          if (currentJob?.isCompleted) {
            const completedImageData = currentJob.generatedImages
              .filter(img => img !== null) as { url: string, seed: string | null, pipeline_id: string | null }[];
            const completedImageUrls = completedImageData.map(img => img.url);
            
            const lastImage = completedImageData[completedImageData.length - 1];
            
            handleJobComplete(completedImageUrls, {
              jobId,
              jobPrompt,
              jobStyle,
              jobRatio,
              jobLoraScale,
              pipeline_id: lastImage?.pipeline_id || pipeline_id,
              seed: lastImage?.seed || extractedSeed
            });
          }
          
          return updatedJobs;
        });
        
      } else if (data.status === 'processing' || data.status === 'AI Dream' || data.status === 'Image Resize') {
        // Update status in job
        setGenerationJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === jobId ? {
              ...job,
              status: `Processing image ${imageIndex + 1} of ${job.totalImages}... (${data.status})`
            } : job
          )
        );
        
        pollingAttempts++;
        
        // Check for timeout conditions
        const timeWithoutProgress = (Date.now() - lastProgressTime) / 1000;
        if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
          clearInterval(pollingIntervalId);
          throw new Error(`Generation timed out after ${MAX_POLLING_ATTEMPTS * 5} seconds`);
        }
        
        if (timeWithoutProgress > MAX_TIME_WITHOUT_PROGRESS * 5) {
          // Instead of throwing an error immediately, attempt to recover
          console.warn(`Job ${apiJobId} appears stuck. Attempting to display any completed images.`);
          
          setGenerationJobs(prevJobs => {
            return prevJobs.map(job => {
              if (job.id === jobId) {
                // Mark the job as completed with partial results
                const completedImages = job.generatedImages.filter(img => img !== null).length;
                
                // Only mark as completed if we have at least one image
                if (completedImages > 0) {
                  return {
                    ...job,
                    status: `Completed with ${completedImages}/${job.totalImages} images (some images timed out)`,
                    isCompleted: true,
                    displayImages: true,
                    error: `Some images could not be generated (timeout after ${Math.floor(timeWithoutProgress)} seconds)`
                  };
                } else {
                  // If no images at all, throw error
                  throw new Error(`Generation stuck - no progress for ${Math.floor(timeWithoutProgress)} seconds`);
                }
              }
              return job;
            });
          });
          
          clearInterval(pollingIntervalId);
        }
      }
    } catch (error) {
      clearInterval(pollingIntervalId);
      console.error('Error polling job status:', error);
      
      // Update job status to show error
      setGenerationJobs(prevJobs => {
        const updatedJobs = prevJobs.map(job => {
          if (job.id === jobId) {
            // Get any successful images before marking as error
            const completedImages = job.generatedImages.filter(img => img !== null).length;
            
            return {
              ...job,
              status: `Error: ${error instanceof Error ? error.message : 'Failed to process image'}`,
              error: error instanceof Error ? error.message : 'Failed to process image',
              isCompleted: true, // Mark as completed so the UI can show the error state
              displayImages: completedImages > 0 // Show images if we have any
            };
          }
          return job;
        });
        
        // If the job has some completed images, still call handleJobComplete
        const currentJob = updatedJobs.find(j => j.id === jobId);
        if (currentJob) {
          const completedImageData = currentJob.generatedImages
            .filter(img => img !== null) as { url: string, seed: string | null, pipeline_id: string | null }[];
          
          if (completedImageData.length > 0) {
            const completedImageUrls = completedImageData.map(img => img.url);
            const lastImage = completedImageData[completedImageData.length - 1];
            
            handleJobComplete(completedImageUrls, {
              jobId,
              jobPrompt,
              jobStyle,
              jobRatio,
              jobLoraScale,
              pipeline_id: lastImage?.pipeline_id || pipeline_id,
              seed: lastImage?.seed || extractedSeed
            });
          }
        }
        
        return updatedJobs;
      });
      
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to process image'}`);
    }
  };
  
  // Poll immediately then every 5 seconds
  pollJob();
  pollingIntervalId = setInterval(pollJob, 5000) as unknown as number;
};
