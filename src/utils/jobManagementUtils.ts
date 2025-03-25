
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
    
    // Add a random query parameter to bust cache
    const cacheBuster = `?cache_bust=${Date.now()}`;
    
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) {
      console.error('Error fetching previous generations:', error);
      return [];
    }
    
    console.log('Fetched generations count:', data?.length || 0);
    
    // Log the first few and last few items to better debug potential issues
    if (data && data.length > 0) {
      const sampleSize = Math.min(data.length, 2);
      console.log(`First ${sampleSize} generations:`);
      for (let i = 0; i < sampleSize; i++) {
        console.log(`Item ${i}:`, JSON.stringify(data[i]));
      }
      
      if (data.length > 4) {
        console.log(`Last ${sampleSize} generations:`);
        for (let i = data.length - sampleSize; i < data.length; i++) {
          console.log(`Item ${i}:`, JSON.stringify(data[i]));
        }
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
    console.log(`STORAGE ATTEMPT: Storing ${generatedImages.length} ${isVideo ? 'videos' : 'images'} for user ${userId}`);
    console.log("Storage config:", JSON.stringify(jobConfig));
    
    // Prepare batch insert data with direct debugging
    console.log(`Preparing data for ${generatedImages.length} items`);
    const insertData = [];
    
    for (let i = 0; i < generatedImages.length; i++) {
      const imageUrl = generatedImages[i];
      if (!imageUrl) {
        console.error(`Image URL at index ${i} is null or undefined, skipping`);
        continue;
      }
      
      // Verify URL for debugging
      const urlSuggestsVideo = /\.(mp4|webm|mov)($|\?)/.test(imageUrl.toLowerCase());
      if (urlSuggestsVideo !== isVideo) {
        console.warn(`URL ${imageUrl.substring(0, 50)}... suggests video=${urlSuggestsVideo}, but flag is ${isVideo}`);
      }
      
      // Force the correct is_video flag based on URL if there's a mismatch
      const finalIsVideo = urlSuggestsVideo || isVideo;
      
      const item = {
        user_id: userId,
        image_url: imageUrl,
        prompt: jobConfig.jobPrompt || '',
        style: jobConfig.jobStyle || '',
        ratio: jobConfig.jobRatio || '',
        lora_scale: jobConfig.jobLoraScale || '',
        pipeline_id: jobConfig.pipeline_id || null,
        seed: typeof jobConfig.seed === 'number' ? 
              jobConfig.seed.toString() : 
              jobConfig.seed === 'random' ? '-1' : 
              jobConfig.seed || '-1',
        is_video: finalIsVideo
      };
      
      console.log(`STORAGE ITEM ${i}: `, JSON.stringify(item));
      insertData.push(item);
    }
    
    if (insertData.length === 0) {
      console.error('No valid items to insert after processing');
      return false;
    }
    
    console.log(`STORAGE INSERT: Attempting to insert ${insertData.length} rows into generated_images`);
    
    // Execute the insert with detailed error logging
    const { error, data } = await supabase
      .from('generated_images')
      .insert(insertData)
      .select();
    
    if (error) {
      console.error('STORAGE ERROR: Error storing generated images:', error);
      console.error('Error details:', error.details, error.hint, error.message);
      console.error('First insert item for reference:', JSON.stringify(insertData[0]));
      
      // Try individual inserts as fallback
      console.log('STORAGE FALLBACK: Attempting individual inserts');
      let successCount = 0;
      
      for (let i = 0; i < insertData.length; i++) {
        try {
          const { error: itemError } = await supabase
            .from('generated_images')
            .insert([insertData[i]]);
            
          if (itemError) {
            console.error(`STORAGE FALLBACK ERROR: Item ${i} failed:`, itemError);
          } else {
            successCount++;
          }
        } catch (e) {
          console.error(`STORAGE FALLBACK EXCEPTION: Item ${i} exception:`, e);
        }
      }
      
      console.log(`STORAGE FALLBACK COMPLETE: ${successCount}/${insertData.length} items stored successfully`);
      return successCount > 0;
    }
    
    console.log('STORAGE SUCCESS: Successfully stored images:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('First stored item ID:', data[0].id);
      console.log('First stored item is_video:', data[0].is_video);
    }
    
    // Force an immediate extra query to confirm items were stored
    try {
      const { data: checkData, error: checkError } = await supabase
        .from('generated_images')
        .select('id, image_url, is_video')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (checkError) {
        console.error('Error verifying stored data:', checkError);
      } else {
        console.log('Verification check - latest items:', checkData?.length || 0);
        if (checkData && checkData.length > 0) {
          console.log('Latest stored items:', JSON.stringify(checkData));
        }
      }
    } catch (checkErr) {
      console.error('Exception during verification check:', checkErr);
    }
    
    return true;
  } catch (error) {
    console.error('STORAGE EXCEPTION: Error in storeGeneratedImages:', error);
    return false;
  }
};
