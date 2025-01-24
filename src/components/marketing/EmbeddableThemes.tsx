import React from 'react';
import { Card } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const themes = [
  {
    id: 1,
    title: "Vintage Hollywood",
    description: "Transform guests into classic movie stars with a timeless black and white aesthetic.",
    imageName: "vintage.jpg",
    features: [
      "Black & white film aesthetics",
      "Classic Hollywood lighting",
      "Vintage film grain effects",
      "Glamorous portrait styles"
    ]
  },
  {
    id: 2,
    title: "Cyberpunk Future",
    description: "Transport attendees to a neon-lit future with vibrant colors, digital glitches, and futuristic elements inspired by sci-fi aesthetics.",
    imageName: "cyberpunk.jpg",
    features: [
      "Neon color effects",
      "Digital glitch overlays",
      "Futuristic backgrounds",
      "Sci-fi inspired filters"
    ]
  },
  {
    id: 3,
    title: "Fantasy Realms",
    description: "Create magical transformations with ethereal lighting, mystical backgrounds, and fantasy-inspired elements that transport guests to enchanted worlds.",
    imageName: "fantasy.jpg",
    features: [
      "Magical light effects",
      "Mystical backgrounds",
      "Fantasy-inspired elements",
      "Ethereal color grading"
    ]
  },
  {
    id: 4,
    title: "Pop Art",
    description: "Transform photos into vibrant pop art masterpieces with bold colors, comic book-style effects, and artistic filters inspired by Andy Warhol.",
    imageName: "pop-art.jpg",
    features: [
      "Bold color palettes",
      "Comic book effects",
      "Warhol-inspired filters",
      "Retro pop styling"
    ]
  },
  {
    id: 5,
    title: "Minimalist",
    description: "Create elegant transformations with clean lines, subtle effects, and refined aesthetics that emphasize simplicity and sophistication.",
    imageName: "minimal.jpg",
    features: [
      "Clean compositions",
      "Subtle color effects",
      "Elegant lighting",
      "Modern aesthetics"
    ]
  },
  {
    id: 6,
    title: "Retro Gaming",
    description: "Transform photos with pixelated effects, 8-bit styling, and classic gaming aesthetics that appeal to nostalgia and gaming culture.",
    imageName: "gaming.jpg",
    features: [
      "8-bit pixel effects",
      "Retro game aesthetics",
      "Classic gaming overlays",
      "Nostalgic color schemes"
    ]
  }
];

const EmbeddableThemes = () => {
  const getThemeImageUrl = (imageName: string) => {
    const { data } = supabase.storage
      .from('themes')
      .getPublicUrl(imageName);
    
    console.log(`Generated URL for ${imageName}:`, data.publicUrl);
    return data.publicUrl;
  };
  
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
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className="overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="aspect-[4/3] relative">
              <img
                src={getThemeImageUrl(theme.imageName)}
                alt={theme.title}
                className="object-cover w-full h-full"
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
        ))}
      </div>
    </div>
  );
};

export default EmbeddableThemes;