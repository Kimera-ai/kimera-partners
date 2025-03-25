
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
    // Simple query, no cache busting to improve performance
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching previous generations:', error);
      return [];
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
    jobWorkflow?: string;
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
    
    // Prepare batch insert data
    const insertData = [];
    
    for (let i = 0; i < generatedImages.length; i++) {
      const imageUrl = generatedImages[i];
      if (!imageUrl) {
        continue;
      }
      
      const item = {
        user_id: userId,
        image_url: imageUrl,
        prompt: jobConfig.jobPrompt || '',
        style: jobConfig.jobStyle || '',
        ratio: jobConfig.jobRatio || '',
        lora_scale: jobConfig.jobLoraScale || '',
        workflow: jobConfig.jobWorkflow || '',
        pipeline_id: jobConfig.pipeline_id || null,
        seed: typeof jobConfig.seed === 'number' ? 
              jobConfig.seed.toString() : 
              jobConfig.seed === 'random' ? '-1' : 
              jobConfig.seed || '-1',
        is_video: isVideo
      };
      
      insertData.push(item);
    }
    
    if (insertData.length === 0) {
      console.error('No valid items to insert after processing');
      return false;
    }
    
    // Batch insert for better performance
    const { error } = await supabase
      .from('generated_images')
      .insert(insertData);
    
    if (error) {
      console.error('Error storing generated images:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in storeGeneratedImages:', error);
    return false;
  }
};
