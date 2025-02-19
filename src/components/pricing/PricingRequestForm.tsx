
import React from 'react';
import { X } from 'lucide-react';
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
  
  // Create URL parameters for the form
  const formParams = new URLSearchParams({
    email: userEmail,
    package: selectedFeatures.basePackage || '',
    guestCount: selectedFeatures.guestCount.toString(),
    totalPrice: totalPrice.toString(),
    imageFeatures: selectedFeatures.imageFeatures.join(','),
    videoFeatures: selectedFeatures.videoFeatures.join(','),
    customWorkflows: selectedFeatures.customWorkflows.toString()
  });
  
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
          
          <div className="p-8 space-y-6">
            {/* Pricing Summary */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Package Summary
              </h3>
              
              <div className="space-y-4 text-sm">
                {selectedFeatures.basePackage && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Base Package:</span>
                    <span className="text-white">{selectedFeatures.basePackage}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Guest Count:</span>
                  <span className="text-white">{selectedFeatures.guestCount}</span>
                </div>

                {selectedFeatures.imageFeatures.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-gray-400">Image Features:</span>
                    <ul className="list-disc pl-4 text-white space-y-1">
                      {selectedFeatures.imageFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedFeatures.videoFeatures.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-gray-400">Video Features:</span>
                    <ul className="list-disc pl-4 text-white space-y-1">
                      {selectedFeatures.videoFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedFeatures.customWorkflows > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Custom Workflows:</span>
                    <span className="text-white">{selectedFeatures.customWorkflows}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Price:</span>
                    <NumberFlow
                      format={{ style: "currency", currency: "USD" }}
                      value={totalPrice}
                      className="text-lg font-bold text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Form */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
              <iframe 
                src={`https://kimeracrm.netlify.app/embed/event-form?${formParams.toString()}`}
                width="100%" 
                height="800px"
                className="rounded-xl bg-transparent"
                style={{ border: 'none' }}
                title="Event Request Form"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingRequestForm;
