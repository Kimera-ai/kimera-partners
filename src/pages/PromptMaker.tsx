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
import { toast } from "sonner";

const PromptMaker = () => {
  const { session } = useSession();
  const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const jobRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const generationStartTimeRef = useRef<number | null>(null);
  
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
    latestJobRef,
    fetchPreviousGenerations,
    isRefreshingHistory,
    manualRefreshHistory
  } = useGenerationJobs(session);

  // Simplified initial history fetch
  useEffect(() => {
    if (session?.user) {
      console.log("PROMPTMAKER: Initial fetch of previous generations");
      fetchPreviousGenerations();
    }
  }, [session?.user, fetchPreviousGenerations]);

  // Simpler history refresh on job completion
  useEffect(() => {
    const completedJobs = generationJobs.filter(job => job.isCompleted);
    if (completedJobs.length > 0) {
      console.log(`PROMPTMAKER: ${completedJobs.length} job(s) completed, refreshing history`);
      setHistoryRefreshTrigger(prev => prev + 1);
    }
  }, [generationJobs]);

  // History panel open handler
  useEffect(() => {
    if (isHistoryOpen && session?.user) {
      console.log("PROMPTMAKER: History panel opened, refreshing history");
      fetchPreviousGenerations();
      setHistoryRefreshTrigger(prev => prev + 1);
    }
  }, [isHistoryOpen, session?.user, fetchPreviousGenerations]);

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

  // Simplified generation handling with fewer refreshes
  const wrappedHandleGenerate = useCallback(async (): Promise<void> => {
    generationStartTimeRef.current = Date.now();
    console.log("PROMPTMAKER: Generation started at", new Date().toISOString());
    
    // Single pre-generation refresh
    await fetchPreviousGenerations();
    
    // Start generation
    handleGenerate();
    
    // Only do a single delayed refresh 5 seconds after generation starts
    return new Promise<void>(resolve => {
      setTimeout(async () => {
        console.log("PROMPTMAKER: Post-generation refresh");
        await fetchPreviousGenerations();
        resolve();
      }, 5000);
    });
  }, [fetchPreviousGenerations, handleGenerate]);

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
      is_video: imageData.isVideo,
      created_at: new Date().toISOString()
    };
    
    handleImageClick(generationData);
  }, [prompt, style, ratio, loraScale, handleImageClick]);

  // Simpler completed images handling
  useEffect(() => {
    if (generatedImages.length > 0 && generationStartTimeRef.current) {
      const generationTime = Date.now() - generationStartTimeRef.current;
      console.log(`PROMPTMAKER: Generation completed in ${formatTime(generationTime)}`);
      
      if (previousGenerations.length === 0) {
        toast.info(
          "Your images may take a few moments to appear in history. Try refreshing the history panel.",
          { duration: 5000 }
        );
      }
      
      generationStartTimeRef.current = null;
    }
  }, [generatedImages, previousGenerations.length, formatTime]);

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
            imagePreview={imagePreview}
            isUploading={isUploading}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            CREDITS_PER_GENERATION={CREDITS_PER_GENERATION}
          />
        }
      >
        <div className="w-full h-full p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <PageHeader 
              title="Kimera Creation Tool"
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
              handleGenerate={wrappedHandleGenerate}
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
        refreshTrigger={historyRefreshTrigger}
        isRefreshingHistory={isRefreshingHistory}
        manualRefreshHistory={manualRefreshHistory}
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
