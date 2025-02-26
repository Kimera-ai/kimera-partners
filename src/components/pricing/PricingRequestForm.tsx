
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate expected runs (70% usage rate)
  const expectedRuns = Math.round(selectedFeatures.guestCount * 0.7);
  
  // Create feature strings with run counts, separated by comma and space
  const imageFeatureRuns = selectedFeatures.imageFeatures
    .map(feature => `${feature} (${expectedRuns} runs)`)
    .join(', ');
  
  const videoFeatureRuns = selectedFeatures.videoFeatures
    .map(feature => `${feature} (${expectedRuns} runs)`)
    .join(', ');
  
  // Create URL parameters for the form
  const formParams = new URLSearchParams();
  formParams.set('email', userEmail);
  formParams.set('package_type', selectedFeatures.basePackage || '');
  formParams.set('guest_count', selectedFeatures.guestCount.toString());
  formParams.set('total_price', totalPrice.toString());
  formParams.set('image_features', imageFeatureRuns);
  formParams.set('video_features', videoFeatureRuns);
  formParams.set('custom_workflows', selectedFeatures.customWorkflows.toString());
  
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
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Request Summary</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="text-gray-400">Email:</span> {userEmail}</p>
                <p><span className="text-gray-400">Package:</span> {selectedFeatures.basePackage}</p>
                <p><span className="text-gray-400">Total Price:</span> ${totalPrice}</p>
                <p><span className="text-gray-400">Guest Count:</span> {selectedFeatures.guestCount}</p>
              </div>
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1A1123]/80 backdrop-blur-sm z-10">
                <Loader className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            )}
            <iframe 
              src={`https://kimeracrm.netlify.app/embed/event-form?${formParams.toString()}`}
              width="100%" 
              height="800px"
              className="rounded-xl bg-transparent"
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
