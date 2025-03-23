
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
    ratio: ratio  // Add the ratio to the job
  };
  
  return { job, newJobId };
};

export const fetchPreviousGenerations = async () => {
  try {
    // Use the existing generated_images table instead of user_generations
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching previous generations:', error);
      return [];
    }
    
    console.log('Fetched generations count:', data?.length || 0);
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
    console.log(`Storing ${generatedImages.length} images for user ${userId}`);
    
    // Prepare batch insert data - convert all values to the expected types
    const insertData = generatedImages.map(imageUrl => ({
      user_id: userId,
      image_url: imageUrl,
      prompt: jobConfig.jobPrompt,
      style: jobConfig.jobStyle,
      ratio: jobConfig.jobRatio,
      lora_scale: jobConfig.jobLoraScale,
      pipeline_id: jobConfig.pipeline_id,
      // Convert seed to string, which is what the database schema expects
      seed: typeof jobConfig.seed === 'number' ? 
            jobConfig.seed.toString() : 
            jobConfig.seed === 'random' ? '-1' : jobConfig.seed
      // Note: We removed is_video as it's not in the database schema
    }));
    
    console.log("Inserting data:", insertData.length, "rows");
    
    // Use the existing generated_images table
    const { error, data } = await supabase
      .from('generated_images')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('Error storing generated images:', error);
      return false;
    }
    
    console.log('Successfully stored images:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('Error in storeGeneratedImages:', error);
    return false;
  }
};
