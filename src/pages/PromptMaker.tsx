
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
import { Sidebar } from "@/components/prompt-maker/Sidebar";
import { GeneratedImageData } from '@/components/prompt-maker/GenerationJob';

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

  useScrollToLatestJob(latestJobRef, jobRefs, generationJobs);
  const { handleDownload } = useImageDownloader();

  const handleImageClick = useCallback((generation: any) => {
    setSelectedGeneration(generation);
    setShowPromptDialog(true);
  }, []);

  const handleGeneratedImageClick = useCallback((imageData: GeneratedImageData) => {
    const generationData = {
      image_url: imageData.url,
      prompt: prompt,
      style: style,
      ratio: ratio,
      lora_scale: loraScale,
      seed: imageData.seed,
      pipeline_id: imageData.pipeline_id,
      created_at: new Date().toISOString()
    };
    
    handleImageClick(generationData);
  }, [prompt, style, ratio, loraScale, handleImageClick]);

  // Memoize sidebar props to prevent re-rendering issues
  const sidebarProps = useMemo(() => ({
    workflow,
    setWorkflow,
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
    imagePreview,
    isUploading,
    handleImageUpload,
    removeImage,
    CREDITS_PER_GENERATION
  }), [
    workflow, 
    ratio, 
    style, 
    loraScale, 
    seed, 
    numberOfImages, 
    imagePreview, 
    isUploading,
    CREDITS_PER_GENERATION,
    setWorkflow,
    setRatio,
    setStyle,
    setLoraScale,
    setSeed,
    setNumberOfImages,
    handleImageUpload,
    removeImage
  ]);

  return (
    <BaseLayout fullWidth>
      <MainContainer 
        containerRef={containerRef} 
        sidebar={
          <Sidebar
            workflow={sidebarProps.workflow}
            setWorkflow={sidebarProps.setWorkflow}
            ratio={sidebarProps.ratio}
            setRatio={sidebarProps.setRatio}
            style={sidebarProps.style}
            setStyle={sidebarProps.setStyle}
            loraScale={sidebarProps.loraScale}
            setLoraScale={sidebarProps.setLoraScale}
            seed={sidebarProps.seed}
            setSeed={sidebarProps.setSeed}
            numberOfImages={sidebarProps.numberOfImages}
            setNumberOfImages={sidebarProps.setNumberOfImages}
            imagePreview={sidebarProps.imagePreview}
            isUploading={sidebarProps.isUploading}
            handleImageUpload={sidebarProps.handleImageUpload}
            removeImage={sidebarProps.removeImage}
            CREDITS_PER_GENERATION={sidebarProps.CREDITS_PER_GENERATION}
          />
        }
      >
        <div className="w-full h-full p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <PageHeader 
              title="Kimera Image Generation"
              credits={credits}
              isLoadingCredits={isLoadingCredits}
              CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
              showCredits={!!session?.user}
            />
          </div>

          <div className="w-full space-y-4 md:space-y-6">
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
              CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
            />

            <JobsContainer 
              generationJobs={generationJobs}
              formatTime={formatTime}
              handleDownload={handleDownload}
              onImageClick={handleGeneratedImageClick}
              jobRefs={jobRefs}
            />
          </div>
        </div>
      </MainContainer>

      <PreviousGenerations 
        previousGenerations={previousGenerations} 
        handleImageClick={handleImageClick}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
      />

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
