import React, { useState, useEffect } from 'react';
import { 
  Send,
  X,
  Loader,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface PricingRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  selectedFeatures: {
    basePackage: string | null;
    guestCount: number;
    imageFeatures: string[];
    videoFeatures: string[];
    customPipelines: number;
  };
}

const PricingRequestForm = ({ isOpen, onClose, totalPrice, selectedFeatures }: PricingRequestFormProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    eventDate: '',
    additionalNotes: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email
        }));
      }
    };

    if (isOpen) {
      getSession();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1123] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
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
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              required
              icon={Building2}
            />
            
            <FormField
              label="Contact Name"
              name="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              required
              icon={User}
            />
            
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled
              icon={Mail}
            />
            
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              icon={Phone}
            />
            
            <FormField
              label="Event Date"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
              required
              icon={Calendar}
            />
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-3">
            <h3 className="text-lg font-semibold text-white">Selected Package Details</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-400">Base Package:</span>
                <span className="text-white">{selectedFeatures.basePackage || 'None selected'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Guest Count:</span>
                <span className="text-white">{selectedFeatures.guestCount}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Custom Pipelines:</span>
                <span className="text-white">{selectedFeatures.customPipelines}</span>
              </p>
              <div className="pt-3 mt-3 border-t border-white/10">
                <p className="flex justify-between items-center">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ${totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-white mb-2 font-medium">
              Additional Notes
            </label>
            <div className="relative">
              <MessageSquare className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2 
                  text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF2B6E] focus:border-transparent
                  transition-all h-32 resize-none"
                placeholder="Any specific requirements or questions..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-white/10 text-white rounded-xl 
                hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "px-6 py-2.5 bg-gradient-to-r from-[#FF2B6E] to-[#FF068B] text-white rounded-xl",
                "transition-all hover:opacity-90 flex items-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ElementType;
}

const FormField = ({ label, name, type = 'text', value, onChange, required, disabled, icon: Icon }: FormFieldProps) => (
  <div>
    <label htmlFor={name} className="block text-white mb-2 font-medium">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5",
          "text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FF2B6E] focus:border-transparent",
          "transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />
    </div>
  </div>
);

export default PricingRequestForm;