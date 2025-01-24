import React from 'react';
import { Palette } from 'lucide-react';
import BaseLayout from '@/components/layouts/BaseLayout';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const themes = [
  {
    id: 1,
    title: "Vintage Hollywood",
    description: "Transform guests into classic movie stars with a timeless black and white aesthetic, complete with dramatic lighting and iconic Hollywood glamour.",
    image: `${supabase.storage.from('themes').getPublicUrl('vintage-hollywood.jpg').data.publicUrl}`,
  },
  {
    id: 2,
    title: "Cyberpunk Future",
    description: "Transport attendees to a neon-lit future with vibrant colors, digital glitches, and futuristic elements inspired by sci-fi aesthetics.",
    image: `${supabase.storage.from('themes').getPublicUrl('cyberpunk.jpg').data.publicUrl}`,
  },
  {
    id: 3,
    title: "Fantasy Realms",
    description: "Create magical transformations with ethereal lighting, mystical backgrounds, and fantasy-inspired elements that transport guests to enchanted worlds.",
    image: `${supabase.storage.from('themes').getPublicUrl('fantasy.jpg').data.publicUrl}`,
  },
  {
    id: 4,
    title: "Pop Art",
    description: "Transform photos into vibrant pop art masterpieces with bold colors, comic book-style effects, and artistic filters inspired by Andy Warhol.",
    image: `${supabase.storage.from('themes').getPublicUrl('pop-art.jpg').data.publicUrl}`,
  },
  {
    id: 5,
    title: "Minimalist",
    description: "Create elegant transformations with clean lines, subtle effects, and refined aesthetics that emphasize simplicity and sophistication.",
    image: `${supabase.storage.from('themes').getPublicUrl('minimalist.jpg').data.publicUrl}`,
  },
  {
    id: 6,
    title: "Retro Gaming",
    description: "Transform photos with pixelated effects, 8-bit styling, and classic gaming aesthetics that appeal to nostalgia and gaming culture.",
    image: `${supabase.storage.from('themes').getPublicUrl('retro-gaming.jpg').data.publicUrl}`,
  },
  {
    id: 7,
    title: "Anime Style",
    description: "Convert photos into anime-inspired artwork with characteristic big eyes, expressive features, and distinctive Japanese animation styling.",
    image: `${supabase.storage.from('themes').getPublicUrl('anime.jpg').data.publicUrl}`,
  },
  {
    id: 8,
    title: "Street Art",
    description: "Transform photos with urban art styles, graffiti elements, and street culture aesthetics for a bold, contemporary look.",
    image: `${supabase.storage.from('themes').getPublicUrl('street-art.jpg').data.publicUrl}`,
  },
  {
    id: 9,
    title: "Watercolor Dreams",
    description: "Convert photos into delicate watercolor paintings with soft colors, artistic brush strokes, and dreamy, flowing effects.",
    image: `${supabase.storage.from('themes').getPublicUrl('watercolor.jpg').data.publicUrl}`,
  }
];

const Themes = () => {
  return (
    <BaseLayout>
      <div className="space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl text-white mb-4 flex items-center gap-4">
            <Palette className="w-12 h-12" />
            AI Photobooth Themes
          </h1>
          <p className="text-xl text-gray-300">
            Explore our collection of stunning AI-powered photo transformation themes
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <Card 
              key={theme.id} 
              className="overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video relative">
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-semibold text-white">{theme.title}</h3>
                <p className="text-gray-400">{theme.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
};

export default Themes;