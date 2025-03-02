import { useState } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useSession } from "@/hooks/useSession";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ControlPanel } from "@/components/prompt-maker/ControlPanel";
import { CreditDisplay } from "@/components/prompt-maker/CreditDisplay";
import { PreviousGenerations } from "@/components/prompt-maker/PreviousGenerations";
import { GenerationJobComponent } from "@/components/prompt-maker/GenerationJob";
import { PromptDialog } from "@/components/prompt-maker/PromptDialog";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCredits } from "@/hooks/useCredits";
import { useGenerationJobs } from "@/hooks/useGenerationJobs";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useToast } from "@/hooks/use-toast";

const PromptMaker = () => {
  const { session } = useSession();
  const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    imagePreview, 
    isUploading, 
    uploadedImageUrl, 
    handleImageUpload, 
    removeImage
  } = useImageUpload();
  
  const {
    credits,
    setCredits,
    isLoadingCredits,
    updateUserCredits
  } = useCredits(session);
  
  const {
    generatedImages,
    isProcessing,
    previousGenerations,
    generationJobs,
    formatTime,
    pollJobStatus,
    startNewJob,
    updateJobStatus
  } = useGenerationJobs(session);
  
  const {
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
    CREDITS_PER_GENERATION
  } = useImageGeneration(
    session,
    credits,
    isLoadingCredits,
    updateUserCredits,
    setCredits,
    startNewJob,
    updateJobStatus,
    pollJobStatus,
    uploadedImageUrl
  );

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
              <CreditDisplay 
                credits={credits} 
                isLoadingCredits={isLoadingCredits} 
                CREDITS_PER_GENERATION={CREDITS_PER_GENERATION} 
              />
            )}
          </div>

          <div className="space-y-6">
            {/* Control Panel */}
            <ControlPanel
              prompt={prompt}
              setPrompt={setPrompt}
              imagePreview={imagePreview}
              isUploading={isUploading}
              isProcessing={isProcessing}
              isImprovingPrompt={isImprovingPrompt}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleImprovePrompt={handleImprovePrompt}
              handleGenerate={handleGenerate}
              workflow={workflow}
              setWorkflow={setWorkflow}
              ratio={ratio}
              setRatio={setRatio}
              style={style}
              setStyle={setStyle}
              loraScale={loraScale}
              setLoraScale={setLoraScale}
              seed={seed}
              setSeed={setSeed}
              numberOfImages={numberOfImages}
              setNumberOfImages={setNumberOfImages}
              credits={credits}
              isLoadingCredits={isLoadingCredits}
              uploadedImageUrl={uploadedImageUrl}
            />

            {/* Generation Jobs */}
            <div className="space-y-4">
              {generationJobs.map((job) => (
                <GenerationJobComponent 
                  key={job.id} 
                  job={job} 
                  formatTime={formatTime} 
                  handleDownload={handleDownload} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Generations (History) as side drawer */}
      <PreviousGenerations 
        previousGenerations={previousGenerations} 
        handleImageClick={handleImageClick}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
      />

      {/* Prompt Dialog */}
      <PromptDialog 
        showPromptDialog={showPromptDialog}
        setShowPromptDialog={setShowPromptDialog}
        selectedGeneration={selectedGeneration}
        handleDownload={handleDownload}
      />
    </BaseLayout>
  );
};

export default PromptMaker;
