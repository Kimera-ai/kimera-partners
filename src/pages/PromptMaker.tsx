
import { useState, useRef, useCallback, useEffect } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Image, Settings, Sparkles, Wand2, X, Clock, Lightbulb, History, Loader2, Download, Coins } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ImagePreview = ({
  imagePreview,
  isUploading,
  isProcessing,
  onRemove,
  disabled
}: {
  imagePreview: string | null;
  isUploading: boolean;
  isProcessing: boolean;
  onRemove: (e: React.MouseEvent) => void;
  disabled?: boolean;
}) => {
  if (!imagePreview) {
    return <label htmlFor="reference-image" className={`cursor-pointer block ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="h-8 w-8 rounded-md bg-white/5 backdrop-blur border border-white/10 p-1.5 hover:bg-white/10 flex items-center justify-center">
          <Image className="h-full w-full text-white/70" />
        </div>
      </label>;
  }
  return <button type="button" className={`h-8 w-8 rounded-md bg-white/5 backdrop-blur border border-white/10 p-0.5 hover:bg-white/10 group relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={onRemove} disabled={isUploading || isProcessing || disabled}>
      <img src={imagePreview} alt="Reference" className="w-full h-full object-cover rounded transition-opacity group-hover:opacity-50" />
      <X className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>;
};

const CREDITS_PER_GENERATION = 14;

// Define a new interface for tracking generation jobs
interface GenerationJob {
  id: string;
  status: string;
  completedImages: number;
  totalImages: number;
  generatedImages: (string | null)[];
  isCompleted: boolean;
  startTime: number;
  elapsedTime: number;
}

const PromptMaker = () => {
  const [prompt, setPrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [ratio, setRatio] = useState("2:3");
  const [style, setStyle] = useState("Photographic");
  const [loraScale, setLoraScale] = useState("0.5");
  const [seed, setSeed] = useState("random");
  const [previousGenerations, setPreviousGenerations] = useState<any[]>([]);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [workflow, setWorkflow] = useState("no-reference");
  const [numberOfImages, setNumberOfImages] = useState("1");
  
  // New state for tracking multiple generation jobs
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);
  const [jobIdCounter, setJobIdCounter] = useState(0);

  const {
    session
  } = useSession();
  const {
    toast
  } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      fetchPreviousGenerations();
      fetchUserCredits();
    }
  }, [session?.user]);

  const fetchUserCredits = async () => {
    try {
      setIsLoadingCredits(true);
      const {
        data,
        error
      } = await supabase.from('user_credits').select('credits').eq('user_id', session?.user?.id).single();
      if (error) throw error;
      setCredits(data?.credits ?? null);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch credits",
        duration: 5000
      });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const updateUserCredits = async (creditsToDeduct: number) => {
    try {
      const {
        data,
        error
      } = await supabase.from('user_credits').update({
        credits: (credits ?? 0) - creditsToDeduct,
        updated_at: new Date().toISOString()
      }).eq('user_id', session?.user?.id).select('credits').single();
      if (error) throw error;
      setCredits(data?.credits ?? null);
      return true;
    } catch (error) {
      console.error('Error updating credits:', error);
      return false;
    }
  };

  const fetchPreviousGenerations = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('generated_images').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      const uniqueGenerations = data?.filter((gen, index, self) => index === self.findIndex(g => g.image_url === gen.image_url)) || [];
      setPreviousGenerations(uniqueGenerations);
    } catch (error) {
      console.error('Error fetching previous generations:', error);
    }
  };

  // Add timer effect to update elapsed time for all jobs
  useEffect(() => {
    // Timer for updating elapsed time for all active jobs
    const timer = setInterval(() => {
      setGenerationJobs(prevJobs => {
        return prevJobs.map(job => {
          if (!job.isCompleted) {
            return { ...job, elapsedTime: Date.now() - job.startTime };
          }
          return job;
        });
      });
    }, 10);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) {
        throw new Error('Failed to upload image to storage');
      }
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('images').getPublicUrl(filePath);
      setUploadedImageUrl(publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
        duration: 5000
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        duration: 5000
      });
      setImagePreview(null);
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Updated handleGenerate function to support simultaneous generation
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
    
    if (credits !== null && credits < totalCost) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${totalCost} credits to generate ${numImages} images. Please contact support@kimera.ai to purchase more credits.`,
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
      // Create a new job ID for this generation
      const jobId = `job-${jobIdCounter}`;
      setJobIdCounter(prev => prev + 1);
      
      // Create a new generation job
      const newJob: GenerationJob = {
        id: jobId,
        status: "Starting pipeline...",
        completedImages: 0,
        totalImages: numImages,
        generatedImages: new Array(numImages).fill(null),
        isCompleted: false,
        startTime: Date.now(),
        elapsedTime: 0
      };
      
      // Add the new job to the list
      setGenerationJobs(prev => [...prev, newJob]);
      
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
      
      const numImagesToGenerate = parseInt(numberOfImages);
      
      // Update job status
      setGenerationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: `Preparing to generate ${numImagesToGenerate} images...` } 
            : job
        )
      );
      
      const generateRequests = [];
      const currentPrompt = prompt;
      const currentWorkflow = workflow;
      const currentRatio = ratio;
      const currentStyle = style;
      const currentLoraScale = loraScale;
      const currentSeed = seed;
      const currentUploadedImageUrl = uploadedImageUrl;
      
      for (let i = 0; i < numImagesToGenerate; i++) {
        const requestBody = {
          pipeline_id: getPipelineId(),
          imageUrl: currentUploadedImageUrl || defaultImageUrl,
          ratio: currentRatio,
          prompt: `${currentStyle} style: ${currentPrompt}` || `${currentStyle} this image`,
          data: {
            lora_scale: parseFloat(currentLoraScale),
            style: currentStyle,
            seed: currentSeed === "random" ? -1 : 1234
          }
        };
        
        generateRequests.push(fetch('https://api.kimera.ai/v1/pipeline/run', {
          method: 'POST',
          headers: {
            'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee",
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }));
      }
      
      // Update job status
      setGenerationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: `Sending ${numImagesToGenerate} requests to Kimera API...` } 
            : job
        )
      );
      
      const responses = await Promise.all(generateRequests);
      
      for (let i = 0; i < responses.length; i++) {
        if (!responses[i].ok) {
          const errorData = await responses[i].json();
          console.error(`Pipeline error response for request ${i+1}:`, errorData);
          
          // Update job status to error
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId 
                ? { ...job, status: `Error: Failed to process image ${i+1}`, isCompleted: true } 
                : job
            )
          );
          
          throw new Error(`Failed to process image ${i+1}`);
        }
      }
      
      const responseDataArray = await Promise.all(responses.map(r => r.json()));
      const apiJobIds = responseDataArray.map(data => data.id);
      
      console.log(`Jobs started with IDs for job ${jobId}:`, apiJobIds);
      
      // Update job status
      setGenerationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: `Processing ${numImagesToGenerate} images...` } 
            : job
        )
      );
      
      apiJobIds.forEach((apiJobId, index) => {
        pollJobStatus(apiJobId, index, jobId, currentPrompt, currentStyle, currentRatio, currentLoraScale);
      });
      
      // Update credits after generation is started
      const creditUpdateSuccess = await updateUserCredits(CREDITS_PER_GENERATION * numImagesToGenerate);
      if (!creditUpdateSuccess) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update credits"
        });
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

  // Updated pollJobStatus function to handle concurrent jobs
  const pollJobStatus = async (apiJobId: string, imageIndex: number, jobId: string, jobPrompt: string, jobStyle: string, jobRatio: string, jobLoraScale: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // Update job status
        setGenerationJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { ...job, status: `Checking status for image ${imageIndex + 1}...` } 
              : job
          )
        );
        
        const statusResponse = await fetch(`https://api.kimera.ai/v1/pipeline/run/${apiJobId}`, {
          headers: {
            'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee"
          }
        });
        
        if (!statusResponse.ok) {
          clearInterval(pollInterval);
          
          // Update job status to error
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId 
                ? { ...job, status: `Error: Failed to check status for image ${imageIndex + 1}`, isCompleted: true } 
                : job
            )
          );
          
          throw new Error(`Failed to check status for image ${imageIndex + 1}`);
        }
        
        const status = await statusResponse.json();
        console.log(`Current status for job ${jobId}, image ${imageIndex + 1}:`, status);
        
        let statusMessage = "";
        
        if (status.status === 'pending') {
          statusMessage = `Image ${imageIndex + 1}: Waiting in queue...`;
        } else if (status.status === 'processing') {
          statusMessage = `Image ${imageIndex + 1}: Processing...`;
        } else if (status.status === 'AI Dream') {
          statusMessage = `Image ${imageIndex + 1}: Creating image...`;
          if (status.progress && status.progress.step && status.progress.total) {
            statusMessage = `Image ${imageIndex + 1}: Creating (${status.progress.step}/${status.progress.total})...`;
          }
        } else if (status.status === 'Face Swap') {
          statusMessage = `Image ${imageIndex + 1}: Applying reference...`;
          if (status.progress && status.progress.step && status.progress.total) {
            statusMessage = `Image ${imageIndex + 1}: Applying reference (${status.progress.step}/${status.progress.total})...`;
          }
        } else if (status.status === 'completed') {
          clearInterval(pollInterval);
          
          // Update job images and completion status
          setGenerationJobs(prev => {
            const updatedJobs = prev.map(job => {
              if (job.id === jobId) {
                const newGeneratedImages = [...job.generatedImages];
                newGeneratedImages[imageIndex] = status.result;
                
                const newCompletedImages = job.completedImages + 1;
                const isAllCompleted = newCompletedImages === job.totalImages;
                
                const jobStatus = isAllCompleted 
                  ? "All images generated successfully!" 
                  : `Completed ${newCompletedImages} of ${job.totalImages} images...`;
                
                return {
                  ...job,
                  generatedImages: newGeneratedImages,
                  completedImages: newCompletedImages,
                  isCompleted: isAllCompleted,
                  status: jobStatus
                };
              }
              return job;
            });
            
            // Check if all images for this job are completed
            const currentJob = updatedJobs.find(j => j.id === jobId);
            if (currentJob && currentJob.completedImages === currentJob.totalImages) {
              // Update the final set of generated images
              const completedImages = currentJob.generatedImages.filter(img => img !== null) as string[];
              
              // Add all completed images to generatedImages state for display in history
              setGeneratedImages(prev => [...prev, ...completedImages]);
              
              toast({
                title: "Success",
                description: `Job completed! All ${currentJob.totalImages} images have been generated successfully!`,
                duration: 3000
              });
            }
            
            return updatedJobs;
          });
          
          // Store the generated image in the database
          const { error: dbError } = await supabase.from('generated_images').insert({
            user_id: session?.user?.id,
            image_url: status.result,
            prompt: jobPrompt,
            style: jobStyle,
            ratio: jobRatio,
            lora_scale: jobLoraScale
          });
          
          if (dbError) {
            console.error('Error storing generation:', dbError);
          } else {
            await fetchPreviousGenerations();
          }
        } else if (status.status === 'failed' || status.status === 'Error') {
          clearInterval(pollInterval);
          
          // Update job status to error
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId 
                ? { 
                    ...job, 
                    status: `Error: Image ${imageIndex + 1} processing failed`, 
                    isCompleted: true 
                  } 
                : job
            )
          );
          
          throw new Error(`Image ${imageIndex + 1} processing failed`);
        } else {
          statusMessage = `Image ${imageIndex + 1}: ${status.status || "Processing"}: ${status.progress?.step || ""}/${status.progress?.total || ""}`;
        }
        
        // Update job status
        if (statusMessage) {
          setGenerationJobs(prev => 
            prev.map(job => 
              job.id === jobId ? { ...job, status: statusMessage } : job
            )
          );
        }
        
      } catch (error) {
        clearInterval(pollInterval);
        console.error(`Error polling status for job ${jobId}, image ${imageIndex + 1}:`, error);
      }
    }, 2000);
  };

  const removeImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview(null);
    setUploadedImageUrl(null);
    setGeneratedImages([]);
  }, []);

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
      const {
        data,
        error
      } = await supabase.functions.invoke('improve-prompt', {
        body: {
          prompt
        }
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

  const handleImageClick = (generation: any) => {
    setSelectedGeneration(generation);
    setShowPromptDialog(true);
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const s3Url = imageUrl.split('format=jpeg/')[1];
      if (!s3Url) throw new Error('Invalid image URL');
      
      const response = await fetch(s3Url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'image/jpeg,image/png,image/*'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully",
        duration: 5000
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download image. Please try again or right-click and 'Save Image As'",
        duration: 5000
      });
    }
  };

  return (
    <BaseLayout>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <DotPattern width={24} height={24} className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]" cx={1} cy={1} cr={1} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kimera Image Generation
            </h1>
            {session?.user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 backdrop-blur px-4 py-2 rounded-full bg-background/50 border border-white/5">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {isLoadingCredits ? <Loader2 className="w-4 h-4 animate-spin" /> : `${credits ?? 0} credits`}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground backdrop-blur px-4 py-2 rounded-full bg-background/50 border border-white/5">
                  Cost per generation: {CREDITS_PER_GENERATION} credits
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Control Panel Card */}
              <Card className="p-6 bg-card/60 backdrop-blur border border-white/5 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt" className="text-sm font-medium block text-white/80">Prompt</Label>
                    <div className="relative">
                      <Input id="reference-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading || workflow === 'no-reference'} />
                      <div className="relative">
                        <div ref={previewRef} className="absolute left-3 top-3 z-[9999] pointer-events-auto" style={{
                        position: 'absolute',
                        isolation: 'isolate'
                      }}>
                          <ImagePreview imagePreview={imagePreview} isUploading={isUploading} isProcessing={isProcessing} onRemove={removeImage} disabled={workflow === 'no-reference'} />
                        </div>
                        <div className="relative">
                          <Textarea id="prompt" placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..." value={prompt} onChange={e => setPrompt(e.target.value)} className="h-32 resize-none bg-background/50 border-white/10 text-white pl-14" />
                          <Button variant="ghost" size="icon" className="absolute bottom-3 left-3 text-primary/70 hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] backdrop-blur-sm" onClick={handleImprovePrompt} disabled={isImprovingPrompt}>
                            {isImprovingPrompt ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white" 
                    disabled={isUploading || ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl)}
                    onClick={handleGenerate}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : ((workflow === 'with-reference' || workflow === 'cartoon') && !uploadedImageUrl) ? "Upload an image" : "Generate"}
                  </Button>

                  <div className="grid grid-cols-1 gap-4 pt-3 border-t border-white/5">
                    <div className="space-y-2">
                      <Label htmlFor="workflow" className="text-sm font-medium block text-white/80">Workflow</Label>
                      <Select value={workflow} onValueChange={setWorkflow}>
                        <SelectTrigger id="workflow" className="w-full bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select workflow" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 text-white">
                          <SelectItem value="no-reference">Basic image generation</SelectItem>
                          <SelectItem value="with-reference">Basic with image reference</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="numberOfImages" className="text-sm font-medium block truncate text-white/80">Number of Images</Label>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/90 border-white/10">
                            <p>Number of images to generate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={numberOfImages} onValueChange={setNumberOfImages}>
                        <SelectTrigger id="numberOfImages" className="w-full bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 text-white">
                          <SelectItem value="1">1 image</SelectItem>
                          <SelectItem value="2">2 images</SelectItem>
                          <SelectItem value="3">3 images</SelectItem>
                          <SelectItem value="4">4 images</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="ratio" className="text-sm font-medium block truncate text-white/80">Aspect Ratio</Label>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/90 border-white/10">
                            <p>Aspect Ratio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={ratio} onValueChange={setRatio}>
                        <SelectTrigger id="ratio" className="w-full bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 text-white">
                          <SelectItem value="1:1">1:1 (Square)</SelectItem>
                          <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                          <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="style" className="text-sm font-medium block truncate text-white/80">Style</Label>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/90 border-white/10">
                            <p>Style</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style" className="w-full bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 text-white">
                          <SelectItem value="Cinematic">Cinematic</SelectItem>
                          <SelectItem value="Animated">Animated</SelectItem>
                          <SelectItem value="Digital Art">Digital Art</SelectItem>
                          <SelectItem value="Photographic">Photographic</SelectItem>
                          <SelectItem value="Fantasy art">Fantasy art</SelectItem>
                          <SelectItem value="Neonpunk">Neonpunk</SelectItem>
                          <SelectItem value="Enhance">Enhance</SelectItem>
                          <SelectItem value="Comic book">Comic book</SelectItem>
                          <SelectItem value="Lowpoly">Lowpoly</SelectItem>
                          <SelectItem value="Line art">Line art</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="loraScale" className="text-sm font-medium block truncate text-white/80">Lora Scale</Label>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/90 border-white/10">
                            <p>Controls the strength of the style</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={loraScale} onValueChange={setLoraScale}>
                        <SelectTrigger id="loraScale" className="w-full bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select lora scale" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 text-white">
                          <SelectItem value="0.2">0.2 (Subtle)</SelectItem>
                          <SelectItem value="0.5">0.5 (Medium)</SelectItem>
                          <SelectItem value="0.8">0.8 (Strong)</SelectItem>
                          <SelectItem value="1.0">1.0 (Very Strong)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="seed" className="text-sm font-medium block truncate text-white/80">Seed</Label>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/90 border-white/10">
                            <p>Random seed gives different results each time</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={seed} onValueChange={setSeed}>
                        <SelectTrigger id="seed" className="w-full bg-background/50 border-white/10 text-white">
                          <SelectValue placeholder="Select seed" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 text-white">
                          <SelectItem value="random">Random</SelectItem>
                          <SelectItem value="fixed">Fixed (1234)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Active Generation Jobs List */}
                  {generationJobs.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium text-white/90">Active Generation Jobs</h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {generationJobs.map((job) => (
                          <div key={job.id} className={`p-3 rounded-md border ${job.isCompleted ? 'border-green-500/30 bg-green-950/20' : 'border-orange-500/30 bg-orange-950/20'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {job.isCompleted ? 
                                  <Sparkles className="w-4 h-4 text-green-400" /> :
                                  <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                                }
                                <span className="font-medium text-sm">
                                  Job {job.id.replace('job-', '')}
                                </span>
                              </div>
                              <span className="text-xs font-mono bg-black/30 rounded px-2 py-0.5 text-white/70">
                                {formatTime(job.elapsedTime)}
                              </span>
                            </div>
                            <div className="text-sm text-white/70 mb-2">{job.status}</div>
                            
                            {/* Progress bar */}
                            <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${job.isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} 
                                style={{width: `${(job.completedImages / job.totalImages) * 100}%`}}
                              ></div>
                            </div>
                            
                            {/* Generated images */}
                            {job.completedImages > 0 && (
                              <div className="mt-3 grid grid-cols-4 gap-2">
                                {job.generatedImages.map((img, i) => img && (
                                  <div key={`${job.id}-img-${i}`} className="relative group aspect-[2/3] rounded-md overflow-hidden">
                                    <img src={img} alt={`Generated ${i+1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-white h-8 w-8"
                                        onClick={() => handleDownload(img)}
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previous Generations */}
                  {previousGenerations.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium text-white/90 flex items-center gap-2">
                        <History className="w-4 h-4 text-white/70" />
                        Generation History
                      </h3>
                      <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-2">
                        {previousGenerations.map((gen, index) => (
                          <div 
                            key={`prev-gen-${index}`} 
                            className="relative group aspect-[2/3] rounded-md overflow-hidden cursor-pointer"
                            onClick={() => handleImageClick(gen)}
                          >
                            <img src={gen.image_url} alt={`Previous ${index}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(gen.image_url);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPrompt(gen.prompt || "");
                                }}
                              >
                                <Lightbulb className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Preview Area */}
            <div className="lg:sticky lg:top-24 space-y-6 h-fit">
              <Card className="p-6 bg-card/60 backdrop-blur border border-white/5 shadow-lg">
                <h3 className="text-lg font-medium text-white/90 mb-4 flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-white/70" />
                  Preview
                </h3>
                
                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.slice(0, 4).map((img, i) => (
                      <div key={`main-preview-${i}`} className="relative group rounded-md overflow-hidden aspect-[2/3]">
                        <img 
                          src={img} 
                          alt={`Generated ${i+1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white"
                            onClick={() => handleDownload(img)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-[2/3] border border-dashed border-white/10 rounded-md flex flex-col items-center justify-center text-white/50 p-4">
                    <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-center">Fill in the prompt and hit generate to create an image</p>
                    {workflow === 'with-reference' && !uploadedImageUrl && (
                      <p className="text-center mt-2 text-sm text-orange-300">Don't forget to upload a reference image!</p>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prompt Dialog */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-lg border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Generation Details</DialogTitle>
          </DialogHeader>
          {selectedGeneration && (
            <div className="grid grid-cols-[2fr_3fr] gap-4">
              <div className="aspect-[2/3] rounded-md overflow-hidden">
                <img src={selectedGeneration.image_url} alt="Selected generation" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-3">
                <div>
                  <h4 className="text-xs text-white/60 uppercase">Prompt</h4>
                  <p className="text-sm">{selectedGeneration.prompt || "No prompt recorded"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-xs text-white/60 uppercase">Style</h4>
                    <p className="text-sm">{selectedGeneration.style || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/60 uppercase">Ratio</h4>
                    <p className="text-sm">{selectedGeneration.ratio || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/60 uppercase">Lora Scale</h4>
                    <p className="text-sm">{selectedGeneration.lora_scale || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-white/60 uppercase">Date</h4>
                    <p className="text-sm">{selectedGeneration.created_at ? new Date(selectedGeneration.created_at).toLocaleString() : "Unknown"}</p>
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setPrompt(selectedGeneration.prompt || "");
                      setStyle(selectedGeneration.style || "Photographic");
                      setRatio(selectedGeneration.ratio || "2:3");
                      setLoraScale(selectedGeneration.lora_scale || "0.5");
                      setShowPromptDialog(false);
                    }}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Use these settings
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDownload(selectedGeneration.image_url)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </BaseLayout>
  );
};

export default PromptMaker;
