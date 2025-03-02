
import { useState, useRef } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import { useSession } from "@/hooks/useSession";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useCredits } from "@/hooks/useCredits";
import { useGenerationJobs } from "@/hooks/useGenerationJobs";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useImageDownloader } from "@/utils/imageUtils";
import { useScrollToLatestJob } from "@/hooks/useScrollToLatestJob";
import { ControlPanel } from "@/components/prompt-maker/ControlPanel";
import { PreviousGenerations } from "@/components/prompt-maker/PreviousGenerations";
import { PromptDialog } from "@/components/prompt-maker/PromptDialog";
import { MainContainer } from "@/components/prompt-maker/MainContainer";
import { PageHeader } from "@/components/prompt-maker/PageHeader";
import { JobsContainer } from "@/components/prompt-maker/JobsContainer";

const PromptMaker = () => {
  const { session } = useSession();
  const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const jobRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  
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
    updateJobStatus,
    latestJobRef
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

  // Use the custom hook for scrolling to the latest job
  useScrollToLatestJob(latestJobRef, jobRefs, generationJobs);

  const { handleDownload } = useImageDownloader();

  const handleImageClick = (generation: any) => {
    setSelectedGeneration(generation);
    setShowPromptDialog(true);
  };

  return (
    <BaseLayout>
      <MainContainer containerRef={containerRef}>
        <PageHeader 
          title="Kimera Image Generation"
          credits={credits}
          isLoadingCredits={isLoadingCredits}
          CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
          showCredits={!!session?.user}
        />

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
          <JobsContainer 
            generationJobs={generationJobs}
            formatTime={formatTime}
            handleDownload={handleDownload}
            jobRefs={jobRefs}
          />
        </div>
      </MainContainer>

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
