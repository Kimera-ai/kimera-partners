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

interface Theme {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
}

const generateThemeFromImage = (imageName: string, index: number): Theme => {
  // Remove file extension and replace underscores/hyphens with spaces
  const title = imageName
    .replace(/\.(jpg|jpeg|png|gif)$/i, '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Generate a description based on the theme name
  const description = `Transform your photos with our ${title.toLowerCase()} theme, creating stunning and unique visual experiences.`;

  // Generate generic features based on the theme
  const features = [
    `${title} style effects`,
    'Professional filters',
    'Custom overlays',
    'Unique aesthetics'
  ];

  return {
    id: index + 1,
    title,
    description,
    image: supabase.storage.from('themes').getPublicUrl(imageName).data.publicUrl,
    features
  };
};

const ThemesSection = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const { toast } = useToast();
  const embedCode = `<iframe src="${window.location.origin}/embed/themes" width="100%" height="800" frameborder="0"></iframe>`;

  useEffect(() => {
    const fetchThemes = async () => {
      const { data: files, error } = await supabase.storage.from('themes').list();
      
      if (error) {
        console.error('Error fetching themes:', error);
        return;
      }

      // Filter for image files only
      const imageFiles = files.filter(file => 
        file.name.match(/\.(jpg|jpeg|png|gif)$/i)
      );

      // Generate themes from image files
      const generatedThemes = imageFiles.map((file, index) => 
        generateThemeFromImage(file.name, index)
      );

      setThemes(generatedThemes);
    };

    fetchThemes();
  }, []);

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
