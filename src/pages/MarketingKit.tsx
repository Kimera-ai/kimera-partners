import React, { useState } from 'react';
import { Search, Filter, FileText, Video, Star, Camera, Palette, Package, Code, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BaseLayout from '@/components/layouts/BaseLayout';
import { TabButton } from '@/components/marketing/TabButton';
import { TemplateCard } from '@/components/marketing/TemplateCard';
import { CaseStudyCard } from '@/components/marketing/CaseStudyCard';
import { templates } from '@/data/marketingData';
import { supabase } from '@/integrations/supabase/client';
import type { CaseStudy } from '@/types/marketing';
import { EventPhotoGrid } from '@/components/marketing/EventPhotoGrid';
import { VideoGrid } from '@/components/marketing/VideoGrid';
import EmbeddableThemes from '@/components/marketing/EmbeddableThemes';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const EmbedCodeSection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const embedCode = `<iframe
  src="${window.location.origin}/embed/themes"
  width="100%"
  height="800px"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Embed code has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 space-y-4">
      <Card className="p-6 bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Code className="w-5 h-5" />
            Embed Code
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
          {embedCode}
        </pre>
        <p className="mt-4 text-sm text-gray-400">
          Copy and paste this code into your website to embed the themes gallery.
        </p>
      </Card>
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

  React.useEffect(() => {
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
  const [activeTab, setActiveTab] = useState('themes');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BaseLayout>
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl text-white mb-4">Marketing Kit</h1>
        <p className="text-xl text-gray-300">
          Access ready-to-use marketing materials to promote Kimera AI
        </p>
      </header>

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

      {activeTab === 'event-photos' && <EventPhotosSection />}
      {activeTab === 'templates' && <TemplatesSection />}
      {activeTab === 'case-studies' && <CaseStudiesSection />}
      {activeTab === 'videos' && <VideosSection />}
      {activeTab === 'themes' && (
        <>
          <EmbedCodeSection />
          <div className="mt-8">
            <EmbeddableThemes />
          </div>
        </>
      )}

      <Toaster />
    </BaseLayout>
  );
};

export default MarketingKit;