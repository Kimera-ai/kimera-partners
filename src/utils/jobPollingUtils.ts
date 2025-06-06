
import { GenerationJobType } from "@/components/prompt-maker/GenerationJob";

type SetJobsFn = React.Dispatch<React.SetStateAction<GenerationJobType[]>>;

// Update the type signature of handleJobComplete to match usage in useGenerationJobs.ts
export const pollJobStatus = async (
  config: {
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
  },
  setGenerationJobs: SetJobsFn,
  // Changed return type to Promise<boolean> to match implementation
  handleJobComplete: (completedImages: string[], jobConfig: any) => Promise<boolean>
) => {
  const {
    apiJobId,
    imageIndex,
    jobId,
    jobPrompt,
    jobStyle,
    jobRatio,
    jobLoraScale,
    jobWorkflow,
    pipeline_id,
    seed,
    isVideo = false
  } = config;
  
  console.log(`Starting job polling for ${apiJobId}, isVideo=${isVideo}, workflow=${jobWorkflow || 'undefined'}`);
  
  let lastStatus = '';
  let statusInterval: number;
  let errorCount = 0;
  
  const checkJobStatus = async () => {
    try {
      const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${apiJobId}`, {
        method: 'GET',
        headers: {
          'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee",
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Job ${apiJobId} status check failed:`, errorText);
        
        updateJobStatus(imageIndex, jobId, `Error: ${response.status} ${response.statusText}`, setGenerationJobs);
        clearInterval(statusInterval);
        
        // Mark job as completed with error
        setGenerationJobs(prev => 
          prev.map(job => 
            job.id === jobId ? { 
              ...job, 
              isCompleted: true, 
              error: `Failed to check job status: ${response.status} ${response.statusText}` 
            } : job
          )
        );
        return;
      }
      
      const data = await response.json();
      
      if (data.status !== lastStatus) {
        lastStatus = data.status;
        updateJobStatus(imageIndex, jobId, `Image ${imageIndex + 1}: ${data.status}`, setGenerationJobs);
      }
      
      if (data.status === 'completed') {
        console.log(`Job ${apiJobId} completed. Full response:`, JSON.stringify(data));
        clearInterval(statusInterval);
        
        // Get the generated image URL - handle different result structures for video vs image
        let imageUrl = null;
        
        if (isVideo) {
          // For video response - improved detection
          console.log("Video job completed. Result structure:", JSON.stringify(data.result));
          
          // Try multiple possible paths for video URL
          if (typeof data.result === 'string') {
            // Direct string URL (possibly quoted)
            imageUrl = data.result.replace(/^"|"$/g, '');
          } else if (data.result?.url) {
            // Object with url property
            imageUrl = data.result.url;
          } else if (data.result?.video) {
            // Object with video property
            imageUrl = data.result.video;
          } else if (Array.isArray(data.result) && data.result.length > 0) {
            // Array of results, take first
            imageUrl = typeof data.result[0] === 'string' 
              ? data.result[0] 
              : data.result[0]?.url || data.result[0]?.video;
          }
          
          console.log(`Extracted video URL: ${imageUrl}`);
        } else {
          // For image response - improved detection
          console.log("Image job completed. Result structure:", JSON.stringify(data.result));
          
          // Try multiple possible paths for image URL
          if (data.result?.images && Array.isArray(data.result.images)) {
            // Standard format with images array
            imageUrl = data.result.images[0];
          } else if (typeof data.result === 'string') {
            // Direct string URL
            imageUrl = data.result;
          } else if (data.result?.url) {
            // Object with url property
            imageUrl = data.result.url;
          } else if (data.result?.image) {
            // Object with image property
            imageUrl = data.result.image;
          } else if (Array.isArray(data.result) && data.result.length > 0) {
            // Array of results, take first
            imageUrl = typeof data.result[0] === 'string' 
              ? data.result[0] 
              : data.result[0]?.url || data.result[0]?.image;
          }
          
          console.log(`Extracted image URL: ${imageUrl}`);
        }
        
        if (imageUrl) {
          // Double check the isVideo flag is correct based on URL
          const urlSuggestsVideo = /\.(mp4|webm|mov)($|\?)/.test(imageUrl.toLowerCase());
          if (urlSuggestsVideo !== isVideo) {
            console.warn(`Possible isVideo mismatch: passed isVideo=${isVideo}, but URL suggests video=${urlSuggestsVideo}`);
          }
          
          console.log(`Updating job with extracted URL and isVideo=${isVideo}, workflow=${jobWorkflow || 'undefined'}`);
          
          // Update the specific image in the job
          setGenerationJobs(prev => 
            prev.map(job => {
              if (job.id === jobId) {
                const updatedGeneratedImages = [...job.generatedImages];
                updatedGeneratedImages[imageIndex] = { 
                  url: imageUrl, 
                  seed: seed !== null ? seed.toString() : null,
                  pipeline_id: pipeline_id || null,
                  isVideo: Boolean(isVideo)
                };
                
                const completedImagesCount = updatedGeneratedImages.filter(img => img !== null).length;
                const allImagesCompleted = completedImagesCount === job.totalImages;
                
                return { 
                  ...job, 
                  generatedImages: updatedGeneratedImages,
                  completedImages: completedImagesCount,
                  isCompleted: allImagesCompleted,
                  displayImages: true
                };
              }
              return job;
            })
          );
          
          // Check if all images in this job are completed
          setGenerationJobs(prevJobs => {
            const job = prevJobs.find(j => j.id === jobId);
            if (job) {
              const updatedGeneratedImages = [...job.generatedImages];
              updatedGeneratedImages[imageIndex] = { 
                url: imageUrl, 
                seed: seed !== null ? seed.toString() : null,
                pipeline_id: pipeline_id || null,
                isVideo: Boolean(isVideo)
              };
              
              const allImagesCompleted = updatedGeneratedImages.every(img => img !== null);
              
              if (allImagesCompleted) {
                const imageUrls = updatedGeneratedImages
                  .filter(img => img !== null)
                  .map(img => (img as any).url);
                
                // Call handleJobComplete with completed URLs and job config
                console.log("All images completed for job, passing to handleJobComplete:", {
                  jobId,
                  jobPrompt,
                  jobStyle,
                  jobRatio,
                  jobLoraScale,
                  jobWorkflow,
                  pipeline_id,
                  seed,
                  isVideo
                });
                
                // Manually delay this slightly to ensure UI updates first
                setTimeout(() => {
                  handleJobComplete(imageUrls, {
                    jobId,
                    jobPrompt,
                    jobStyle,
                    jobRatio,
                    jobLoraScale,
                    jobWorkflow,
                    pipeline_id,
                    seed,
                    isVideo
                  });
                }, 500);
              }
            }
            return prevJobs;
          });
        } else {
          console.error(`Job ${apiJobId} completed but no ${isVideo ? 'video' : 'image'} URL found. Full response:`, JSON.stringify(data));
          
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId ? { 
                ...job, 
                isCompleted: true, 
                error: `Job completed but no ${isVideo ? 'video' : 'image'} URL found` 
              } : job
            )
          );
        }
      } else if (data.status === 'failed') {
        clearInterval(statusInterval);
        
        setGenerationJobs(prev => 
          prev.map(job => 
            job.id === jobId ? { 
              ...job, 
              isCompleted: true, 
              error: `${isVideo ? 'Video' : 'Image'} generation failed: ${data.error || 'Unknown error'}` 
            } : job
          )
        );
      }
    } catch (error) {
      console.error(`Error checking job ${apiJobId} status:`, error);
      
      updateJobStatus(imageIndex, jobId, `Error checking status`, setGenerationJobs);
      
      // After 5 consecutive errors, stop polling
      errorCount++;
      if (errorCount >= 5) {
        clearInterval(statusInterval);
        
        setGenerationJobs(prev => 
          prev.map(job => 
            job.id === jobId ? { 
              ...job, 
              isCompleted: true, 
              error: `Failed to check job status after multiple attempts` 
            } : job
          )
        );
      }
    }
  };
  
  // Check immediately, then set up polling
  await checkJobStatus();
  statusInterval = setInterval(checkJobStatus, 2000) as unknown as number;
};

const updateJobStatus = (
  imageIndex: number, 
  jobId: string, 
  status: string, 
  setGenerationJobs: SetJobsFn
) => {
  setGenerationJobs(prev => 
    prev.map(job => {
      if (job.id === jobId) {
        return { 
          ...job, 
          status: job.totalImages > 1 ? `Processing ${job.completedImages}/${job.totalImages} (${status})` : status
        };
      }
      return job;
    })
  );
};
