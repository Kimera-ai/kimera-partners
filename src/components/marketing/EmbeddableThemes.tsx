import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { GalleryHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Theme {
  id: number;
  title: string;
  description: string;
  imageName: string;
  features: string[];
}

const getThemeDescription = (imageName: string): { description: string, features: string[] } => {
  // Remove file extension and convert to lowercase for matching
  const name = imageName.toLowerCase().replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

  const themeDetails: Record<string, { description: string, features: string[] }> = {
    'vintage': {
      description: 'A classic film-inspired theme that adds warm tones and subtle grain, perfect for creating timeless portraits with a nostalgic feel.',
      features: [
        'Warm color grading',
        'Film grain effect',
        'Vintage vignetting',
        'Classic aesthetics'
      ]
    },
    'cyberpunk': {
      description: 'Bold neon colors and futuristic effects transform your photos into stunning cyberpunk-style portraits with a high-tech edge.',
      features: [
        'Neon highlights',
        'Digital effects',
        'Tech overlays',
        'Future aesthetic'
      ]
    },
    'noir': {
      description: 'Dramatic black and white processing with enhanced contrast creates moody, film noir-style portraits with timeless appeal.',
      features: [
        'High contrast B&W',
        'Film noir shadows',
        'Dramatic lighting',
        'Classic mood'
      ]
    },
    'pop-art': {
      description: 'Vibrant colors and bold patterns inspired by pop art create eye-catching portraits with a fun, artistic twist.',
      features: [
        'Bold colors',
        'Pop art patterns',
        'Artistic effects',
        'Retro style'
      ]
    },
    'ethereal': {
      description: 'Soft, dreamy effects and delicate color grading create ethereal portraits with a magical, otherworldly quality.',
      features: [
        'Soft light effects',
        'Dreamy atmosphere',
        'Ethereal glow',
        'Magical elements'
      ]
    },
    'retro': {
      description: 'Vintage color palettes and subtle light leaks capture the charm of analog photography from decades past.',
      features: [
        'Retro colors',
        'Light leak effects',
        'Film texture',
        'Nostalgic mood'
      ]
    },
    'minimal': {
      description: 'Clean, refined processing that enhances natural beauty while maintaining elegant simplicity.',
      features: [
        'Clean aesthetics',
        'Subtle effects',
        'Natural enhancement',
        'Modern style'
      ]
    },
    // Default theme details for any unmatched images
    'default': {
      description: 'A unique AI-powered transformation that creates stunning portraits with professional quality effects.',
      features: [
        'AI enhancement',
        'Professional effects',
        'Custom processing',
        'High-quality output'
      ]
    }
  };

  // Find the matching theme or return default
  const matchedTheme = Object.keys(themeDetails).find(key => name.includes(key));
  return matchedTheme ? themeDetails[matchedTheme] : themeDetails['default'];
};

// ... keep existing code (fetchThemes function and other utilities)

const EmbeddableThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        console.log('Starting to fetch themes...');
        const { data: files, error: listError } = await supabase.storage
          .from('themes')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (listError) {
          console.error('Error listing files:', listError);
          setError('Failed to fetch themes');
          return;
        }

        if (!files || files.length === 0) {
          setError('No themes found in the bucket');
          return;
        }

        const imageFiles = files.filter(file => 
          file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        );

        if (imageFiles.length === 0) {
          setError('No image files found in themes bucket');
          return;
        }

        const generatedThemes = await Promise.all(imageFiles.map(async (file, index) => {
          const { data: urlData } = supabase.storage
            .from('themes')
            .getPublicUrl(file.name);

          const themeDetails = getThemeDescription(file.name);

          return {
            id: index + 1,
            title: file.name
              .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
              .replace(/[-_]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
            description: themeDetails.description,
            imageName: urlData.publicUrl,
            features: themeDetails.features
          };
        }));

        setThemes(generatedThemes);
      } catch (err) {
        console.error('Unexpected error in fetchThemes:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, []);

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
          <p>{error || 'No themes found'}</p>
        </div>
        <p className="text-gray-400">Please make sure there are image files in the themes bucket.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#100919] text-gray-300 p-8">
      <header className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
          <GalleryHorizontal className="w-8 h-8" />
          AI Photobooth Themes
        </h2>
        <p className="text-xl text-gray-300">
          Transform your events with our collection of stunning AI-powered photo themes.
          Each theme offers unique visual effects and artistic transformations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className="group overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={theme.imageName}
                alt={theme.title}
                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  console.error(`Error loading image for ${theme.title}`);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                  View Theme
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-white group-hover:text-primary transition-colors">
                {theme.title}
              </h3>
              <p className="text-gray-400 line-clamp-2">
                {theme.description}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary">Features:</h4>
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
        ))}
      </div>
    </div>
  );
};

export default EmbeddableThemes;
