import React from 'react';
import { Palette } from 'lucide-react';
import BaseLayout from '@/components/layouts/BaseLayout';
import { Card } from '@/components/ui/card';

const themes = [
  {
    id: 1,
    title: "Vintage Hollywood",
    description: "Transform guests into classic movie stars with a timeless black and white aesthetic.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  },
  {
    id: 2,
    title: "Cyberpunk Future",
    description: "Transport attendees to a neon-lit future with vibrant colors and futuristic elements.",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  },
  {
    id: 3,
    title: "Fantasy Realms",
    description: "Create magical transformations with ethereal lighting and mystical backgrounds.",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
  },
  {
    id: 4,
    title: "Pop Art",
    description: "Bold, vibrant colors and comic book-style effects for a playful, artistic experience.",
    image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
  },
  {
    id: 5,
    title: "Minimalist",
    description: "Clean, elegant transformations with subtle effects and refined aesthetics.",
    image: "https://images.unsplash.com/photo-1551038247-3d9af20df552",
  },
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
            <Card key={theme.id} className="overflow-hidden bg-card hover:bg-card/80 transition-colors">
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