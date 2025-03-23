
import { supabase } from "@/integrations/supabase/client";
import { GenerationJobType } from "@/components/prompt-maker/GenerationJob";

export const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const createNewJob = (numImagesToGenerate: number, jobIdCounter: number, isVideo: boolean = false) => {
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
    isVideo: isVideo
  };
  
  return { job, newJobId };
};

export const fetchPreviousGenerations = async () => {
  try {
    // Use a raw query instead of the typed query to work around the TypeScript error
    // This is a temporary solution until the Supabase schema is updated
    const { data, error } = await supabase
      .from('user_generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20) as any;
    
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
    pipeline_id?: string;
    seed?: number | string;
    isVideo?: boolean;
  }
) => {
  if (!session?.user) return false;
  
  try {
    const userId = session.user.id;
    
    // Prepare batch insert data
    const insertData = generatedImages.map(imageUrl => ({
      user_id: userId,
      image_url: imageUrl,
      prompt: jobConfig.jobPrompt,
      style: jobConfig.jobStyle,
      ratio: jobConfig.jobRatio,
      lora_scale: jobConfig.jobLoraScale,
      pipeline_id: jobConfig.pipeline_id,
      seed: typeof jobConfig.seed === 'number' ? jobConfig.seed : 
            jobConfig.seed === 'random' ? -1 : parseInt(jobConfig.seed as string) || -1,
      is_video: jobConfig.isVideo || false
    }));
    
    // Use a raw query instead of the typed query to work around the TypeScript error
    const { error } = await supabase
      .from('user_generations')
      .insert(insertData) as any;
    
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
