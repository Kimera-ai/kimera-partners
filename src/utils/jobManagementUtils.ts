
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
    // Generate unique cache-busting timestamp
    const timestamp = new Date().getTime();
    
    console.log(`Fetching previous generations with timestamp: ${timestamp}`);
    
    // Use a distinct query to avoid duplicates when possible
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching previous generations:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} previous generations`);
    
    // Pre-process data to handle potential duplicates
    if (data && data.length > 0) {
      console.log('Sample generation data:', JSON.stringify(data[0]));
      
      // Use a Map to deduplicate by ID
      const uniqueItems = new Map();
      
      data.forEach(item => {
        if (item.id && !uniqueItems.has(item.id)) {
          uniqueItems.set(item.id, item);
        }
      });
      
      // If we have significantly fewer items after deduplication, log this
      if (uniqueItems.size < data.length * 0.9) {
        console.log(`Deduplication removed ${data.length - uniqueItems.size} items`);
      }
      
      // Return as array
      return Array.from(uniqueItems.values());
    } else {
      console.log('No generations found in the database');
      return [];
    }
  } catch (error) {
    console.error('Error in fetchPreviousGenerations:', error);
    return [];
  }
};

// Define a proper interface for the job configuration
interface JobConfig {
  jobPrompt: string;
  jobStyle: string;
  jobRatio: string;
  jobLoraScale: string;
  jobWorkflow?: string;
  pipeline_id?: string;
  seed?: number | string;
  isVideo?: boolean;
}

export const storeGeneratedImages = async (
  session: any, 
  generatedImages: string[], 
  jobConfig: JobConfig
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
    
    console.log(`Storing ${generatedImages.length} ${isVideo ? 'videos' : 'images'} with user ID: ${userId}`);
    console.log('Storage config:', {
      prompt: jobConfig.jobPrompt,
      style: jobConfig.jobStyle,
      ratio: jobConfig.jobRatio,
      workflow: jobConfig.jobWorkflow,
      isVideo
    });
    
    // Prepare batch insert data
    const insertData = [];
    
    for (let i = 0; i < generatedImages.length; i++) {
      const imageUrl = generatedImages[i];
      if (!imageUrl) {
        console.warn(`Skipping null image URL at index ${i}`);
        continue;
      }
      
      console.log(`Processing URL for storage (${i+1}/${generatedImages.length}): ${imageUrl.substring(0, 50)}...`);
      
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
    
    // Use multiple insertion methods for redundancy
    let successResult = false;
    
    // First try: Direct insert with less data
    console.log(`Attempt 1: Basic insert with ${insertData.length} items...`);
    const basicInsert = await supabase
      .from('generated_images')
      .insert(insertData.map(item => ({
        user_id: item.user_id,
        image_url: item.image_url,
        prompt: item.prompt,
        style: item.style,
        is_video: item.is_video
      })));
      
    if (!basicInsert.error) {
      console.log('Basic insert successful');
      successResult = true;
    } else {
      console.error('Basic insert failed:', basicInsert.error);
      
      // Second try: Insert one by one
      console.log('Attempt 2: One-by-one insertion...');
      let insertCount = 0;
      
      for (const item of insertData) {
        const { error } = await supabase
          .from('generated_images')
          .insert([{
            user_id: item.user_id,
            image_url: item.image_url,
            prompt: item.prompt,
            style: item.style,
            is_video: item.is_video
          }]);
          
        if (!error) {
          insertCount++;
        }
      }
      
      console.log(`One-by-one insertion: ${insertCount}/${insertData.length} successful`);
      successResult = insertCount > 0;
    }
    
    // Force delay to ensure DB writes complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return successResult;
  } catch (error) {
    console.error('Error in storeGeneratedImages:', error);
    return false;
  }
};
