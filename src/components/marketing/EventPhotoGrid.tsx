import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VisualAssetCard } from "./VisualAssetCard";
import { Loader2 } from "lucide-react";
import type { VisualAsset } from "@/types/marketing";

export const EventPhotoGrid = () => {
  const [photos, setPhotos] = useState<VisualAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPhotos: VisualAsset[] = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: { publicUrl } } = supabase.storage
            .from('event_photos')
            .getPublicUrl(photo.image_path);

          return {
            id: parseInt(photo.id),
            type: 'image',
            category: 'Event Photos',
            title: photo.title,
            description: photo.description || '',
            thumbnail: publicUrl,
            downloadUrl: publicUrl,
            dimensions: 'Original',
            fileSize: 'N/A',
            tags: ['event', 'photo']
          };
        })
      );

      setPhotos(formattedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
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
      {photos.map((photo) => (
        <VisualAssetCard key={photo.id} asset={photo} />
      ))}
    </div>
  );
};