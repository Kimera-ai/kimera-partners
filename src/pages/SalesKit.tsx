import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import BaseLayout from '@/components/layouts/BaseLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

// Sample data structures
const salesCategories = [
  {
    id: 1,
    title: "Pitch Decks",
    description: "Customizable presentations for different industries",
    icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=40&h=40&fit=crop",
    count: 12
  },
  {
    id: 2,
    title: "Sales Scripts",
    description: "Industry-specific conversation guides",
    icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=40&h=40&fit=crop",
    count: 8
  },
  {
    id: 3,
    title: "Case Studies",
    description: "Real success stories and implementations",
    icon: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=40&h=40&fit=crop",
    count: 15
  }
];

const resourceSections = [
  {
    id: 1,
    title: "Featured Resources",
    resources: [
      {
        id: 1,
        type: "presentation",
        title: "Kimera AI Complete Pitch Deck",
        description: "Comprehensive presentation covering all Kimera AI solutions",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
        downloadUrl: "#",
        previewUrl: "#"
      },
      {
        id: 2,
        type: "case study",
        title: "Event Industry Success Story",
        description: "How Kimera AI transformed event photography",
        thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop",
        downloadUrl: "#",
        previewUrl: "#"
      },
      {
        id: 3,
        type: "product sheet",
        title: "Technical Specifications",
        description: "Detailed product specifications and requirements",
        thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=225&fit=crop",
        downloadUrl: "#",
        previewUrl: "#"
      }
    ]
  }
];

const CategoryCard = ({ title, description, icon, count }: {
  title: string;
  description: string;
  icon: string;
  count: number;
}) => {
  return (
    <Card className="hover:border-[#FF2B6E]/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4 p-6">
        <img src={icon} alt="" className="w-10 h-10 rounded" />
        <div>
          <h3 className="text-white text-xl mb-2">{title}</h3>
          <p className="text-gray-300 text-sm mb-3">{description}</p>
          <p className="text-gray-400 text-sm">{count} items</p>
        </div>
      </div>
    </Card>
  );
};

const ResourceCard = ({ type, title, description, thumbnail, downloadUrl, previewUrl }: {
  type: string;
  title: string;
  description: string;
  thumbnail: string;
  downloadUrl: string;
  previewUrl: string;
}) => {
  return (
    <Card className="overflow-hidden hover:border-[#FF2B6E]/50 transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-video relative group">
        <img src={thumbnail} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
            <Eye className="text-white" size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
            <Download className="text-white" size={20} />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="text-sm text-[#FF2B6E] mb-2">{type}</div>
        <h3 className="text-white text-lg mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </Card>
  );
};

const ResourceSection = ({ title, resources }: {
  title: string;
  resources: Array<{
    id: number;
    type: string;
    title: string;
    description: string;
    thumbnail: string;
    downloadUrl: string;
    previewUrl: string;
  }>;
}) => {
  return (
    <div>
      <h2 className="text-2xl text-white mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} {...resource} />
        ))}
      </div>
    </div>
  );
};

const SalesKit = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BaseLayout>
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl text-white mb-4">Sales Kit</h1>
        <p className="text-xl text-gray-300">Everything you need to sell Kimera AI solutions effectively</p>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search sales materials..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={20} />
          <span>Filter</span>
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {salesCategories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>

      {/* Resources Section */}
      <section className="space-y-8">
        {resourceSections.map((section) => (
          <ResourceSection key={section.id} {...section} />
        ))}
      </section>
    </BaseLayout>
  );
};

export default SalesKit;