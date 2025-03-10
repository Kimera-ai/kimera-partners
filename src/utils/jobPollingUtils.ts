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
  const MAX_POLLING_ATTEMPTS = 90; // 7.5 minutes at 5-second intervals
  const MAX_TIME_WITHOUT_PROGRESS = 36; // 3 minutes without progress (36 * 5 seconds = 3 minutes)
  let lastProgressTime = Date.now();
  let lastStatus = '';
  
  // Define extractedSeed at a higher scope so it's available throughout the function
  let extractedSeed: string | null = null;
  
  // Set a timeout for the entire polling operation (3 minutes = 180000ms)
  const GLOBAL_TIMEOUT = 180000; 
  const timeoutId = setTimeout(() => {
    // If we reach this point, the polling is taking too long
    console.warn(`Global timeout reached for image ${imageIndex} in job ${jobId}`);
    
    // Clear the polling interval
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }
    
    // Update the job to show the timeout
    setGenerationJobs(prevJobs => {
      return prevJobs.map(job => {
        if (job.id === jobId) {
          // Count completed images (non-null entries in the array)
          const completedImages = job.generatedImages.filter(img => img !== null).length;
          const hasAnyCompletedImages = completedImages > 0;
          
          // If we have any completed images, mark as partial success
          if (hasAnyCompletedImages) {
            const updatedStatus = `Completed with ${completedImages}/${job.totalImages} images`;
            
            // Get the completed image URLs to pass to the completion handler
            const completedImageData = job.generatedImages
              .filter(img => img !== null) as { url: string, seed: string | null, pipeline_id: string | null }[];
            const completedImageUrls = completedImageData.map(img => img.url);
            
            if (completedImageData.length > 0) {
              const lastImage = completedImageData[completedImageData.length - 1];
              
              // Call the completion handler with partial results
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
            
            return {
              ...job,
              status: updatedStatus,
              isCompleted: true,
              displayImages: true,
              error: `Some images could not be generated (timeout after 3 minutes)`
            };
          } else {
            // If no images completed at all, mark as error
            return {
              ...job,
              status: "Error: Generation timed out",
              isCompleted: true,
              error: "Image generation timed out after 3 minutes"
            };
          }
        }
        return job;
      });
    });
    
    toast.error(`Generation took too long and was stopped after 3 minutes`);
    
  }, GLOBAL_TIMEOUT);
  
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
        clearTimeout(timeoutId); // Clear the global timeout
        
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
              // Create a copy of the existing generatedImages array
              const updatedImages = [...job.generatedImages];
              
              // Update the specific image at the correct index
              updatedImages[imageIndex] = {
                url: imageUrl,
                seed: extractedSeed,
                pipeline_id: responsePipelineId || pipeline_id
              };
              
              // Count completed images (non-null entries in the array)
              const completedImagesCount = updatedImages.filter(img => img !== null).length;
              
              // Check if all images are complete
              const allImagesCompleted = completedImagesCount === job.totalImages;
              
              // Always set displayImages to true so images show as they complete
              // This is key to fixing the issue where some images don't display
              return {
                ...job,
                generatedImages: updatedImages,
                completedImages: completedImagesCount,
                status: allImagesCompleted 
                  ? "All images generated successfully!" 
                  : `Generated ${completedImagesCount} of ${job.totalImages} images...`,
                isCompleted: allImagesCompleted,
                displayImages: true, // Always show images as they complete
                error: null // Clear any error state
              };
            }
            return job;
          });
          
          // Check if this was the last image for the job and call handleJobComplete if needed
          const currentJob = updatedJobs.find(j => j.id === jobId);
          if (currentJob && currentJob.isCompleted) {
            const completedImageData = currentJob.generatedImages
              .filter(img => img !== null) as { url: string, seed: string | null, pipeline_id: string | null }[];
            const completedImageUrls = completedImageData.map(img => img.url);
            
            const lastImage = completedImageData[completedImageData.length - 1];
            
            // This calls the completion handler for the entire job
            handleJobComplete(completedImageUrls, {
              jobId,
              jobPrompt,
              jobStyle,
              jobRatio,
              jobLoraScale,
              pipeline_id: lastImage?.pipeline_id || pipeline_id,
              seed: lastImage?.seed || extractedSeed
            });
          } else if (currentJob) {
            // If job isn't complete but this image is done, log for debugging
            console.log(`Image ${imageIndex + 1}/${currentJob.totalImages} complete for job ${jobId}`);
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
          clearTimeout(timeoutId); // Clear the global timeout
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
                    displayImages: true, // Force display of available images
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
          clearTimeout(timeoutId); // Clear the global timeout
        }
      }
    } catch (error) {
      clearInterval(pollingIntervalId);
      clearTimeout(timeoutId); // Clear the global timeout
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
            
            // Even if there was an error, complete the job with available images
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
  
  // Return a function to manually cancel polling if needed
  return () => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }
    clearTimeout(timeoutId);
  };
};
