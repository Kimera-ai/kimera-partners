
import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import NumberFlow from "@number-flow/react";
import { useSession } from "@/hooks/useSession";

interface PricingRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  selectedFeatures: {
    basePackage: string | null;
    guestCount: number;
    imageFeatures: string[];
    videoFeatures: string[];
    customWorkflows: number;
  };
}

const PricingRequestForm = ({ isOpen, onClose, totalPrice, selectedFeatures }: PricingRequestFormProps) => {
  const { session } = useSession();
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.user_metadata?.full_name || '';
  const [isLoading, setIsLoading] = useState(true);
  
  // Format the features without run counts, just comma-separated
  const imageFeaturesList = selectedFeatures.imageFeatures.join(', ');
  const videoFeaturesList = selectedFeatures.videoFeatures.join(', ');
  
  // Create URL parameters for the form
  const formParams = new URLSearchParams();
  
  // Add parameters following the example format
  formParams.append('event_type', 'ai_photo_event');
  formParams.append('client_name', userName);
  formParams.append('client_email', userEmail);
  formParams.append('package_type', selectedFeatures.basePackage || '');
  formParams.append('guest_count', selectedFeatures.guestCount.toString());
  formParams.append('total_price', `$${totalPrice}`);
  formParams.append('image_features', imageFeaturesList);
  formParams.append('video_features', videoFeaturesList);
  formParams.append('custom_workflows', `Custom workflow (${selectedFeatures.customWorkflows} workflows)`);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="min-h-screen w-full animate-fade-in py-4">
        <div className="bg-[#1A1123] border border-white/10 rounded-2xl w-full max-w-5xl mx-auto">
          <div className="sticky top-0 bg-[#1A1123]/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pricing Request
              </h2>
              <p className="text-gray-400 text-sm mt-1">Fill out the form below to get started</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8 space-y-6 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1A1123]/80 backdrop-blur-sm z-10">
                <Loader className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            )}
            <iframe 
              src={`https://kimeracrm.netlify.app/embed/event-form?${formParams.toString()}`}
              width="100%" 
              className="rounded-xl bg-transparent h-[calc(100vh-8rem)] min-h-[800px] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)]"
              style={{ border: 'none' }}
              title="Event Request Form"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingRequestForm;
