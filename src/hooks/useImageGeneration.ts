
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CREDITS_PER_GENERATION = 14;
const VIDEO_CREDITS_PER_GENERATION = 72;

export const useImageGeneration = (
  session: any,
  credits: number | null,
  isLoadingCredits: boolean,
  updateUserCredits: (creditsToDeduct: number) => Promise<boolean>,
  setCredits: (creditsFn: ((prev: number | null) => number | null)) => void,
  startNewJob: (numImagesToGenerate: number, ratio: string, isVideo?: boolean) => string,
  updateJobStatus: (jobId: string, status: string) => void,
  pollJobStatus: (config: {
    apiJobId: string;
    imageIndex: number;
    jobId: string;
    jobPrompt: string;
    jobStyle: string;
    jobRatio: string;
    jobLoraScale: string;
    jobWorkflow?: string;
    pipeline_id?: string;
    seed?: number | string;
    isVideo?: boolean;
  }) => void,
  uploadedImageUrl: string | null
) => {
  const [workflow, setWorkflow] = useState("no-reference");
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("2:3");
  const [style, setStyle] = useState("Photographic");
  const [loraScale, setLoraScale] = useState("0.5");
  const [seed, setSeed] = useState("random");
  const [numberOfImages, setNumberOfImages] = useState("1");
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const getCreditsPerGeneration = useCallback(() => {
    return workflow === "video" ? VIDEO_CREDITS_PER_GENERATION : CREDITS_PER_GENERATION;
  }, [workflow]);

  const handleImprovePrompt = async () => {
    if (isImprovingPrompt) return;
    
    if (workflow === 'video' && !uploadedImageUrl) {
      toast.error("Please upload an image for Video Generator mode first");
      return;
    }
    
    if (!prompt && workflow !== 'video') {
      toast.warning("Please enter a basic prompt to improve");
      return;
    }
    
    try {
      setIsImprovingPrompt(true);
      
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: { 
          prompt,
          workflow,
          imageUrl: uploadedImageUrl
        }
      });
      
      if (error) throw error;
      
      if (data?.improvedPrompt) {
        setPrompt(data.improvedPrompt);
        
        const successMessage = workflow === 'video' 
          ? "Your prompt has been enhanced with cinematic details based on your image."
          : "Your prompt has been enhanced with more details.";
          
        toast.success(successMessage);
      } else {
        throw new Error("No improved prompt returned from the API");
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      
      const errorMessage = workflow === 'video'
        ? "Failed to analyze the image. Please try again or use a different image."
        : "Failed to improve the prompt. Please try again.";
        
      toast.error(errorMessage);
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      
      if (!session?.user) {
        toast.error("Please sign in to generate images.");
        return;
      }
      
      const numImages = parseInt(numberOfImages);
      const creditsPerGeneration = getCreditsPerGeneration();
      const totalCost = creditsPerGeneration * numImages;
      const isVideoGeneration = workflow === 'video';
      
      if (credits === null || isLoadingCredits) {
        toast.info("Please wait while we check your available credits.");
        return;
      }
      
      if (credits < totalCost) {
        toast.error(`You need ${totalCost} credits to generate ${numImages} ${isVideoGeneration ? 'video' : 'image'}${numImages === 1 ? '' : 's'}, but you only have ${credits}.`);
        return;
      }

      if ((workflow === 'with-reference' || workflow === 'cartoon' || workflow === 'video') && !uploadedImageUrl) {
        toast.error(`Please upload an image when using the ${
          workflow === 'with-reference' ? 'Face Gen' : 
          workflow === 'video' ? 'Video Generator' : 'Reference Mode'
        } workflow.`);
        return;
      }

      const jobId = startNewJob(numImages, ratio, isVideoGeneration);
      
      updateJobStatus(jobId, `Preparing to generate ${numImages} ${isVideoGeneration ? 'videos' : 'images'}...`);
      
      // Default image URLs - using the correct one for Ideogram
      const defaultImageUrl = "https://www.jeann.online/cdn-cgi/image/format=jpeg/https://kimera-media.s3.eu-north-1.amazonaws.com/623b36fe-ac7f-4c56-a124-cddb942a38e5_event/623b36fe-ac7f-4c56-a124-cddb942a38e5_source.jpeg";
      const defaultIdeogramImageUrl = "https://www.jeann.online/cdn-cgi/image/format=png/https://kimera-media.s3.eu-north-1.amazonaws.com/ec9f7b54-7339-4faf-90ba-f12f54cbe3da/v2_JkeUSRWiMl_source.png";
      
      updateJobStatus(jobId, `Sending ${numImages} requests to Kimera API...`);
      
      const generateRequests = [];
      const currentPrompt = prompt.trim();
      const currentWorkflow = workflow;
      const currentRatio = ratio;
      const currentStyle = style;
      const currentLoraScale = loraScale;
      const currentSeed = seed;
      const currentUploadedImageUrl = uploadedImageUrl;
      
      if (currentWorkflow === 'no-reference' && !currentPrompt) {
        throw new Error('Please enter a prompt when using the Image Generator mode');
      }
      
      const fullPrompt = currentPrompt ? `${currentStyle} style: ${currentPrompt}` : `${currentStyle} this image`;
      
      // Create requests in parallel
      for (let i = 0; i < numImages; i++) {
        const seedValue = currentSeed === "random" ? -1 : parseInt(currentSeed);
        
        // Use different default image based on workflow
        const effectiveImageUrl = currentUploadedImageUrl || 
                                 (currentWorkflow === 'ideogram' ? defaultIdeogramImageUrl : defaultImageUrl);
        
        // Use supabase function to handle all API logic
        generateRequests.push(supabase.functions.invoke('run-pipeline', {
          body: {
            imageUrl: effectiveImageUrl,
            ratio: currentRatio,
            prompt: fullPrompt,
            loraScale: parseFloat(currentLoraScale),
            style: currentStyle,
            seed: seedValue,
            workflow: currentWorkflow,
            isVideo: isVideoGeneration
          }
        }));
      }
      
      // Use Promise.all for parallel fetching
      const responses = await Promise.all(generateRequests);
      
      const responseErrors = [];
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        if (response.error) {
          responseErrors.push(`${isVideoGeneration ? 'Video' : 'Image'} ${i+1}: ${response.error || 'Unknown error'}`);
        }
      }
      
      if (responseErrors.length === responses.length) {
        throw new Error(`All requests failed: ${responseErrors.join(', ')}`);
      }
      
      if (responseErrors.length > 0) {
        toast.warning(`${responseErrors.length} of ${responses.length} requests failed. Continuing with successful ones.`);
        updateJobStatus(jobId, `Processing ${responses.length - responseErrors.length} of ${numImages} ${isVideoGeneration ? 'videos' : 'images'}...`);
      }
      
      const successfulResponses = responses.filter(r => !r.error);
      const apiJobIds = successfulResponses.map(response => response.data?.id).filter(Boolean);
      
      if (apiJobIds.length === 0) {
        throw new Error("Failed to start any generation jobs");
      }
      
      updateJobStatus(jobId, `Processing ${apiJobIds.length} ${isVideoGeneration ? 'videos' : 'images'}...`);
      
      // Start polling for each job
      apiJobIds.forEach((apiJobId, index) => {
        pollJobStatus({
          apiJobId,
          imageIndex: index,
          jobId,
          jobPrompt: currentPrompt,
          jobStyle: currentStyle,
          jobRatio: currentRatio,
          jobLoraScale: currentLoraScale,
          jobWorkflow: currentWorkflow,
          seed: currentSeed === "random" ? -1 : parseInt(currentSeed),
          isVideo: isVideoGeneration
        });
      });
      
      // Update credits only once
      const actualCost = creditsPerGeneration * apiJobIds.length;
      const creditUpdateSuccess = await updateUserCredits(actualCost);
      
      if (creditUpdateSuccess) {
        setCredits(prevCredits => (prevCredits !== null ? prevCredits - actualCost : null));
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to process image");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    workflow,
    setWorkflow,
    prompt,
    setPrompt,
    ratio,
    setRatio,
    style,
    setStyle,
    loraScale,
    setLoraScale,
    seed,
    setSeed,
    numberOfImages,
    setNumberOfImages,
    isImprovingPrompt,
    handleImprovePrompt,
    handleGenerate,
    isGenerating,
    CREDITS_PER_GENERATION: getCreditsPerGeneration()
  };
};
