
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Video } from "@/types/marketing";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const VideoCard = ({ video }: { video: Video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <div className="bg-[#1A1123] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
      <div className="relative group">
        <AspectRatio ratio={2/3}>
          {isPlaying ? (
            <video
              src={video.downloadUrl}
              controls
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <>
              {thumbnailError ? (
                <video
                  src={video.downloadUrl}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                />
              ) : (
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                  onError={() => setThumbnailError(true)}
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Button 
                  variant="default" 
                  size="icon" 
                  className="bg-primary hover:bg-primary-hover"
                  onClick={() => setIsPlaying(true)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-6 h-6 text-white"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Button>
                <a href={video.downloadUrl} download target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="icon" className="bg-primary hover:bg-primary-hover">
                    <Download className="text-white" size={20} />
                  </Button>
                </a>
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/75 rounded text-xs font-medium text-white">
                {video.duration}
              </div>
            </>
          )}
        </AspectRatio>
      </div>
    </div>
  );
};
