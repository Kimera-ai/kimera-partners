
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
    
    // Query with distinct on image_url to reduce duplicates at the database level
    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);  // Increased from 100 to 200
    
    if (error) {
      console.error('Error fetching previous generations:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} previous generations`);
    
    // Process data to handle potential duplicates
    if (data && data.length > 0) {
      console.log('Sample generation data:', JSON.stringify(data[0]));
      
      // First-level deduplication: Use a Map with ID as primary key
      const uniqueById = new Map();
      const duplicateUrls = new Set();
      
      // First pass: Collect all IDs and track duplicate URLs
      data.forEach(item => {
        if (!item.image_url) return;
        
        // Check if we already have an item with this ID
        if (item.id && !uniqueById.has(item.id)) {
          uniqueById.set(item.id, item);
        }
      });
      
      // Second pass: Add items by URL for items without ID
      const uniqueByUrl = new Map();
      
      data.forEach(item => {
        if (!item.image_url) return;
        
        // Skip items already added by ID
        if (item.id && uniqueById.has(item.id)) return;
        
        // Normalize URL by removing query parameters
        const normalizedUrl = item.image_url.split('?')[0];
        
        if (!uniqueByUrl.has(normalizedUrl)) {
          uniqueByUrl.set(normalizedUrl, item);
        } else {
          duplicateUrls.add(normalizedUrl);
        }
      });
      
      // Combine results
      const combinedResults = [
        ...Array.from(uniqueById.values()),
        ...Array.from(uniqueByUrl.values())
      ];
      
      // Third-level deduplication: Check for visually similar images using URL patterns
      const baseUrlMap = new Map();
      
      combinedResults.forEach(item => {
        // Extract base filename without parameters and hash
        const basePath = item.image_url.split('?')[0].split('#')[0];
        // Remove source/output variations in filenames
        const basePathKey = basePath.replace(/(_source|_output)\.jpeg$/, '').replace(/(_source|_output)\.jpg$/, '');
        
        if (!baseUrlMap.has(basePathKey)) {
          baseUrlMap.set(basePathKey, []);
        }
        baseUrlMap.get(basePathKey).push(item);
      });
      
      // For each group of similar images, keep only the newest one
      const finalResults = [];
      
      baseUrlMap.forEach(itemsGroup => {
        if (itemsGroup.length === 1) {
          finalResults.push(itemsGroup[0]);
        } else {
          // Sort by creation date (newest first)
          const sorted = [...itemsGroup].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });
          
          // Keep only the newest
          finalResults.push(sorted[0]);
        }
      });
      
      // Sort by creation date (newest first)
      finalResults.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      
      if (finalResults.length < data.length) {
        console.log(`Strong deduplication reduced items from ${data.length} to ${finalResults.length}`);
      }
      
      return finalResults;
    } else {
      console.log('No generations found in the database');
      return [];
    }
  } catch (error) {
    console.error('Error in fetchPreviousGenerations:', error);
    return [];
  }
};

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
      
      // Ensure workflow is correctly set based on jobConfig or isVideo
      let workflowToStore = jobConfig.jobWorkflow || 'no-reference';
      
      // If it's a video, ensure workflow is set to 'video'
      if (isVideo) {
        workflowToStore = 'video';
      }
      
      const item = {
        user_id: userId,
        image_url: imageUrl,
        prompt: jobConfig.jobPrompt || '',
        style: jobConfig.jobStyle || '',
        ratio: jobConfig.jobRatio || '',
        lora_scale: jobConfig.jobLoraScale || '',
        workflow: workflowToStore,
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
