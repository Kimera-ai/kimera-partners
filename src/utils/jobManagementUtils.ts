
import { supabase } from "@/integrations/supabase/client";
import { GenerationJobType } from "@/components/prompt-maker/GenerationJob";

export const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const createNewJob = (numImagesToGenerate: number, jobIdCounter: number, ratio: string, isVideo: boolean = false) => {
  const newJobId = `job-${jobIdCounter}`;
  const emptyImageArray = Array(numImagesToGenerate).fill(null);
  
  const job: GenerationJobType = {
    id: newJobId,
    status: "Starting...",
    completedImages: 0,
    totalImages: numImagesToGenerate,
    generatedImages: emptyImageArray,
    isCompleted: false,
    displayImages: false,
    startTime: Date.now(),
    elapsedTime: 0,
    isVideo: isVideo,
    ratio: ratio
  };
  
  return { job, newJobId };
};

export const fetchPreviousGenerations = async () => {
  try {
    console.log('Fetching previous generations...');
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Increased from 20 to 100 to show more history
    
    if (error) {
      console.error('Error fetching previous generations:', error);
      return [];
    }
    
    console.log('Fetched generations count:', data?.length || 0);
    
    // Log first few items for debugging
    if (data && data.length > 0) {
      const sampleSize = Math.min(data.length, 3);
      for (let i = 0; i < sampleSize; i++) {
        console.log(`Sample generation ${i}:`, JSON.stringify(data[i]));
      }
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchPreviousGenerations:', error);
    return [];
  }
};

export const storeGeneratedImages = async (
  session: any, 
  generatedImages: string[], 
  jobConfig: {
    jobPrompt: string;
    jobStyle: string;
    jobRatio: string;
    jobLoraScale: string;
    pipeline_id?: string;
    seed?: number | string;
    isVideo?: boolean;
  }
) => {
  if (!session?.user) {
    console.log("No user session, skipping storage");
    return false;
  }
  
  if (!generatedImages || generatedImages.length === 0) {
    console.error("No images to store");
    return false;
  }
  
  try {
    const userId = session.user.id;
    const isVideo = Boolean(jobConfig.isVideo);
    console.log(`Storing ${generatedImages.length} ${isVideo ? 'videos' : 'images'} for user ${userId}`);
    console.log("Storage config:", { 
      isVideo: isVideo,
      pipeline: jobConfig.pipeline_id,
      urls: generatedImages.map(url => url.substring(0, 50) + '...')
    });
    
    // Check if URLs indicate videos, even if the flag doesn't
    const urlsContainVideos = generatedImages.some(url => 
      /\.(mp4|webm|mov)($|\?)/.test(url.toLowerCase())
    );
    
    if (urlsContainVideos !== isVideo) {
      console.warn(`URL format suggests videos (${urlsContainVideos}) but isVideo flag is ${isVideo}`);
      // Trust the URLs if they explicitly show video extensions
      // But maintain the provided flag for consistency
    }
    
    // Prepare batch insert data
    const insertData = generatedImages.map(imageUrl => {
      // Verify each URL for debugging
      const urlSuggestsVideo = /\.(mp4|webm|mov)($|\?)/.test(imageUrl.toLowerCase());
      if (urlSuggestsVideo !== isVideo) {
        console.warn(`URL ${imageUrl.substring(0, 50)}... suggests video=${urlSuggestsVideo}, but flag is ${isVideo}`);
      }
      
      return {
        user_id: userId,
        image_url: imageUrl,
        prompt: jobConfig.jobPrompt,
        style: jobConfig.jobStyle,
        ratio: jobConfig.jobRatio,
        lora_scale: jobConfig.jobLoraScale,
        pipeline_id: jobConfig.pipeline_id,
        seed: typeof jobConfig.seed === 'number' ? 
              jobConfig.seed.toString() : 
              jobConfig.seed === 'random' ? '-1' : jobConfig.seed,
        is_video: isVideo // Now properly stored with our new column
      };
    });
    
    console.log("Inserting data:", JSON.stringify(insertData));
    
    // Use the existing generated_images table
    const { error, data } = await supabase
      .from('generated_images')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Error storing generated images:', error);
      console.error('Error details:', error.details, error.hint, error.message);
      return false;
    }
    
    console.log('Successfully stored images:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('First stored item ID:', data[0].id);
      console.log('First stored item is_video:', data[0].is_video);
    }
    return true;
  } catch (error) {
    console.error('Error in storeGeneratedImages:', error);
    return false;
  }
};
