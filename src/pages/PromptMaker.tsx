
import { useState } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabButton } from "@/components/marketing/TabButton";
import { Image, Settings, Sparkles, Wand2 } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

const PromptMaker = () => {
  const [activeTab, setActiveTab] = useState<"create" | "history" | "settings">("create");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Prompt Input */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 bg-background/50 backdrop-blur">
                <div className="flex gap-4 mb-6 border-b border-primary/20">
                  <TabButton 
                    icon={Sparkles}
                    active={activeTab === "create"}
                    onClick={() => setActiveTab("create")}
                  >
                    Create
                  </TabButton>
                  <TabButton 
                    icon={Image}
                    active={activeTab === "history"}
                    onClick={() => setActiveTab("history")}
                  >
                    History
                  </TabButton>
                  <TabButton 
                    icon={Settings}
                    active={activeTab === "settings"}
                    onClick={() => setActiveTab("settings")}
                  >
                    Settings
                  </TabButton>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="A magical forest with glowing mushrooms, ethereal lighting, fantasy atmosphere..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="h-32 resize-none bg-background/50"
                    />
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
            </div>

            {/* Right Panel - Generated Images */}
            <div className="lg:col-span-2">
              <Card className="p-6 bg-background/50 backdrop-blur min-h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Your generated images will appear here</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PromptMaker;
