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
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    eventDate: '',
    additionalNotes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

    try {
      const { error } = await supabase.functions.invoke('send-pricing-request', {
        body: {
          ...formData,
          selectedFeatures,
          totalPrice
        }
      });

      if (error) throw error;

      toast({
        title: "Request Submitted Successfully",
        description: "We'll be in touch with you shortly!",
      });
      
      onClose();
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error Submitting Request",
        description: "Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

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
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
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

          <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-white">Package Details</h3>
            
            {/* Base Package */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-gray-400">Base Package</span>
                <span className="text-white font-medium">{selectedFeatures.basePackage || 'None selected'}</span>
              </div>

              {/* Guest Information */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Guests</span>
                  <span className="text-white">{selectedFeatures.guestCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expected Usage (70%)</span>
                  <span className="text-white">{Math.round(selectedFeatures.guestCount * 0.7)} uses</span>
                </div>
              </div>

              {/* Selected Features */}
              {selectedFeatures.imageFeatures.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Image Features</h4>
                  <ul className="space-y-1">
                    {selectedFeatures.imageFeatures.map((feature, index) => (
                      <li key={index} className="text-sm flex justify-between">
                        <span className="text-gray-400">{feature}</span>
                        <span className="text-white">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedFeatures.videoFeatures.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Video Features</h4>
                  <ul className="space-y-1">
                    {selectedFeatures.videoFeatures.map((feature, index) => (
                      <li key={index} className="text-sm flex justify-between">
                        <span className="text-gray-400">{feature}</span>
                        <span className="text-white">✓</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedFeatures.customWorkflows > 0 && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Custom Workflows</h4>
                  <div className="text-sm flex justify-between">
                    <span className="text-gray-400">Number of Custom Workflows</span>
                    <span className="text-white">{selectedFeatures.customWorkflows}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Total Price */}
            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Investment</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                *Final pricing may vary based on specific requirements and customizations
              </p>
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
