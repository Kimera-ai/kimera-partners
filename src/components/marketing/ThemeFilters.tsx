import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ThemeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
  selectedStyle: string | null;
  setSelectedStyle: (style: string | null) => void;
  availableFeatures: string[];
  availableStyles: string[];
}

const ThemeFilters = ({
  searchTerm,
  setSearchTerm,
  selectedFeature,
  setSelectedFeature,
  selectedStyle,
  setSelectedStyle,
  availableFeatures,
  availableStyles,
}: ThemeFiltersProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="search"
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {availableStyles.map((style) => (
            <Button
              key={style}
              variant={selectedStyle === style ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
              className="flex items-center gap-2 capitalize"
            >
              {selectedStyle === style ? (
                <X size={16} className="text-white" />
              ) : (
                <Filter size={16} />
              )}
              {style}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {availableFeatures.map((feature) => (
          <Button
            key={feature}
            variant={selectedFeature === feature ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedFeature(selectedFeature === feature ? null : feature)}
            className="flex items-center gap-2"
          >
            {selectedFeature === feature ? (
              <X size={16} className="text-white" />
            ) : (
              <Filter size={16} />
            )}
            {feature}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeFilters;