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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
          <Input
            type="search"
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 min-w-[300px] bg-white/[0.03] border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-lg"
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
    </div>
  );
};

export default ThemeFilters;