import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Video, Star, Camera } from 'lucide-react';
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
        <nav className="flex gap-8">
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
        </nav>
      </div>

      {/* Content Sections */}
      {activeTab === 'event-photos' && <EventPhotosSection />}
      {activeTab === 'templates' && <TemplatesSection />}
      {activeTab === 'case-studies' && <CaseStudiesSection />}
      {activeTab === 'videos' && <VideosSection />}
    </BaseLayout>
  );
};

export default MarketingKit;
