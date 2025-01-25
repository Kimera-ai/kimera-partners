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
    'cartoon-skateboard': {
      description: 'A playful animated boy with tousled brown hair, big expressive eyes, and a wide grin. Wearing an orange hoodie and blue jeans, he performs a mid-air skateboard trick over a colorful skatepark ramp. The background features a bright blue sky with fluffy clouds, adding to the dynamic energy.',
      features: [
        'Dynamic action',
        'Bright colors',
        'Expressive pose',
        'Lively setting'
      ]
    },
    'cartoon-street-dance': {
      description: 'A fun-loving animated boy with curly hair, large shining eyes, and a backwards cap. Dressed in a casual t-shirt and jeans, he dances confidently in a neon-lit urban setting, surrounded by a cheering crowd of kids. The vibrant pink and blue lights enhance the energetic party vibe.',
      features: [
        'Neon lighting',
        'Expressive dance',
        'Urban vibe',
        'Lively crowd'
      ]
    },
    'cartoon-vintage': {
      description: 'A nostalgic animated girl with soft wavy hair, golden-brown eyes, and a gentle smile. Wearing denim shorts, a white blouse, and an orange headband, she holds a vintage camera in a glowing field of wildflowers during sunset. The warm golden light enhances the dreamy atmosphere.',
      features: [
        'Vintage tones',
        'Warm lighting',
        'Retro camera',
        'Soft details'
      ]
    },
    'cleopatra': {
      description: 'A regal woman dressed as Cleopatra, wearing an intricate golden dress and a stunning blue-and-gold striped headdress. Her bold eyeliner and golden jewelry highlight her powerful presence. The background features an ancient Egyptian temple at sunset, creating a dramatic royal aesthetic.',
      features: [
        'Royal elegance',
        'Historical accuracy',
        'Golden tones',
        'Dramatic setting'
      ]
    },
    'clown': {
      description: 'A classic circus clown with a big red nose, curly orange hair, and a playful grin. Wearing a bright blue and red costume with oversized buttons, ruffled collars, and a yellow hat, he stands in front of a striped circus tent with colorful balloons floating around.',
      features: [
        'Vibrant colors',
        'Whimsical outfit',
        'Expressive face',
        'Carnival theme'
      ]
    },
    'cruise-ship-party': {
      description: 'A cheerful man in a vibrant Hawaiian shirt and white shorts, enjoying a tropical evening on a cruise ship deck. Fireworks light up the night sky behind him, while the ocean and ship create a festive, vacation-like atmosphere.',
      features: [
        'Tropical vibes',
        'Festive energy',
        'Firework display',
        'Relaxed setting'
      ]
    },
    'cybersecurity-woman': {
      description: 'A confident woman in a sleek black blazer, standing in a futuristic high-tech environment. Her sharp blue eyes and composed expression exude intelligence and authority, with glowing screens in the background enhancing the cybersecurity theme.',
      features: [
        'Futuristic glow',
        'Professional look',
        'Tech ambiance',
        'Confident pose'
      ]
    },
    'elegant-man': {
      description: 'A sophisticated young man with sharp features, stubble, and intense green eyes. Wearing a tailored brown blazer over a denim shirt, he exudes charm and confidence. The background is softly lit, emphasizing his timeless style.',
      features: [
        'Sharp details',
        'Elegant styling',
        'Natural lighting',
        'Classic portrait'
      ]
    },
    'doctor-woman': {
      description: 'A professional young female doctor with soft blonde hair, wearing a white coat over blue scrubs. She stands in a bright, modern hospital corridor, her calm expression reflecting expertise and care.',
      features: [
        'Medical realism',
        'Soft lighting',
        'Professional attire',
        'Modern setting'
      ]
    },
    'farm-woman': {
      description: 'A natural beauty with wavy dark hair and green eyes, wearing a blue gingham dress with delicate lace details. Holding a basket full of fresh fruits and herbs, she walks through a sunlit countryside path surrounded by greenery and wildflowers.',
      features: [
        'Rustic charm',
        'Soft natural light',
        'Organic setting',
        'Fresh produce'
      ]
    },
    'adventure': {
      description: 'A rugged explorer with sharp blue eyes, stubbled face, and a determined expression. Dressed in a brown fedora, beige shirt, and a weathered leather vest, he grips a coiled whip while navigating an ancient, dimly lit temple with intricately carved stone pillars. The moody lighting enhances the cinematic adventure feel.',
      features: [
        'Enhanced realism',
        'Custom textures',
        'Cinematic lighting',
        'Heroic aesthetics'
      ]
    },
    'angel': {
      description: 'A celestial beauty with soft, radiant skin, wavy brown hair, and a delicate floral headpiece. Dressed in a flowing white gown with intricate lace details, she has large, feathery wings that spread gracefully behind her. She is bathed in golden light against a dreamy sky filled with fluffy clouds.',
      features: [
        'Soft glow',
        'Feathered wings',
        'Seamless blending',
        'Heavenly aura'
      ]
    },
    'artistic-blue-flowers': {
      description: 'A mysterious woman with piercing blue eyes and wavy blonde hair, partially veiled by mist. Blue flowers are woven into her hair, and she is surrounded by a dreamy, enchanted atmosphere with glowing highlights. The background features warm orange flower accents for contrast.',
      features: [
        'Dreamy effects',
        'Rich colors',
        'Soft mist',
        'Floral elegance'
      ]
    },
    'artistic-purple-flowers': {
      description: 'A striking woman with icy blue eyes and an elegant updo, adorned with delicate purple blossoms. Her deep red lips contrast with the cool purple hues, and wisps of ethereal mist swirl around her, giving a surreal, fairytale-like quality against a dark, moody background.',
      features: [
        'Deep hues',
        'Mysterious glow',
        'Elegant florals',
        'Artistic depth'
      ]
    },
    'artistic-red-flowers': {
      description: 'A fiery, confident woman with piercing green eyes and auburn hair, surrounded by glowing red poppies. Her bold red lips and smoky eye makeup add to her intense and captivating presence, framed by swirling mist in a dark, dramatic setting.',
      features: [
        'Bold contrast',
        'Fiery tones',
        'Dramatic mist',
        'Passionate feel'
      ]
    },
    'astronaut': {
      description: 'A smiling astronaut in a white NASA spacesuit, floating in space with distant planets in the background. His glass helmet reflects twinkling stars, capturing the excitement of space exploration with crisp, realistic details.',
      features: [
        'Sharp details',
        'Reflective visor',
        'Cosmic backdrop',
        'Adventure vibe'
      ]
    },
    'cartoon-ballet': {
      description: 'A cute, animated girl with large, sparkling hazel eyes and soft brown curls, topped with a big pink bow. She wears a delicate lavender tutu dress with glittering details, poised elegantly in a sunlit dance studio where other ballerinas practice in the background.',
      features: [
        'Soft pastels',
        'Glowing tutu',
        'Graceful pose',
        'Whimsical feel'
      ]
    },
    'cartoon-bubbles': {
      description: 'A cheerful, cartoon-style girl with bright, round eyes and rosy cheeks, sitting on a grassy field. She wears a pink sundress and sparkly shoes, surrounded by large, iridescent bubbles floating in a clear blue sky.',
      features: [
        'Bright colors',
        'Floating bubbles',
        'Soft glow',
        'Joyful vibe'
      ]
    },
    'cartoon-kite': {
      description: 'A playful, animated boy with tousled brown hair and wide green eyes, grinning as he flies a bright red-and-yellow kite. He wears a cozy green hoodie, rolled-up jeans, and sneakers, standing on a grassy hill under a breezy, blue sky.',
      features: [
        'Dynamic motion',
        'Wind effects',
        'Crisp outlines',
        'Lively setting'
      ]
    },
    'cartoon-paint': {
      description: 'A lively, cartoon-style girl with oversized blue eyes and bouncy brown curls, holding two large paintbrushes dripping with color. She wears a pink hoodie with colorful paint splatters, ripped jeans, and sneakers, standing in front of a vibrant mural filled with flowers and abstract designs.',
      features: [
        'Vibrant colors',
        'Dynamic paint',
        'Polished textures',
        'Creative energy'
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

