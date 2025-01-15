import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Video } from "@/types/marketing";

export const VideoCard = ({ video }: { video: Video }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
    <div className="aspect-video relative group">
      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <Button variant="default" size="icon" className="bg-primary hover:bg-primary-hover">
          <Download className="text-white" size={20} />
        </Button>
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 rounded text-white text-sm">
        {video.duration}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-white text-lg mb-2">{video.title}</h3>
      <p className="text-gray-300 text-sm mb-3">{video.description}</p>
      <div className="text-sm text-gray-400">{video.fileSize}</div>
    </div>
  </div>
);