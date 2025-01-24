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
      description: 'Step back in time with our Vintage theme. This classic film-inspired filter adds warm, golden tones and subtle grain texture to create timeless portraits that feel like they were shot on analog film.',
      features: [
        'Warm sepia tones',
        'Film grain overlay',
        'Light leaks effect',
        'Vintage color grading'
      ]
    },
    'cyberpunk': {
      description: 'Enter the digital future with our Cyberpunk theme. This bold transformation adds electric neon highlights and futuristic glitch effects for portraits that look straight out of a sci-fi masterpiece.',
      features: [
        'Neon color accents',
        'Digital glitch effects',
        'Holographic overlays',
        'Futuristic lighting'
      ]
    },
    'noir': {
      description: 'Channel the mystery of classic film noir with our Noir theme. Dramatic shadows and high contrast black and white processing create moody, cinematic portraits with timeless sophistication.',
      features: [
        'Rich monochrome tones',
        'Deep shadow contrast',
        'Film noir lighting',
        'Dramatic vignette'
      ]
    },
    'pop-art': {
      description: 'Make a bold statement with our Pop Art theme. Inspired by iconic 60s art, this vibrant transformation uses bold colors and graphic patterns to turn portraits into eye-catching contemporary artwork.',
      features: [
        'Vivid color blocks',
        'Halftone patterns',
        'Comic book style',
        'Pop culture aesthetic'
      ]
    },
    'ethereal': {
      description: 'Create dreamlike portraits with our Ethereal theme. Soft, luminous effects and delicate color grading combine to produce otherworldly images with a magical, floating quality.',
      features: [
        'Soft light diffusion',
        'Ethereal glow effect',
        'Dreamy color palette',
        'Subtle sparkle'
      ]
    },
    'retro': {
      description: 'Capture the charm of decades past with our Retro theme. This nostalgic filter adds vintage color shifts and subtle imperfections to create photos that feel like cherished memories.',
      features: [
        'Vintage color shifts',
        'Authentic film effects',
        'Period-correct tones',
        'Retro light leaks'
      ]
    },
    'minimal': {
      description: 'Embrace elegant simplicity with our Minimal theme. Clean lines and subtle enhancements create sophisticated portraits that let natural beauty shine through.',
      features: [
        'Refined contrast',
        'Clean color grading',
        'Elegant highlights',
        'Modern simplicity'
      ]
    },
    'default': {
      description: 'Transform your photos with our signature AI effects. This versatile theme enhances your portraits with professional-quality processing and artistic flourishes.',
      features: [
        'Smart enhancement',
        'Custom effects',
        'Professional finish',
        'Artistic touches'
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

