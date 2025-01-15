import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Copy,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BaseLayout from '@/components/layouts/BaseLayout';

// Sample Data
const visualAssets = [
  {
    id: 1,
    type: 'image',
    category: 'Product Screenshots',
    title: 'AI Photobooth Interface',
    description: 'High-resolution screenshot of the Kimera AI photobooth interface',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    downloadUrl: '/sample-files/product-screenshot-1.jpg',
    dimensions: '2400x1600px',
    fileSize: '2.4 MB',
    tags: ['interface', 'product', 'photobooth']
  },
  {
    id: 2,
    type: 'image',
    category: 'Event Photos',
    title: 'Live Event Example',
    description: 'Kimera AI photobooth in action at a corporate event',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    downloadUrl: '/sample-files/event-photo-1.jpg',
    dimensions: '2400x1600px',
    fileSize: '3.1 MB',
    tags: ['event', 'live', 'corporate']
  },
  {
    id: 3,
    type: 'logo',
    category: 'Brand Assets',
    title: 'Kimera AI Logo Pack',
    description: 'Complete logo package including all variations and formats',
    thumbnail: 'https://images.unsplash.com/photo-1557683311-eac922347aa1',
    downloadUrl: '/sample-files/kimera-logos.zip',
    dimensions: 'Various',
    fileSize: '8.7 MB',
    tags: ['logo', 'brand', 'identity']
  }
];

const templates = [
  {
    id: 1,
    type: 'social',
    title: 'Instagram Post Template',
    description: 'Ready-to-use templates for promoting AI photobooth events',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    downloadUrl: '#',
    format: 'PSD, AI',
    fileSize: '12.4 MB'
  },
  {
    id: 2,
    type: 'presentation',
    title: 'Pitch Deck Template',
    description: 'Professional presentation template for client meetings',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    downloadUrl: '#',
    format: 'PPTX',
    fileSize: '8.2 MB'
  }
];

const caseStudies = [
  {
    id: 1,
    title: 'Mary Dowling Whisky Campaign',
    description: 'How Kimera AI transformed a whisky brand\'s event experience',
    thumbnail: 'https://images.unsplash.com/photo-1513708847802-f2fa846a7eaa',
    downloadUrl: '#',
    results: ['15 new bookings', '1000+ social shares'],
    fileSize: '4.2 MB'
  },
  {
    id: 2,
    title: 'Fashion Week Integration',
    description: 'Elevating the fashion week experience with AI photography',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
    downloadUrl: '#',
    results: ['2500+ photos', '35% engagement rate'],
    fileSize: '3.8 MB'
  }
];

const videos = [
  {
    id: 1,
    title: 'Kimera AI Product Overview',
    description: 'A comprehensive look at our AI photobooth solution',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279',
    downloadUrl: '#',
    duration: '2:15',
    fileSize: '48.2 MB'
  },
  {
    id: 2,
    title: 'Setup Tutorial',
    description: 'Step-by-step guide to setting up the Kimera AI system',
    thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb',
    downloadUrl: '#',
    duration: '4:30',
    fileSize: '86.5 MB'
  }
];

// Tab Button Component
interface TabButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}

const TabButton = ({ children, active, onClick, icon }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
      active 
        ? 'border-primary text-white' 
        : 'border-transparent text-gray-400 hover:text-white'
    }`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

// Card Components
const VisualAssetCard = ({ asset }: { asset: typeof visualAssets[0] }) => {
  const handleDownload = async () => {
    // For the logo pack specifically, use the direct Supabase URL
    if (asset.title === 'Kimera AI Logo Pack') {
      const logoPackUrl = 'https://gerodpwicbuukllgkmzg.supabase.co/storage/v1/object/public/marketing_materials/Logo%20design.rar?t=2025-01-15T14%3A16%3A41.368Z';
      
      try {
        const response = await fetch(logoPackUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kimera-logo-pack.rar';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    } else {
      // Handle other asset downloads here
      window.open(asset.downloadUrl, '_blank');
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
      <div className="aspect-video relative group">
        <img src={asset.thumbnail} alt={asset.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <Button 
            variant="default" 
            size="icon" 
            className="bg-primary hover:bg-primary-hover"
            onClick={handleDownload}
          >
            <Download className="text-white" size={20} />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="text-sm text-primary mb-2">{asset.category}</div>
        <h3 className="text-white text-lg mb-2">{asset.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{asset.dimensions}</span>
          <span>{asset.fileSize}</span>
        </div>
      </div>
    </div>
  );
};

const TemplateCard = ({ template }: { template: typeof templates[0] }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
    <div className="aspect-square relative group">
      <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
          <Download className="text-white" size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
          <Copy className="text-white" size={20} />
        </Button>
      </div>
    </div>
    <div className="p-6">
      <div className="text-sm text-primary mb-2">{template.type}</div>
      <h3 className="text-white text-lg mb-2">{template.title}</h3>
      <p className="text-gray-300 text-sm mb-3">{template.description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>{template.format}</span>
        <span>{template.fileSize}</span>
      </div>
    </div>
  </div>
);

const CaseStudyCard = ({ study }: { study: typeof caseStudies[0] }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
    <div className="aspect-video relative">
      <img src={study.thumbnail} alt={study.title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <h3 className="text-white text-xl mb-3">{study.title}</h3>
      <p className="text-gray-300 text-sm mb-4">{study.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {study.results.map((result, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {result}
          </span>
        ))}
      </div>
      <Button variant="ghost" className="text-white hover:text-primary">
        <Download size={20} className="mr-2" />
        <span>Download Case Study ({study.fileSize})</span>
      </Button>
    </div>
  </div>
);

const VideoCard = ({ video }: { video: typeof videos[0] }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
    <div className="aspect-video relative group">
      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <Button variant="default" size="icon" className="bg-primary hover:bg-primary-hover">
          <Download className="text-white" size={20} />
        </Button>
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/75 rounded text-white text-sm">
        {video.duration}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-white text-lg mb-2">{video.title}</h3>
      <p className="text-gray-300 text-sm mb-3">{video.description}</p>
      <div className="text-sm text-gray-400">{video.fileSize}</div>
    </div>
  </div>
);

// Section Components
const VisualAssetsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {visualAssets.map(asset => (
      <VisualAssetCard key={asset.id} asset={asset} />
    ))}
  </div>
);

const TemplatesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {templates.map(template => (
      <TemplateCard key={template.id} template={template} />
    ))}
  </div>
);

const CaseStudiesSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {caseStudies.map(study => (
      <CaseStudyCard key={study.id} study={study} />
    ))}
  </div>
);

const VideosSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {videos.map(video => (
      <VideoCard key={video.id} video={video} />
    ))}
  </div>
);

const MarketingKit = () => {
  const [activeTab, setActiveTab] = useState('visual-assets');
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
            active={activeTab === 'visual-assets'} 
            onClick={() => setActiveTab('visual-assets')}
            icon={<ImageIcon size={20} />}
          >
            Visual Assets
          </TabButton>
          <TabButton 
            active={activeTab === 'templates'} 
            onClick={() => setActiveTab('templates')}
            icon={<FileText size={20} />}
          >
            Templates
          </TabButton>
          <TabButton 
            active={activeTab === 'case-studies'} 
            onClick={() => setActiveTab('case-studies')}
            icon={<Star size={20} />}
          >
            Case Studies
          </TabButton>
          <TabButton 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')}
            icon={<Video size={20} />}
          >
            Videos
          </TabButton>
        </nav>
      </div>

      {/* Content Sections */}
      {activeTab === 'visual-assets' && <VisualAssetsSection />}
      {activeTab === 'templates' && <TemplatesSection />}
      {activeTab === 'case-studies' && <CaseStudiesSection />}
      {activeTab === 'videos' && <VideosSection />}
    </BaseLayout>
  );
};

export default MarketingKit;
