import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard } from "./VideoCard";
import { Loader2 } from "lucide-react";
import type { Video } from "@/types/marketing";

export const VideoGrid = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedVideos: Video[] = await Promise.all(
        (data || []).map(async (video) => {
          // Get the video URL
          const { data: { publicUrl: videoUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(video.video_path);

          // Get the thumbnail URL (if exists, otherwise use video URL)
          const { data: { publicUrl: thumbnailUrl } } = supabase.storage
            .from('videos')
            .getPublicUrl(video.thumbnail_path || video.video_path);

          return {
            id: video.id,
            title: video.title,
            description: video.description || '',
            thumbnail: thumbnailUrl,
            downloadUrl: videoUrl,
            duration: video.duration || 'N/A',
            fileSize: video.file_size || 'N/A'
          };
        })
      );

      setVideos(formattedVideos);
      console.log('Fetched videos:', formattedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};