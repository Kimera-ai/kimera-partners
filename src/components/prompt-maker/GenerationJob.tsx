
import { Clock, Loader2, Share2, Check, AlertTriangle, Play, Pause, Maximize2 } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedImageData {
  url: string;
  seed: string | null;
  pipeline_id: string | null;
  isVideo?: boolean;
}

export interface GenerationJobType {
  id: string;
  status: string;
  completedImages: number;
  totalImages: number;
  generatedImages: (GeneratedImageData | null)[];
  isCompleted: boolean;
  displayImages: boolean;
  startTime: number;
  elapsedTime: number;
  error?: string | null;
  isVideo?: boolean;
  ratio?: string;
}

interface GenerationJobProps {
  job: GenerationJobType;
  formatTime: (milliseconds: number) => string;
  handleDownload: (imageUrl: string) => Promise<void>;
  onImageClick?: (imageData: GeneratedImageData) => void;
}

export const GenerationJobComponent = forwardRef<HTMLDivElement, GenerationJobProps>(
  ({ job, formatTime, handleDownload, onImageClick }, ref) => {
    const validImages = job.generatedImages.filter(img => img !== null) as GeneratedImageData[];
    const { toast } = useToast();
    const [copiedImageUrl, setCopiedImageUrl] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [fullscreenPreview, setFullscreenPreview] = useState<string | null>(null);
    const [magnifyEnabled, setMagnifyEnabled] = useState(false);
    const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 });
    const [magnifyZoom, setMagnifyZoom] = useState(2);
    const imageRef = React.useRef<HTMLImageElement>(null);
    
    console.log(`Job ${job.id}: completed=${job.isCompleted}, validImages=${validImages.length}, isVideo=${job.isVideo}`);
    
    const getGridClass = (imageCount: number) => {
      switch (imageCount) {
        case 1: return "grid-cols-1";
        case 2: return "grid-cols-1 sm:grid-cols-2";
        case 3: return "grid-cols-1 sm:grid-cols-3";
        default: return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      }
    };

    // Calculate optimal image dimensions based on ratio
    const getImageStyle = (ratio: string = "2:3") => {
      const [width, height] = ratio.split(":").map(Number);
      const aspectRatio = width / height;
      
      // Set max height to 500px
      const maxHeight = 500;
      const calculatedWidth = maxHeight * aspectRatio;
      
      return {
        maxHeight: `${maxHeight}px`,
        maxWidth: `${calculatedWidth}px`,
        aspectRatio: String(aspectRatio)
      };
    };

    const handleShare = async (imageUrl: string) => {
      try {
        // Create a shareable link from the image URL
        await navigator.clipboard.writeText(imageUrl);
        
        // Set copied state to show feedback
        setCopiedImageUrl(imageUrl);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setCopiedImageUrl(null);
        }, 2000);
        
        toast({
          title: "Link copied!",
          description: job.isVideo ? "Video link has been copied to clipboard" : "Image link has been copied to clipboard",
          duration: 3000
        });
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy link to clipboard",
          duration: 3000
        });
      }
    };

    const toggleVideoPlayback = (videoUrl: string, event: React.MouseEvent) => {
      event.stopPropagation();
      setPlayingVideo(playingVideo === videoUrl ? null : videoUrl);
    };

    // Toggle fullscreen preview
    const openFullscreenPreview = (imageUrl: string, event: React.MouseEvent) => {
      event.stopPropagation();
      setFullscreenPreview(imageUrl);
      setMagnifyEnabled(false);
    };

    // Handle fullscreen backdrop click to close
    const handleFullscreenBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setFullscreenPreview(null);
        setMagnifyEnabled(false);
      }
    };

    // Toggle magnify glass
    const toggleMagnify = () => {
      setMagnifyEnabled(!magnifyEnabled);
    };

    // Handle zoom level change
    const increaseZoom = () => {
      setMagnifyZoom(prev => Math.min(prev + 0.5, 5));
    };

    const decreaseZoom = () => {
      setMagnifyZoom(prev => Math.max(prev - 0.5, 1.5));
    };

    // Handle mouse movement for magnifying glass
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!magnifyEnabled || !imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      
      // Calculate position relative to image
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMagnifyPosition({ x, y });
    };

    // Always show images if we have valid images, regardless of job completion status
    const shouldShowImages = validImages.length > 0;

    return (
      <Card ref={ref} className={`p-4 bg-card/40 backdrop-blur border ${job.error ? 'border-red-500/20' : 'border-white/5'} shadow-md mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {!job.isCompleted && job.completedImages < job.totalImages ? (
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            ) : job.error ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            )}
            <div className={`font-medium ${job.error ? 'text-red-500' : ''}`}>
              {job.status}
              {job.totalImages > 0 && !job.error && (
                <span className="text-muted-foreground ml-1 text-sm">
                  ({job.completedImages}/{job.totalImages} {job.isVideo ? "videos" : "images"})
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(job.elapsedTime)}</span>
          </div>
        </div>
        
        {job.error && job.completedImages === 0 && (
          <div className="mt-2 text-sm text-red-400 bg-red-950/20 p-3 rounded-lg">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {job.error}
            </p>
            <p className="mt-1 text-xs text-red-300/70">
              Try again with a different prompt or settings.
            </p>
          </div>
        )}
        
        {shouldShowImages && (
          <div className={`grid ${getGridClass(validImages.length)} gap-3 mt-3`}>
            {validImages.map((imageData, index) => (
              <div 
                key={index} 
                className="relative group rounded-md overflow-hidden bg-black cursor-pointer mx-auto"
                style={getImageStyle(job.ratio)}
                onClick={() => onImageClick && onImageClick(imageData)}
              >
                {imageData.isVideo ? (
                  <video 
                    src={imageData.url} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    loop
                    muted
                    playsInline
                    onClick={(e) => e.stopPropagation()}
                    onError={() => {
                      console.error(`Failed to load video at ${imageData.url}`);
                    }}
                  />
                ) : (
                  <img 
                    src={imageData.url} 
                    alt={`Generated ${index}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image at ${imageData.url}`);
                      e.currentTarget.src = 'https://placehold.co/600x800/191223/404040?text=Image+Failed+to+Load';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(imageData.url);
                    }}
                    title={`Download ${imageData.isVideo ? 'video' : 'image'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                  <button 
                    className={`bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors ${copiedImageUrl === imageData.url ? 'bg-green-500/50 text-white' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(imageData.url);
                    }}
                    title={`Copy ${imageData.isVideo ? 'video' : 'image'} link`}
                  >
                    {copiedImageUrl === imageData.url ? (
                      <Check size={20} />
                    ) : (
                      <Share2 size={20} />
                    )}
                  </button>
                  {imageData.isVideo ? (
                    <button 
                      className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors"
                      onClick={(e) => toggleVideoPlayback(imageData.url, e)}
                      title="Toggle video playback"
                    >
                      {playingVideo === imageData.url ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} />
                      )}
                    </button>
                  ) : (
                    <button 
                      className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full transition-colors"
                      onClick={(e) => openFullscreenPreview(imageData.url, e)}
                      title="View full size"
                    >
                      <Maximize2 size={20} />
                    </button>
                  )}
                </div>
                {job.error && job.isCompleted && (
                  <div className="absolute bottom-0 left-0 right-0 bg-amber-500/20 text-amber-200 text-xs py-1 px-2">
                    {imageData.isVideo ? "Video" : "Image"} {index + 1} generated successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {job.error && job.completedImages > 0 && (
          <div className="mt-3 text-sm text-amber-400 bg-amber-950/20 p-2.5 rounded-lg">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {job.error}
            </p>
            <p className="mt-1 text-xs text-amber-300/70">
              {job.completedImages} of {job.totalImages} {job.isVideo ? "videos were" : "images were"} successfully generated.
            </p>
          </div>
        )}

        {/* Fullscreen Preview with Magnifying Glass */}
        {fullscreenPreview && !job.isVideo && (
          <div 
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center cursor-zoom-out"
            onClick={handleFullscreenBackdropClick}
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                className={`p-2 rounded-full ${magnifyEnabled ? 'bg-primary text-primary-foreground' : 'bg-black/40 text-white hover:bg-black/60'}`}
                onClick={toggleMagnify}
                aria-label="Toggle magnifying glass"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>
              
              {magnifyEnabled && (
                <>
                  <button 
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
                    onClick={decreaseZoom}
                    aria-label="Decrease zoom"
                    disabled={magnifyZoom <= 1.5}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </button>
                  
                  <button 
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
                    onClick={increaseZoom}
                    aria-label="Increase zoom"
                    disabled={magnifyZoom >= 5}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </button>
                </>
              )}
              
              <button 
                className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
                onClick={() => setFullscreenPreview(null)}
                aria-label="Close fullscreen preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div 
              className="relative max-w-[95vw] max-h-[95vh] overflow-auto"
              onMouseMove={handleMouseMove}
            >
              <img 
                ref={imageRef}
                src={fullscreenPreview} 
                alt="Full size preview" 
                className="max-w-none max-h-none object-contain" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent clicks on the image from closing the preview
                }}
                onError={(e) => {
                  console.error(`Error loading fullscreen image: ${fullscreenPreview}`);
                  e.currentTarget.src = 'https://placehold.co/1200x1600/191223/404040?text=Image+Failed+to+Load';
                }}
              />
              
              {/* Magnifying Glass */}
              {magnifyEnabled && (
                <div 
                  className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg overflow-hidden"
                  style={{
                    width: '150px',
                    height: '150px',
                    top: `${magnifyPosition.y * 100}%`,
                    left: `${magnifyPosition.x * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundImage: `url(${fullscreenPreview})`,
                    backgroundPosition: `${magnifyPosition.x * 100}% ${magnifyPosition.y * 100}%`,
                    backgroundSize: `${magnifyZoom * 100}%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-0.5 h-full bg-white/20"></div>
                    <div className="h-0.5 w-full bg-white/20 absolute"></div>
                  </div>
                </div>
              )}
              
              {/* Magnify instructions indicator */}
              {magnifyEnabled && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-2 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
                    <path d="M13 13l6 6"></path>
                  </svg>
                  <span>Move cursor to magnify</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    );
  }
);

GenerationJobComponent.displayName = "GenerationJobComponent";
