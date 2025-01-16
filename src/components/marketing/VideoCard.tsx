import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Video } from "@/types/marketing";
import { useState } from "react";

export const VideoCard = ({ video }: { video: Video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
      <div className="aspect-video relative group">
        {isPlaying ? (
          <video
            src={video.downloadUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <>
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsPlaying(true)}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
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
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 rounded text-white text-sm">
              {video.duration}
            </div>
          </>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-white text-lg mb-2">{video.title}</h3>
        <p className="text-gray-300 text-sm mb-3">{video.description}</p>
        <div className="text-sm text-gray-400">{video.fileSize}</div>
      </div>
    </div>
  );
};