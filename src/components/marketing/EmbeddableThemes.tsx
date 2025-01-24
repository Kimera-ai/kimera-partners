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
  const name = imageName.toLowerCase().replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

  const themeDetails: Record<string, { description: string, features: string[] }> = {
    'adventure': {
      description: 'A rugged explorer with sharp blue eyes, stubbled face, and a determined expression. Dressed in a brown fedora, beige shirt, and a weathered leather vest, he grips a coiled whip while navigating an ancient, dimly lit temple with intricately carved stone pillars. The moody lighting enhances the cinematic adventure feel.',
      features: [
        'Smart enhancement – Depth and rugged detail in clothing and environment',
        'Custom effects – Realistic textures on attire and temple ruins',
        'Professional finish – Cinematic lighting and high clarity',
        'Artistic touches – Adventure-inspired aesthetic with an aged, mysterious setting'
      ]
    },
    'angel': {
      description: 'A celestial beauty with soft, radiant skin, wavy brown hair, and a delicate floral headpiece. Dressed in a flowing white gown with intricate lace details, she has large, feathery wings that spread gracefully behind her. She is bathed in golden light against a dreamy sky filled with fluffy clouds.',
      features: [
        'Smart enhancement – Ethereal glow and soft-focus details',
        'Custom effects – Realistic feathered wings and divine lighting',
        'Professional finish – High-definition clarity with seamless blending',
        'Artistic touches – Heavenly background with radiant aura'
      ]
    },
    'artistic-blue-flowers': {
      description: 'A mysterious woman with piercing blue eyes and wavy blonde hair, partially veiled by mist. Blue flowers are woven into her hair, and she is surrounded by a dreamy, enchanted atmosphere with glowing highlights. The background features warm orange flower accents for contrast.',
      features: [
        'Smart enhancement – Dreamy atmosphere with soft blurs',
        'Custom effects – Vibrant, enchanting blue floral arrangement',
        'Professional finish – Balanced contrast between cool and warm tones',
        'Artistic touches – Delicate mist and fairytale-like ambiance'
      ]
    },
    'artistic-purple-flowers': {
      description: 'A striking woman with icy blue eyes and an elegant updo, adorned with delicate purple blossoms. Her deep red lips contrast with the cool purple hues, and wisps of ethereal mist swirl around her, giving a surreal, fairytale-like quality against a dark, moody background.',
      features: [
        'Smart enhancement – Deep hues and vivid color grading',
        'Custom effects – Soft mist and shadow play for mystery',
        'Professional finish – High-resolution clarity',
        'Artistic touches – Elegant floral elements enhancing the composition'
      ]
    },
    'artistic-red-flowers': {
      description: 'A fiery, confident woman with piercing green eyes and auburn hair, surrounded by glowing red poppies. Her bold red lips and smoky eye makeup add to her intense and captivating presence, framed by swirling mist in a dark, dramatic setting.',
      features: [
        'Smart enhancement – High contrast and bold depth',
        'Custom effects – Realistic textures in flowers and hair',
        'Professional finish – Cinematic portraiture',
        'Artistic touches – Fiery composition with a passionate color scheme'
      ]
    },
    'astronaut': {
      description: 'A smiling astronaut in a white NASA spacesuit, floating in space with distant planets in the background. His glass helmet reflects twinkling stars, capturing the excitement of space exploration with crisp, realistic details.',
      features: [
        'Smart enhancement – Sharp suit details and reflections',
        'Custom effects – Realistic space elements like stars and planets',
        'Professional finish – Perfect lighting balance',
        'Artistic touches – Expressive portrait capturing adventure and wonder'
      ]
    },
    'cartoon-ballet': {
      description: 'A cute, animated girl with large, sparkling hazel eyes and soft brown curls, topped with a big pink bow. She wears a delicate lavender tutu dress with glittering details, poised elegantly in a sunlit dance studio where other ballerinas practice in the background.',
      features: [
        'Smart enhancement – Soft pastel tones and gentle shading',
        'Custom effects – Sparkling tutu details for a magical effect',
        'Professional finish – Smooth, high-quality animation styling',
        'Artistic touches – Whimsical and dreamy ballet scene'
      ]
    },
    'cartoon-bubbles': {
      description: 'A cheerful, cartoon-style girl with bright, round eyes and rosy cheeks, sitting on a grassy field. She wears a pink sundress and sparkly shoes, surrounded by large, iridescent bubbles floating in a clear blue sky.',
      features: [
        'Smart enhancement – Vibrant colors and soft character details',
        'Custom effects – Glowing, translucent bubbles',
        'Professional finish – Clean, high-definition rendering',
        'Artistic touches – Bright and cheerful outdoor scene'
      ]
    },
    'cartoon-kite': {
      description: 'A playful, animated boy with tousled brown hair and wide green eyes, grinning as he flies a bright red-and-yellow kite. He wears a cozy green hoodie, rolled-up jeans, and sneakers, standing on a grassy hill under a breezy, blue sky.',
      features: [
        'Smart enhancement – Dynamic motion effects',
        'Custom effects – Realistic wind-blown elements',
        'Professional finish – Crisp outlines and smooth color balance',
        'Artistic touches – Idyllic outdoor setting with a sense of movement'
      ]
    },
    'cartoon-paint': {
      description: 'A lively, cartoon-style girl with oversized blue eyes and bouncy brown curls, holding two large paintbrushes dripping with color. She wears a pink hoodie with colorful paint splatters, ripped jeans, and sneakers, standing in front of a vibrant mural filled with flowers and abstract designs.',
      features: [
        'Smart enhancement – Bright and expressive character design',
        'Custom effects – Dynamic paint splashes',
        'Professional finish – Smooth, polished cartoon textures',
        'Artistic touches – A playful and creative theme with vibrant energy'
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

