import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CREDITS_PER_GENERATION = 14;

export const useImageGeneration = (
  session: any,
  credits: number | null,
  isLoadingCredits: boolean,
  updateUserCredits: (creditsToDeduct: number) => Promise<boolean>,
  setCredits: (creditsFn: ((prev: number | null) => number | null)) => void,
  startNewJob: (numImagesToGenerate: number) => string,
  updateJobStatus: (jobId: string, status: string) => void,
  pollJobStatus: (apiJobId: string, imageIndex: number, jobId: string, jobPrompt: string, jobStyle: string, jobRatio: string, jobLoraScale: string) => void,
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

  const { toast } = useToast();

  const handleImprovePrompt = async () => {
    if (!prompt) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to improve",
        variant: "destructive",
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
        toast({
          title: "Prompt Improved",
          description: "Your prompt has been enhanced with more details.",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to improve the prompt. Please try again.",
        duration: 5000
      });
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const handleGenerate = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate images.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    
    const numImages = parseInt(numberOfImages);
    const totalCost = CREDITS_PER_GENERATION * numImages;
    
    if (credits === null || isLoadingCredits) {
      toast({
        title: "Loading Credits",
        description: "Please wait while we check your available credits.",
        duration: 3000
      });
      return;
    }
    
    if (credits < totalCost) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${totalCost} credits to generate ${numImages} ${numImages === 1 ? 'image' : 'images'}, but you only have ${credits}. Please contact support@kimera.ai to purchase more credits.`,
        variant: "destructive",
        duration: 8000
      });
      return;
    }

    if ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) {
      toast({
        title: "Image Required",
        description: `Please upload an image when using the ${workflow === 'with-reference' ? 'Basic with image reference' : 'Cartoon'} workflow.`,
        variant: "destructive",
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
          case "no-reference":
          default:
            return "803a4MBY";
        }
      };
      
      const pipelineId = getPipelineId();
      
      updateJobStatus(jobId, `Sending ${numImagesToGenerate} requests to Kimera API...`);
      
      const generateRequests = [];
      const currentPrompt = prompt;
      const currentWorkflow = workflow;
      const currentRatio = ratio;
      const currentStyle = style;
      const currentLoraScale = loraScale;
      const currentSeed = seed;
      const currentUploadedImageUrl = uploadedImageUrl;
      
      for (let i = 0; i < numImagesToGenerate; i++) {
        const seedValue = currentSeed === "random" ? -1 : parseInt(currentSeed);
        
        const requestBody = {
          pipeline_id: pipelineId,
          imageUrl: currentUploadedImageUrl || defaultImageUrl,
          ratio: currentRatio,
          prompt: `${currentStyle} style: ${currentPrompt}` || `${currentStyle} this image`,
          data: {
            lora_scale: parseFloat(currentLoraScale),
            style: currentStyle,
            seed: seedValue
          }
        };
        
        console.log(`Request for image ${i+1} with seed:`, seedValue);
        
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
      
      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) {
          const errorData = await responses[i].json();
          console.error(`Pipeline error response for request ${i+1}:`, errorData);
          
          updateJobStatus(jobId, `Error: Failed to process image ${i+1}`);
          
          throw new Error(`Failed to process image ${i+1}`);
        }
      }
      
      const responseDataArray = await Promise.all(responses.map(r => r.json()));
      const apiJobIds = responseDataArray.map(data => data.id);
      
      console.log(`Jobs started with IDs for job ${jobId}:`, apiJobIds);
      
      updateJobStatus(jobId, `Processing ${numImagesToGenerate} images...`);
      
      apiJobIds.forEach((apiJobId, index) => {
        pollJobStatus(apiJobId, index, jobId, currentPrompt, currentStyle, currentRatio, currentLoraScale);
      });
      
      const creditUpdateSuccess = await updateUserCredits(CREDITS_PER_GENERATION * numImagesToGenerate);
      if (!creditUpdateSuccess) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update credits, but your generation request was submitted."
        });
      } else {
        setCredits(prevCredits => (prevCredits !== null ? prevCredits - (CREDITS_PER_GENERATION * numImagesToGenerate) : null));
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image",
        duration: 5000
      });
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
