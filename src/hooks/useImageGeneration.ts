
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GenerationJobType } from '@/components/prompt-maker/GenerationJob';

const CREDITS_PER_GENERATION = 14;

export const useImageGeneration = (
  session: any,
  credits: number | null,
  isLoadingCredits: boolean,
  updateUserCredits: (creditsToDeduct: number) => Promise<boolean>,
  setCredits: (creditsFn: ((prev: number | null) => number | null)) => void,
  startNewJob: (numImagesToGenerate: number) => string,
  updateJobStatus: (jobId: string, status: string) => void,
  pollJobStatus: (config: {
    apiJobId: string;
    imageIndex: number;
    jobId: string;
    jobPrompt: string;
    jobStyle: string;
    jobRatio: string;
    jobLoraScale: string;
    pipeline_id?: string;
    seed?: number | string;
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

  const handleImprovePrompt = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt to improve", {
        duration: 5000
      });
      return;
    }
    try {
      setIsImprovingPrompt(true);
      
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: { prompt }
      });
      
      if (error) throw error;
      
      if (data?.improvedPrompt) {
        setPrompt(data.improvedPrompt);
        toast.success("Your prompt has been enhanced with more details.", {
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error("Failed to improve the prompt. Please try again.", {
        duration: 5000
      });
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!session?.user) {
      toast.error("Please sign in to generate images.", {
        duration: 5000
      });
      return;
    }
    
    const numImages = parseInt(numberOfImages);
    const totalCost = CREDITS_PER_GENERATION * numImages;
    
    if (credits === null || isLoadingCredits) {
      toast.info("Please wait while we check your available credits.", {
        duration: 3000
      });
      return;
    }
    
    if (credits < totalCost) {
      toast.error(`You need ${totalCost} credits to generate ${numImages} ${numImages === 1 ? 'image' : 'images'}, but you only have ${credits}. Please contact support@kimera.ai to purchase more credits.`, {
        duration: 8000
      });
      return;
    }

    if ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) {
      toast.error(`Please upload an image when using the ${workflow === 'with-reference' ? 'Face Gen' : 'Reference Mode'} workflow.`, {
        duration: 5000
      });
      return;
    }

    try {
      const jobId = startNewJob(numImages);
      
      const numImagesToGenerate = parseInt(numberOfImages);
      
      updateJobStatus(jobId, `Preparing to generate ${numImagesToGenerate} images...`);
      
      const defaultImageUrl = "https://www.jeann.online/cdn-cgi/image/format=jpeg/https://kimera-media.s3.eu-north-1.amazonaws.com/623b36fe-ac7f-4c56-a124-cddb942a38e5_event/623b36fe-ac7f-4c56-a124-cddb942a38e5_source.jpeg";
      
      const getPipelineId = () => {
        switch (workflow) {
          case "with-reference":
            return "FYpcEIUj";
          case "cartoon":
            return "803a4MBY";
          case "no-reference":
          default:
            return "803a4MBY";
        }
      };
      
      const pipelineId = getPipelineId();
      
      updateJobStatus(jobId, `Sending ${numImagesToGenerate} requests to Kimera API...`);
      
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
      
      for (let i = 0; i < numImagesToGenerate; i++) {
        const seedValue = currentSeed === "random" ? -1 : parseInt(currentSeed);
        
        const requestBody = {
          pipeline_id: pipelineId,
          imageUrl: currentUploadedImageUrl || defaultImageUrl,
          ratio: currentRatio,
          prompt: fullPrompt,
          data: {
            lora_scale: parseFloat(currentLoraScale),
            style: currentStyle,
            seed: seedValue
          }
        };
        
        console.log(`Request for image ${i+1} with seed:`, seedValue);
        console.log("API Request body:", JSON.stringify(requestBody, null, 2));
        
        generateRequests.push(fetch('https://api.kimera.ai/v1/pipeline/run', {
          method: 'POST',
          headers: {
            'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }));
      }
      
      const responses = await Promise.all(generateRequests);
      
      const responseErrors = [];
      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) {
          try {
            const errorData = await responses[i].json();
            console.error(`Pipeline error response for request ${i+1}:`, errorData);
            responseErrors.push(`Image ${i+1}: ${errorData.message || 'Unknown error'}`);
          } catch (e) {
            console.error(`Failed to parse error response for request ${i+1}:`, e);
            responseErrors.push(`Image ${i+1}: HTTP error ${responses[i].status}`);
          }
        }
      }
      
      if (responseErrors.length === responses.length) {
        throw new Error(`All requests failed: ${responseErrors.join(', ')}`);
      }
      
      if (responseErrors.length > 0) {
        toast.warning(`${responseErrors.length} of ${responses.length} requests failed. Continuing with successful ones.`, {
          duration: 5000
        });
        
        updateJobStatus(jobId, `Processing ${responses.length - responseErrors.length} of ${numImagesToGenerate} images...`);
      }
      
      const successfulResponses = responses.filter(r => r.ok);
      
      const responseDataArray = await Promise.all(successfulResponses.map(r => r.json()));
      const apiJobIds = responseDataArray.map(data => data.id);
      
      console.log(`Jobs started with IDs for job ${jobId}:`, apiJobIds);
      
      if (apiJobIds.length === 0) {
        throw new Error("Failed to start any generation jobs");
      }
      
      updateJobStatus(jobId, `Processing ${apiJobIds.length} images...`);
      
      apiJobIds.forEach((apiJobId, index) => {
        pollJobStatus({
          apiJobId,
          imageIndex: index,
          jobId,
          jobPrompt: currentPrompt,
          jobStyle: currentStyle,
          jobRatio: currentRatio,
          jobLoraScale: currentLoraScale,
          pipeline_id: pipelineId,
          seed: currentSeed === "random" ? -1 : parseInt(currentSeed)
        });
      });
      
      const actualCost = CREDITS_PER_GENERATION * apiJobIds.length;
      const creditUpdateSuccess = await updateUserCredits(actualCost);
      
      if (!creditUpdateSuccess) {
        toast.error("Failed to update credits, but your generation request was submitted.");
      } else {
        setCredits(prevCredits => (prevCredits !== null ? prevCredits - actualCost : null));
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to process image";
      toast.error(errorMessage, { duration: 6000 });
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
    setIsImprovingPrompt,
    handleImprovePrompt,
    handleGenerate,
    CREDITS_PER_GENERATION
  };
};
