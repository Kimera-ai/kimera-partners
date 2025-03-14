
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { GalleryHorizontal, Loader2, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ThemeFilters from './ThemeFilters';

interface Theme {
  id: string;
  title: string;
  description: string;
  name: string;
  features: string[];
  image_url: string | null;
  style: string;
}

const EmbeddableThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const fetchThemes = async () => {
    try {
      console.log('Starting to fetch themes...');
      const { data: themeData, error: themeError } = await supabase
        .from('themes')
        .select('*');

      if (themeError) {
        console.error('Error fetching themes:', themeError);
        setError('Failed to fetch themes');
        return;
      }

      if (!themeData) {
        setError('No themes found in the database');
        return;
      }

      console.log('Themes fetched:', themeData);
      setThemes(themeData);
    } catch (err) {
      console.error('Unexpected error in fetchThemes:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  // Extract unique features and styles from all themes
  const { availableFeatures, availableStyles } = useMemo(() => {
    const featureSet = new Set<string>();
    const styleSet = new Set<string>();
    themes.forEach(theme => {
      theme.features.forEach(feature => featureSet.add(feature));
      styleSet.add(theme.style);
    });
    return {
      availableFeatures: Array.from(featureSet).sort(),
      availableStyles: Array.from(styleSet).sort()
    };
  }, [themes]);

  // Filter themes based on search term, selected feature, and selected style
  const filteredThemes = useMemo(() => {
    return themes.filter(theme => {
      const matchesSearch = 
        searchTerm === '' ||
        theme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFeature = 
        !selectedFeature ||
        theme.features.includes(selectedFeature);

      const matchesStyle =
        !selectedStyle ||
        theme.style === selectedStyle;

      return matchesSearch && matchesFeature && matchesStyle;
    });
  }, [themes, searchTerm, selectedFeature, selectedStyle]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-gray-400">Loading themes...</p>
      </div>
    );
  }

  if (error || themes.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error || 'No themes found'}</p>
        </div>
        <p className="text-gray-400">Please make sure there are themes in the database.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#100919] text-gray-300 p-8">
      <header className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-4">
          <GalleryHorizontal className="w-8 h-8" />
          AI Stock Themes
        </h2>
        <p className="text-xl text-gray-300 mb-4">
          Transform your events with our collection of stunning AI-powered photo themes.
          Each theme offers unique visual effects and artistic transformations.
        </p>
        <div className="text-lg bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">
          {filteredThemes.length} themes
        </div>
      </header>

      <ThemeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        availableFeatures={availableFeatures}
        availableStyles={availableStyles}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredThemes.map((theme) => (
          <Card 
            key={theme.id} 
            className="group overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm flex flex-col h-full"
          >
            <div className="relative w-full h-[320px] overflow-hidden bg-black/20">
              <img
                src={theme.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'}
                alt={theme.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Error loading image for ${theme.title}`);
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => setSelectedImage(theme.image_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b')}
                  className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  View Theme
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-semibold text-white group-hover:text-primary transition-colors">
                  {theme.title}
                </h3>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full capitalize">
                  {theme.style}
                </span>
              </div>
              <p className="text-gray-400 line-clamp-2 mt-2 flex-grow">
                {theme.description}
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-primary mb-2">Features:</h4>
                <ul className="grid grid-cols-2 gap-2 text-left">
                  {theme.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full mr-2 flex-shrink-0 mt-1.5" />
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImage} 
            alt="Theme Preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default EmbeddableThemes;
