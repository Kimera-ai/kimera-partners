
import { GenerationJobType } from '@/components/prompt-maker/GenerationJob';
import { supabase } from "@/integrations/supabase/client";

export const formatTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

export const createNewJob = (
  numImagesToGenerate: number, 
  jobIdCounter: number
): { job: GenerationJobType, newJobId: string } => {
  const jobId = `job-${jobIdCounter}`;
  
  // Create a new generation job with the correct number of images
  const newJob: GenerationJobType = {
    id: jobId,
    status: "Starting pipeline...",
    completedImages: 0,
    totalImages: numImagesToGenerate,
    generatedImages: new Array(numImagesToGenerate).fill(null),
    isCompleted: false,
    displayImages: false, // Initially set to false, will be set to true when all images are complete
    startTime: Date.now(),
    elapsedTime: 0
  };
  
  return { job: newJob, newJobId: jobId };
};

export const storeGeneratedImages = async (
  session: any,
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
) => {
  const { jobPrompt, jobStyle, jobRatio, jobLoraScale, pipeline_id, seed } = jobConfig;
  
  try {
    console.log("Storing generated images with data:", { 
      images: completedImages.length,
      prompt: jobPrompt,
      style: jobStyle,
      ratio: jobRatio,
      lora_scale: jobLoraScale,
      pipeline_id,
      seed
    });
    
    // Convert any seed value to string before storing
    const seedString = seed !== undefined ? String(seed) : null;
    
    await Promise.all(completedImages.map(imageUrl => 
      supabase.from('generated_images').insert({
        user_id: session?.user?.id,
        image_url: imageUrl,
        prompt: jobPrompt,
        style: jobStyle,
        ratio: jobRatio,
        lora_scale: jobLoraScale,
        pipeline_id: pipeline_id || null,
        seed: seedString
      })
    ));
    return true;
  } catch (error) {
    console.error('Error storing generations:', error);
    return false;
  }
};

export const fetchPreviousGenerations = async () => {
  try {
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const uniqueGenerations = data?.filter((gen, index, self) => 
      index === self.findIndex(g => g.image_url === gen.image_url)
    ) || [];
    
    return uniqueGenerations;
  } catch (error) {
    console.error('Error fetching previous generations:', error);
    return [];
  }
};
