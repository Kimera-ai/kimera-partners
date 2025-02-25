
import { useState } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Image, Settings, Sparkles, Wand2, X } from "lucide-react";
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

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error('Failed to upload image to storage');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      console.log("Uploaded image public URL:", publicUrl);

      // Upload the image URL to Kimera API
      const kimeraResponse = await fetch('https://api.kimera.ai/v1/upload', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: publicUrl })
      });

      if (!kimeraResponse.ok) {
        const errorData = await kimeraResponse.json();
        console.error("Kimera upload error:", errorData);
        throw new Error('Failed to process image with Kimera');
      }

      const kimeraUrl = await kimeraResponse.json();
      console.log("Kimera response:", kimeraUrl);

      // Save reference in the database
      const { data, error } = await supabase
        .from('uploaded_images')
        .insert([{ 
          image_url: kimeraUrl,
          original_url: publicUrl
        }])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw new Error('Failed to save image to database');
      }

      setUploadedImageUrl(kimeraUrl);
      console.log("Image saved to database:", data);

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
      
      const requestBody = {
        pipeline_id: PIPELINE_ID,
        imageUrl: uploadedImageUrl,
        ratio: "2:3",
        prompt: prompt || "Enhance this image"
      };

      console.log("Sending request with body:", requestBody);
      
      // Start the pipeline with the saved image URL
      const pipelineResponse = await fetch('https://api.kimera.ai/v1/pipeline/run', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
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
                  <Input
                    id="reference-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading || isProcessing}
                  />
                  {imagePreview ? (
                    <div className="absolute left-3 top-3 z-10">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md bg-white/10 backdrop-blur border border-white/20 p-0.5 hover:bg-white/20 group"
                        onClick={removeImage}
                        disabled={isUploading || isProcessing}
                      >
                        <img 
                          src={imagePreview} 
                          alt="Reference" 
                          className="w-full h-full object-cover rounded transition-opacity group-hover:opacity-50"
                        />
                        <X className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="reference-image"
                      className="absolute left-3 top-3 z-10 cursor-pointer block"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md bg-white/10 backdrop-blur border border-white/20 p-1.5 hover:bg-white/20"
                      >
                        <Image className="h-full w-full text-white/70" />
                      </Button>
                    </label>
                  )}
                  <Textarea
                    id="prompt"
                    placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="h-32 resize-none bg-background/50 pl-14"
                  />
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
