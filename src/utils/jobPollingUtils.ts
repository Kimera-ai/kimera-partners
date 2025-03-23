
import { GenerationJobType } from "@/components/prompt-maker/GenerationJob";

type SetJobsFn = React.Dispatch<React.SetStateAction<GenerationJobType[]>>;

export const pollJobStatus = async (
  config: {
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
  },
  setGenerationJobs: SetJobsFn,
  handleJobComplete: (completedImages: string[], jobConfig: any) => Promise<void>
) => {
  const {
    apiJobId,
    imageIndex,
    jobId,
    jobPrompt,
    jobStyle,
    jobRatio,
    jobLoraScale,
    pipeline_id,
    seed,
    isVideo = false
  } = config;
  
  let lastStatus = '';
  let statusInterval: number;
  
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
      console.log(`Job status for ${apiJobId}:`, data);
      
      if (data.status !== lastStatus) {
        lastStatus = data.status;
        updateJobStatus(imageIndex, jobId, `Image ${imageIndex + 1}: ${data.status}`, setGenerationJobs);
      }
      
      if (data.status === 'completed') {
        clearInterval(statusInterval);
        
        // Get the generated image URL - handle different result structures for video vs image
        let imageUrl = null;
        
        if (isVideo) {
          // For video response
          console.log("Video job completed. Result:", data.result);
          
          // Check all possible paths where the URL might be
          imageUrl = data.result?.url ||                      // Direct URL property
                    data.result ||                           // Result might be the URL directly
                    (typeof data.result === 'string' ? data.result : null); // Result is a string
                    
          // Extract URL from quotes if needed
          if (typeof imageUrl === 'string' && imageUrl.includes('"')) {
            imageUrl = imageUrl.replace(/"/g, '');
          }
          
          console.log(`Extracted video URL: ${imageUrl}`);
        } else {
          // For image response
          imageUrl = data.result?.images?.[0] || null;
          console.log(`Extracted image URL: ${imageUrl}`);
        }
        
        if (imageUrl) {
          // Update the specific image in the job
          setGenerationJobs(prev => 
            prev.map(job => {
              if (job.id === jobId) {
                const updatedGeneratedImages = [...job.generatedImages];
                updatedGeneratedImages[imageIndex] = { 
                  url: imageUrl, 
                  seed: seed !== null ? seed.toString() : null,
                  pipeline_id: pipeline_id || null,
                  isVideo: isVideo
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
          
          // If all images are completed, call the handleJobComplete callback
          setGenerationJobs(prevJobs => {
            const job = prevJobs.find(j => j.id === jobId);
            if (job) {
              const updatedGeneratedImages = [...job.generatedImages];
              updatedGeneratedImages[imageIndex] = { 
                url: imageUrl, 
                seed: seed !== null ? seed.toString() : null,
                pipeline_id: pipeline_id || null,
                isVideo: isVideo
              };
              
              const allImagesCompleted = updatedGeneratedImages.every(img => img !== null);
              
              if (allImagesCompleted) {
                const imageUrls = updatedGeneratedImages
                  .filter(img => img !== null)
                  .map(img => (img as any).url);
                
                handleJobComplete(imageUrls, {
                  jobId,
                  jobPrompt,
                  jobStyle,
                  jobRatio,
                  jobLoraScale,
                  pipeline_id,
                  seed,
                  isVideo
                });
              }
            }
            return prevJobs;
          });
        } else {
          console.error(`Job ${apiJobId} completed but no ${isVideo ? 'video' : 'image'} URL found:`, data);
          
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
      
      errorCount++;
    }
  };
  
  // Check immediately, then set up polling
  let errorCount = 0;
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
