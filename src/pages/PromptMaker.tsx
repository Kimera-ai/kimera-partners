import { useState, useRef, useCallback, useEffect } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Image, Settings, Sparkles, Wand2, X, Clock, Lightbulb, History, Loader2, Download } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/useSession";

const API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";
const PIPELINE_ID = "803a4MBY";

const ImagePreview = ({ 
  imagePreview, 
  isUploading, 
  isProcessing, 
  onRemove 
}: { 
  imagePreview: string | null;
  isUploading: boolean;
  isProcessing: boolean;
  onRemove: (e: React.MouseEvent) => void;
}) => {
  if (!imagePreview) {
    return (
      <label
        htmlFor="reference-image"
        className="cursor-pointer block"
      >
        <div className="h-8 w-8 rounded-md bg-white/10 backdrop-blur border border-white/20 p-1.5 hover:bg-white/20 flex items-center justify-center">
          <Image className="h-full w-full text-white/70" />
        </div>
      </label>
    );
  }

  return (
    <button
      type="button"
      className="h-8 w-8 rounded-md bg-white/10 backdrop-blur border border-white/20 p-0.5 hover:bg-white/20 group relative"
      onClick={onRemove}
      disabled={isUploading || isProcessing}
    >
      <img 
        src={imagePreview} 
        alt="Reference" 
        className="w-full h-full object-cover rounded transition-opacity group-hover:opacity-50"
      />
      <X className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

const PromptMaker = () => {
  const [prompt, setPrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [ratio, setRatio] = useState("2:3");
  const [style, setStyle] = useState("Enhance");
  const [previousGenerations, setPreviousGenerations] = useState<any[]>([]);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const { session } = useSession();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (session?.user) {
      fetchPreviousGenerations();
    }
  }, [session?.user]);

  const fetchPreviousGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const uniqueGenerations = data?.filter((gen, index, self) =>
        index === self.findIndex(g => g.image_url === gen.image_url)
      ) || [];
      
      setPreviousGenerations(uniqueGenerations);
    } catch (error) {
      console.error('Error fetching previous generations:', error);
    }
  };

  useEffect(() => {
    if (isProcessing) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 10);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isProcessing]);

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

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Failed to upload image to storage');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setUploadedImageUrl(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
      });
      setImagePreview(null);
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate images.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setElapsedTime(0);

      const requestBody = {
        pipeline_id: "803a4MBY",
        imageUrl: uploadedImageUrl || "",
        ratio: ratio,
        prompt: `${style} style: ${prompt}` || `${style} this image`,
        data: {
          lora_scale: 0.5,
          style: style,
          seed: -1
        }
      };

      console.log("Sending request with body:", requestBody);
      
      const pipelineResponse = await fetch('https://api.kimera.ai/v1/pipeline/run', {
        method: 'POST',
        headers: {
          'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee",
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!pipelineResponse.ok) {
        const errorData = await pipelineResponse.json();
        console.error("Pipeline error response:", errorData);
        throw new Error('Failed to process image');
      }

      const { id: jobId } = await pipelineResponse.json();
      console.log("Job started with ID:", jobId);

      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`https://api.kimera.ai/v1/pipeline/run/${jobId}`, {
          headers: {
            'x-api-key': "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee"
          }
        });

        if (!statusResponse.ok) {
          clearInterval(pollInterval);
          throw new Error('Failed to check status');
        }

        const status = await statusResponse.json();
        console.log("Current status:", status);
        
        if (status.status === 'completed') {
          clearInterval(pollInterval);
          setGeneratedImage(status.result);
          setIsProcessing(false);

          const { error: dbError } = await supabase
            .from('generated_images')
            .insert({
              user_id: session.user.id,
              image_url: status.result,
              prompt: prompt,
              style: style,
              ratio: ratio
            });

          if (dbError) {
            console.error('Error storing generation:', dbError);
            throw new Error('Failed to store generation');
          }

          await fetchPreviousGenerations();

          toast({
            title: "Success",
            description: "Image has been generated successfully!",
          });
        } else if (status.status === 'failed' || status.status === 'Error') {
          clearInterval(pollInterval);
          setIsProcessing(false);
          throw new Error('Processing failed');
        }
      }, 2000);

    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process image",
      });
    }
  };

  const removeImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview(null);
    setUploadedImageUrl(null);
    setGeneratedImage(null);
  }, []);

  const handleImprovePrompt = async () => {
    if (!prompt) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to improve",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImprovingPrompt(true);
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: { prompt },
      });

      if (error) throw error;

      if (data?.improvedPrompt) {
        setPrompt(data.improvedPrompt);
        toast({
          title: "Prompt Improved",
          description: "Your prompt has been enhanced with more details.",
        });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to improve the prompt. Please try again.",
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
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download image",
      });
    }
  };

  return (
    <BaseLayout>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <DotPattern 
            width={24} 
            height={24} 
            className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
            cx={1}
            cy={1}
            cr={1}
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kimera Image Generation
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Wand2 className="w-4 h-4 mr-2" />
                Random Prompt
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-6 bg-background/50 backdrop-blur">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ratio">Aspect Ratio</Label>
                      <Select value={ratio} onValueChange={setRatio}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">1:1 (Square)</SelectItem>
                          <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                          <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
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
                  </div>

                  <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <div className="relative">
                      <Input
                        id="reference-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading || isProcessing}
                      />
                      <div className="relative">
                        <div 
                          ref={previewRef}
                          className="absolute left-3 top-3 z-[9999] pointer-events-auto"
                          style={{ 
                            position: 'absolute',
                            isolation: 'isolate'
                          }}
                        >
                          <ImagePreview 
                            imagePreview={imagePreview}
                            isUploading={isUploading}
                            isProcessing={isProcessing}
                            onRemove={removeImage}
                          />
                        </div>
                        <div className="relative">
                          <Textarea
                            id="prompt"
                            placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="h-32 resize-none bg-background/50 pl-14"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-3 left-3 text-primary/70 hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all hover:shadow-[0_0_15px_rgba(155,135,245,0.3)] backdrop-blur-sm"
                            onClick={handleImprovePrompt}
                            disabled={isImprovingPrompt}
                          >
                            {isImprovingPrompt ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={isProcessing}
                    onClick={handleGenerate}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processing..." : "Generate"}
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-background/50 backdrop-blur">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Generation History
                </h2>
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {previousGenerations.map((gen) => (
                      <div key={gen.id} className="space-y-3">
                        <div className="relative group">
                          <button 
                            className="w-full text-left"
                            onClick={() => handleImageClick(gen)}
                          >
                            <img 
                              src={gen.image_url} 
                              alt={gen.prompt} 
                              className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity"
                            />
                          </button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(gen.image_url);
                            }}
                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur hover:bg-background/80"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-3 text-xs text-white/70">
                          <span>Style: {gen.style}</span>
                          <span>Ratio: {gen.ratio}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-background/50 backdrop-blur min-h-[600px] flex items-center justify-center relative">
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-6 py-3 rounded-full text-lg font-mono">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span>{formatTime(elapsedTime)}</span>
                  </div>
                </div>
              )}
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="max-w-full max-h-[550px] object-contain rounded-lg shadow-lg relative"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your generated images will appear here</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Generation Details
              {selectedGeneration && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDownload(selectedGeneration.image_url)}
                  className="h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedGeneration && (
            <div className="space-y-4 h-full">
              <div className="relative h-[calc(90vh-12rem)] flex items-center justify-center rounded-lg bg-background/50">
                <img 
                  src={selectedGeneration.image_url} 
                  alt={selectedGeneration.prompt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="space-y-2">
                <Label>Prompt</Label>
                <p className="text-sm text-white/90 bg-background/50 p-4 rounded-lg max-h-[15vh] overflow-y-auto">
                  {selectedGeneration.prompt}
                </p>
                <div className="flex gap-4 text-sm text-white/70">
                  <div>
                    <Label>Style</Label>
                    <p>{selectedGeneration.style}</p>
                  </div>
                  <div>
                    <Label>Ratio</Label>
                    <p>{selectedGeneration.ratio}</p>
                  </div>
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
