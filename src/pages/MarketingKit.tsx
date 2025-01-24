import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Video, Star, Camera, Palette, Package, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BaseLayout from '@/components/layouts/BaseLayout';
import { TabButton } from '@/components/marketing/TabButton';
import { TemplateCard } from '@/components/marketing/TemplateCard';
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard';
import { VideoCard } from '@/components/marketing/VideoCard';
import { templates, videos } from '@/data/marketingData';
import { supabase } from '@/integrations/supabase/client';
import type { CaseStudy } from '@/types/marketing';
import { EventPhotoGrid } from '@/components/marketing/EventPhotoGrid';
import { VideoGrid } from '@/components/marketing/VideoGrid';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const themes = [
  {
    id: 1,
    title: "Vintage Hollywood",
    description: "Transform guests into classic movie stars with a timeless black and white aesthetic.",
    image: `${supabase.storage.from('themes').getPublicUrl('vintage.jpg').data.publicUrl}`,
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
    description: "Transport attendees to a neon-lit future with vibrant colors and digital glitches.",
    image: supabase.storage.from('themes').getPublicUrl('cyberpunk.jpg').data.publicUrl,
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
    description: "Create magical transformations with ethereal lighting and mystical elements.",
    image: supabase.storage.from('themes').getPublicUrl('fantasy.jpg').data.publicUrl,
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
    description: "Transform photos into vibrant pop art masterpieces with bold colors.",
    image: supabase.storage.from('themes').getPublicUrl('pop-art.jpg').data.publicUrl,
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
    description: "Create elegant transformations with clean lines and refined aesthetics.",
    image: supabase.storage.from('themes').getPublicUrl('minimal.jpg').data.publicUrl,
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
    description: "Transform photos with pixelated effects and classic gaming aesthetics.",
    image: supabase.storage.from('themes').getPublicUrl('gaming.jpg').data.publicUrl,
    features: [
      "8-bit pixel effects",
      "Retro game aesthetics",
      "Classic gaming overlays",
      "Nostalgic color schemes"
    ]
  },
  {
    id: 7,
    title: "Neon Dreams",
    description: "Create stunning neon-lit portraits with vibrant color effects.",
    image: supabase.storage.from('themes').getPublicUrl('neon.jpg').data.publicUrl,
    features: [
      "Neon light effects",
      "Vibrant color schemes",
      "Atmospheric glow",
      "Urban night aesthetics"
    ]
  },
  {
    id: 8,
    title: "Watercolor Art",
    description: "Transform photos into beautiful watercolor paintings.",
    image: supabase.storage.from('themes').getPublicUrl('watercolor.jpg').data.publicUrl,
    features: [
      "Watercolor effects",
      "Artistic brushstrokes",
      "Soft color blending",
      "Painterly textures"
    ]
  },
  {
    id: 9,
    title: "Anime Style",
    description: "Convert photos into anime-inspired artwork with distinctive styling.",
    image: supabase.storage.from('themes').getPublicUrl('anime.jpg').data.publicUrl,
    features: [
      "Anime aesthetics",
      "Cell shading",
      "Character styling",
      "Manga-inspired effects"
    ]
  }
];

const TemplatesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {templates.map(template => (
      <TemplateCard key={template.id} template={template} />
    ))}
  </div>
);

const CaseStudiesSection = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCaseStudies(data || []);
      } catch (error) {
        console.error('Error fetching case studies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading case studies...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {caseStudies.map(study => (
        <CaseStudyCard key={study.id} study={study} />
      ))}
    </div>
  );
};

const VideosSection = () => (
  <div className="space-y-8">
    <h2 className="text-xl text-white">Videos</h2>
    <VideoGrid />
  </div>
);

const EventPhotosSection = () => (
  <div className="space-y-8">
    <h2 className="text-xl text-white">Event Photos</h2>
    <EventPhotoGrid />
  </div>
);

const ThemesSection = () => {
  const { toast } = useToast();
  const embedCode = `<iframe src="${window.location.origin}/embed/themes" width="100%" height="800" frameborder="0"></iframe>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Success!",
        description: "Embed code copied to clipboard",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy embed code",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-4">
        <Button
          variant="outline"
          className="border-white/20 hover:bg-white/20 text-white"
          onClick={handleCopyEmbed}
        >
          <Code className="w-4 h-4 mr-2" />
          Place In Your Website
        </Button>
      </div>
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
                src={theme.image}
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

const MarketingKit = () => {
  const [activeTab, setActiveTab] = useState('event-photos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BaseLayout>
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl text-white mb-4">Marketing Kit</h1>
        <p className="text-xl text-gray-300">
          Access ready-to-use marketing materials to promote Kimera AI
        </p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search marketing materials..."
            className="pl-10 bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-white/20 hover:bg-white/20 text-white">
          <Filter size={20} className="mr-2" />
          <span>Filter</span>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 mb-8">
        <nav className="flex gap-8 overflow-x-auto">
          <TabButton 
            active={activeTab === 'event-photos'} 
            onClick={() => setActiveTab('event-photos')}
            icon={Camera}
          >
            Event Photos
          </TabButton>
          <TabButton 
            active={activeTab === 'templates'} 
            onClick={() => setActiveTab('templates')}
            icon={FileText}
          >
            Templates
          </TabButton>
          <TabButton 
            active={activeTab === 'case-studies'} 
            onClick={() => setActiveTab('case-studies')}
            icon={Star}
          >
            Case Studies
          </TabButton>
          <TabButton 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')}
            icon={Video}
          >
            Videos
          </TabButton>
          <TabButton 
            active={activeTab === 'themes'}
            onClick={() => setActiveTab('themes')}
            icon={Palette}
          >
            Themes
          </TabButton>
        </nav>
      </div>

      {/* Content Sections */}
      {activeTab === 'event-photos' && <EventPhotosSection />}
      {activeTab === 'templates' && <TemplatesSection />}
      {activeTab === 'case-studies' && <CaseStudiesSection />}
      {activeTab === 'videos' && <VideosSection />}
      {activeTab === 'themes' && <ThemesSection />}

      <Toaster />
    </BaseLayout>
  );
};

export default MarketingKit;