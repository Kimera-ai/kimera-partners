import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface Theme {
  id: string;
  title: string;
  image_url: string | null;
}

interface ThemeImageManagerProps {
  theme: Theme;
  onImageUpdate: () => void;
}

const ThemeImageManager = ({ theme, onImageUpdate }: ThemeImageManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Upload file to themes bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${theme.id}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('themes')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('themes')
        .getPublicUrl(fileName);

      // Update theme record with new image URL
      const { error: updateError } = await supabase
        .from('themes')
        .update({ image_url: publicUrl })
        .eq('id', theme.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Theme image updated successfully",
      });

      onImageUpdate();
    } catch (error) {
      console.error('Error updating theme image:', error);
      toast({
        title: "Error",
        description: "Failed to update theme image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-white/5 border border-white/10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <span className="text-sm text-gray-300">{theme.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="relative overflow-hidden"
              disabled={isLoading}
            >
              Upload Image
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isLoading}
              />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ThemeImageManager;