
import { useState } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Image, Settings, Sparkles, Upload, Wand2, X } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

const PromptMaker = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
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
                    />
                    {imagePreview ? (
                      <div className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md bg-muted p-0.5 hover:bg-muted/80"
                          onClick={removeImage}
                        >
                          <img 
                            src={imagePreview} 
                            alt="Reference" 
                            className="w-full h-full object-cover rounded"
                          />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="reference-image"
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md bg-muted p-1 hover:bg-muted/80"
                        >
                          <Image className="h-full w-full" />
                        </Button>
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

              <Button className="w-full">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </Card>

          {/* Generated Images Panel */}
          <Card className="p-6 bg-background/50 backdrop-blur min-h-[600px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your generated images will appear here</p>
            </div>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PromptMaker;
