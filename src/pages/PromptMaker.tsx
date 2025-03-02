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
  // [Previous state declarations remain exactly the same]
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
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);
  const [jobIdCounter, setJobIdCounter] = useState(0);

  const { session } = useSession();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  // Function to fix image orientation before uploading
  const fixImageOrientation = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Get proper dimensions based on orientation
          const width = img.width;
          const height = img.height;
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw the image with proper orientation
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert canvas to blob'));
            }
          }, file.type);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      
      // Create a preview first
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Fix orientation
      const fixedImageBlob = await fixImageOrientation(file);
      
      // Create a new file with fixed orientation
      const fixedFile = new File([fixedImageBlob], file.name, { type: file.type });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from('images').upload(filePath, fixedFile);
      
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
        description: "Image uploaded successfully with correct orientation",
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

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = async () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to generate images.",
      });
      return;
    }

    if (credits === null || credits < CREDITS_PER_GENERATION) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Not enough credits to generate images.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const newJobId = `job-${jobIdCounter}`;
      setJobIdCounter(jobIdCounter + 1);

      const newJob: GenerationJob = {
        id: newJobId,
        status: "pending",
        completedImages: 0,
        totalImages: parseInt(numberOfImages),
        generatedImages: Array(parseInt(numberOfImages)).fill(null),
        isCompleted: false,
        startTime: Date.now(),
        elapsedTime: 0,
      };

      setGenerationJobs((prevJobs) => [...prevJobs, newJob]);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          image_url: uploadedImageUrl,
          ratio: ratio,
          style: style,
          lora_scale: loraScale,
          seed: seed === 'random' ? null : seed,
          workflow: workflow,
          number_of_images: numberOfImages,
          job_id: newJobId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setCredits(data.credits);

    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate image.",
      });
      setGenerationJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === newJobId ? { ...job, status: "failed" } : job
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  const handleRatioChange = (value: string) => {
    setRatio(value);
  };

  const handleStyleChange = (value: string) => {
    setStyle(value);
  };

  const handleLoraScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoraScale(e.target.value);
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value);
  };

  const handleWorkflowChange = (value: string) => {
    setWorkflow(value);
  };

  const handleNumberOfImagesChange = (value: string) => {
    setNumberOfImages(value);
  };

  const improvePrompt = async () => {
    setIsImprovingPrompt(true);
    try {
      const response = await fetch("/api/improve-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrompt(data.improvedPrompt);
    } catch (error: any) {
      console.error("Improve prompt error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to improve prompt.",
      });
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const fetchPreviousGenerations = async () => {
    try {
      const response = await fetch("/api/previous-generations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPreviousGenerations(data);
    } catch (error: any) {
      console.error("Fetch previous generations error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch previous generations.",
      });
    }
  };

  const fetchUserCredits = async () => {
    setIsLoadingCredits(true);
    try {
      const response = await fetch("/api/credits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCredits(data.credits);
    } catch (error: any) {
      console.error("Fetch credits error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch credits.",
      });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const handleSelectGeneration = (generation: any) => {
    setSelectedGeneration(generation);
    setPrompt(generation.prompt);
    setImagePreview(generation.image_url);
    setUploadedImageUrl(generation.image_url);
    setShowPromptDialog(true);
  };

  const downloadImage = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (session?.user) {
      fetchPreviousGenerations();
      fetchUserCredits();
    }
  }, [session?.user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGenerationJobs(prevJobs =>
        prevJobs.map(job => {
          if (job.status === "pending" && !job.isCompleted) {
            const elapsedTime = Date.now() - job.startTime;
            return { ...job, elapsedTime: elapsedTime };
          }
          return job;
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <BaseLayout>
      <div className="container relative">
        <DotPattern className="absolute inset-0 -z-10 h-full w-full fill-zinc-900/20 stroke-zinc-900/20 [mask-image:radial-gradient(50rem_50rem_at_top,white,transparent)]" />
        <div className="flex flex-col gap-4 md:flex-row">
          <Card className="w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <div className="relative">
                <Textarea
                  id="prompt"
                  placeholder="A photo of..."
                  value={prompt}
                  onChange={handlePromptChange}
                  rows={4}
                  className="pr-12"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-2.5 bottom-2.5 h-9 w-9 p-0"
                        onClick={improvePrompt}
                        disabled={isImprovingPrompt}
                      >
                        {isImprovingPrompt ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Lightbulb className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      Improve prompt with AI
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Label>Reference Image</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="reference-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <ImagePreview imagePreview={imagePreview} isUploading={isUploading} isProcessing={isProcessing} onRemove={handleRemoveImage} disabled={isProcessing} />
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ratio">Ratio</Label>
                  <Select value={ratio} onValueChange={handleRatioChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="2:3">2:3</SelectItem>
                      <SelectItem value="3:2">3:2</SelectItem>
                      <SelectItem value="9:16">9:16</SelectItem>
                      <SelectItem value="16:9">16:9</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select value={style} onValueChange={handleStyleChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Photographic">Photographic</SelectItem>
                      <SelectItem value="Anime">Anime</SelectItem>
                      <SelectItem value="Digital Art">Digital Art</SelectItem>
                      <SelectItem value="Pixel Art">Pixel Art</SelectItem>
                      <SelectItem value="Abstract">Abstract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lora-scale">LoRA Scale</Label>
                  <Input
                    type="number"
                    id="lora-scale"
                    placeholder="0.5"
                    value={loraScale}
                    onChange={handleLoraScaleChange}
                    min="0"
                    max="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="seed">Seed</Label>
                  <Input
                    type="text"
                    id="seed"
                    placeholder="random"
                    value={seed}
                    onChange={handleSeedChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="workflow">Workflow</Label>
                <Select value={workflow} onValueChange={handleWorkflowChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-reference">No Reference</SelectItem>
                    <SelectItem value="reference-only">Reference Only</SelectItem>
                    <SelectItem value="prompt-only">Prompt Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="number-of-images">Number of Images</Label>
                <Select value={numberOfImages} onValueChange={handleNumberOfImagesChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of images" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} disabled={isProcessing || isUploading}>
                {isProcessing ? (
                  <>
                    Generating...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Generate
                    <Wand2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              {credits !== null ? (
                <p className="text-sm text-muted-foreground">
                  Credits: {credits} <Coins className="inline-block h-3.5 w-3.5" />
                </p>
              ) : (
                isLoadingCredits ? (
                  <p className="text-sm text-muted-foreground">
                    Loading credits...
                  </p>
                ) : null
              )}
            </div>
          </Card>

          <Card className="w-full md:w-1/2">
            <div className="flex flex-col gap-4">
              <h2>Your Generations</h2>
              {generationJobs.map((job) => (
                <div key={job.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Job ID: {job.id}</h3>
                    {job.status === "failed" && (
                      <span className="text-red-500 font-medium">Failed</span>
                    )}
                  </div>
                  <p>Status: {job.status}</p>
                  {!job.isCompleted ? (
                    <>
                      <p>Elapsed Time: {(job.elapsedTime / 1000).toFixed(0)} seconds</p>
                      <p>
                        Progress: {job.completedImages} / {job.totalImages} images
                      </p>
                    </>
                  ) : (
                    <p>Completed!</p>
                  )}
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {job.generatedImages.map((image, index) => (
                      image ? (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Generated Image ${index + 1}`}
                            className="rounded-md"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => downloadImage(image)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Previous Generation</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="A photo of..."
                value={prompt}
                onChange={handlePromptChange}
                rows={4}
              />
              <Label>Reference Image</Label>
              {imagePreview ? (
                <img src={imagePreview} alt="Reference" className="w-full h-48 object-cover rounded" />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BaseLayout>
  );
};

export default PromptMaker;
