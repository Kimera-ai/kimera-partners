import { useState } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Image, Settings, Sparkles, Upload, Wand2, X } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";
const PIPELINE_ID = "803a4MBY";

const PromptMaker = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // First, show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Create FormData and upload the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload the image to Kimera API
      const uploadResponse = await fetch('https://api.kimera.ai/v1/upload', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await uploadResponse.json();
      console.log("Image uploaded successfully:", imageUrl);

      // Save the image URL to the database
      const { data, error } = await supabase
        .from('uploaded_images')
        .insert([{ image_url: imageUrl }])
        .select()
        .single();

      if (error) {
        throw new Error('Failed to save image to database');
      }

      setUploadedImageUrl(imageUrl);
      console.log("Image saved to database:", data);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImageUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image first",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Start the pipeline with the saved image URL
      const pipelineResponse = await fetch('https://api.kimera.ai/v1/pipeline/run', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pipeline_id: PIPELINE_ID,
          imageUrl: uploadedImageUrl,
          ratio: "2:3",
          prompt: prompt || "Enhance this image"
        })
      });

      if (!pipelineResponse.ok) {
        throw new Error('Failed to process image');
      }

      const { id: jobId } = await pipelineResponse.json();
      console.log("Job started with ID:", jobId);

      // Start polling for results
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`https://api.kimera.ai/v1/pipeline/run/${jobId}`, {
          headers: {
            'x-api-key': API_KEY
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
          setGeneratedImage(status.source);
          setIsProcessing(false);
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

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview(null);
    setGeneratedImage(null);
    setUploadedImageUrl(null);
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
              AI Image Generation
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

          {/* Prompt Input Section */}
          <Card className="p-6 bg-background/50 backdrop-blur mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <div className="relative">
                  <Textarea
                    id="prompt"
                    placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-32 resize-none bg-background/50 pl-12"
                  />
                  <div className="absolute left-3 top-3">
                    <Input
                      id="reference-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading || isProcessing}
                    />
                    {imagePreview ? (
                      <div className="relative group">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md bg-white border border-black p-0.5 hover:bg-white/90"
                          onClick={removeImage}
                          disabled={isUploading || isProcessing}
                        >
                          <img 
                            src={imagePreview} 
                            alt="Reference" 
                            className="w-full h-full object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity">
                            <X className="h-3 w-3 text-white" />
                          </div>
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="reference-image"
                        className="cursor-pointer block"
                        onClick={() => {
                          const input = document.getElementById('reference-image') as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        <div
                          className="h-6 w-6 rounded-md bg-white border border-black p-1 hover:bg-white/90 cursor-pointer flex items-center justify-center"
                        >
                          <Image className="h-full w-full text-black" />
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="negative-prompt">Negative Prompt</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="blurry, low quality, distorted, bad anatomy..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="h-32 resize-none bg-background/50"
                />
              </div>

              <Button 
                className="w-full" 
                disabled={isUploading || isProcessing || !imagePreview}
                onClick={handleGenerate}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Generate"}
              </Button>
            </div>
          </Card>

          {/* Generated Images Panel */}
          <Card className="p-6 bg-background/50 backdrop-blur min-h-[600px] flex items-center justify-center">
            {generatedImage ? (
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full max-h-[550px] object-contain rounded-lg shadow-lg"
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
    </BaseLayout>
  );
};

export default PromptMaker;
