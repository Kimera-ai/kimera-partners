import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Palette, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Theme {
  id: number;
  title: string;
  description: string;
  imageName: string;
  features: string[];
}

const EmbeddableThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        console.log('Fetching themes from Supabase storage...');
        const { data: files, error: listError } = await supabase.storage
          .from('themes')
          .list();

        if (listError) {
          console.error('Error fetching themes:', listError);
          setError(listError.message);
          return;
        }

        console.log('Files from bucket:', files);

        if (!files || files.length === 0) {
          setError('No themes found in the bucket');
          return;
        }

        // Filter for image files only
        const imageFiles = files.filter(file => 
          file.name.match(/\.(jpg|jpeg|png|gif)$/i)
        );

        console.log('Filtered image files:', imageFiles);

        // Generate themes from image files
        const generatedThemes = imageFiles.map((file, index) => {
          const title = file.name
            .replace(/\.(jpg|jpeg|png|gif)$/i, '')
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return {
            id: index + 1,
            title,
            description: `Transform your photos with our ${title.toLowerCase()} theme, creating stunning and unique visual experiences.`,
            imageName: file.name,
            features: [
              `${title} style effects`,
              'Professional filters',
              'Custom overlays',
              'Unique aesthetics'
            ]
          };
        });

        console.log('Generated themes:', generatedThemes);
        setThemes(generatedThemes);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const getThemeImageUrl = (imageName: string) => {
    try {
      const { data } = supabase.storage
        .from('themes')
        .getPublicUrl(imageName);
      
      console.log(`Generated URL for ${imageName}:`, data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error generating URL for', imageName, error);
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-400">Loading themes...</p>
      </div>
    );
  }

  if (error || themes.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'No themes found in the bucket'}</p>
        </div>
        <p className="text-gray-400">Please make sure there are image files in the themes bucket.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#100919] text-gray-300 p-8">
      <header className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
          <Palette className="w-8 h-8" />
          AI Photobooth Themes
        </h2>
        <p className="text-xl text-gray-300">
          Transform your events with our collection of stunning AI-powered photo themes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme) => {
          const imageUrl = getThemeImageUrl(theme.imageName);
          console.log(`Final image URL for ${theme.title}:`, imageUrl);
          
          return (
            <Card 
              key={theme.id} 
              className="overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={imageUrl}
                  alt={theme.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    console.error(`Error loading image for ${theme.title}`);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-semibold text-white">{theme.title}</h3>
                <p className="text-gray-300">{theme.description}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-primary">Key Features:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {theme.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary/50 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EmbeddableThemes;