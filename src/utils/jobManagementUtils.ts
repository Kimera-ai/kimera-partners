import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

export const createNewJob = (numImagesToGenerate: number, jobIdCounter: number, ratio: string, isVideo: boolean = false) => {
  const newJobId = `job-${jobIdCounter}-${uuidv4()}`;
  
  const newJob = {
    id: newJobId,
    status: 'Pending',
    completedImages: 0,
    totalImages: numImagesToGenerate,
    generatedImages: Array(numImagesToGenerate).fill(null),
    isCompleted: false,
    displayImages: false,
    startTime: Date.now(),
    elapsedTime: 0,
    isVideo: isVideo,
    ratio: ratio
  };

  return { job: newJob, newJobId };
};

export const fetchPreviousGenerations = async () => {
  try {
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching previous generations:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching previous generations:", error);
    return [];
  }
};

export const storeGeneratedImages = async (
  session: any, 
  imageUrls: string[], 
  config: {
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
    console.log("No user session, can't store images");
    return false;
  }

  try {
    console.log(`Storing ${imageUrls.length} ${config.isVideo ? 'videos' : 'images'} with config:`, JSON.stringify(config));
    
    const storagePromises = imageUrls.map(imageUrl => {
      return supabase
        .from('generated_images')
        .insert({
          user_id: session.user.id,
          image_url: imageUrl,
          prompt: config.jobPrompt,
          style: config.jobStyle,
          ratio: config.jobRatio,
          lora_scale: config.jobLoraScale,
          workflow: config.jobWorkflow,
          pipeline_id: config.pipeline_id,
          seed: config.seed !== undefined ? String(config.seed) : null,
          is_video: config.isVideo || false
        });
    });
    
    const results = await Promise.all(storagePromises);
    
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error("Some images failed to store:", errors);
      return false;
    }

    console.log("All images stored successfully");
    return true;
  } catch (error) {
    console.error("Error storing generated images:", error);
    return false;
  }
};

export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
